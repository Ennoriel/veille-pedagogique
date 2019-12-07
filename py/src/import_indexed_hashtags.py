import requests
from yaml import load as yaml_load, BaseLoader
from pymongo import MongoClient
from mongo.hashtag_mongo import HashtagMongo


def import_indexed_hashtags():
	"""
	import indexed hashtags from a file indexed_hashtags.csv
	:return: None
	"""
	headers = {
		'Authorization': yaml_load(open("./../resources/credentials.yaml"), Loader=BaseLoader)["jeton"]["super_user"]
	}

	# First line ignored
	# no empty line at the end
	with open('../resources/indexed_hashtags.csv', 'r', encoding='UTF-8') as f:
		hashtags = f.read()

	hashtags = hashtags.split("\n")

	hashtags = [h for h in hashtags if not h.endswith(";;;")]

	hashtags = hashtags[1:]

	hashtag_url = "http://localhost:3001/api/hashtag"
	db_hashtags = requests.get(url=hashtag_url, headers=headers).json()

	if type(db_hashtags) is dict:
		print("You shall not pass!")
		return

	hashtag_number = len(hashtags)
	for index, hashtag_entry in enumerate(hashtags, start=1):

		# num, name in enumerate(presidents, start=1):

		parsed_hashtag = hashtag_entry.split(";")

		print("")
		print("{}/{} - {}".format(index, hashtag_number, parsed_hashtag[0]))

		_id = next((db_h["_id"] for db_h in db_hashtags if db_h["entry"] == parsed_hashtag[0]), False)

		print("        id found: " + str(_id))

		if _id:
			o = {
				"entry": parsed_hashtag[0],
				"articleToBeDeleted": str(parsed_hashtag[3]).startswith('TRUE'),
				"themeToBeDeleted": str(parsed_hashtag[4]).startswith('TRUE')
			}

			if parsed_hashtag[2]:
				o["associatedThemes"] = parsed_hashtag[2].split('|')

			print("        " + str(o))

			requests.put(hashtag_url + "/" + _id, json=o, headers=headers)


def dump_db():
	"""
	dump an existing db in another one. Both db are chosen by keyboard input
	:return: None
	"""
	client_input = get_db_from_user_input("Quelle BDD sauvegarder (dev, prod, dump) ? ")
	client_output = get_db_from_user_input("Quelle BDD de destination (dev, prod, dump) ? ")

	dbs = ["articles", "hashtags", "themes", "tweets", "users"]

	reset_db(mongo_client=client_output)

	for db in dbs:
		print("traitement de la base de données : " + db)
		res = list(client_input[db].find())
		if len(res):
			client_output[db].insert_many(list(res))

		for name, index_info in client_input[db].index_information().items():
			keys = index_info['key']
			del (index_info['ns'])
			del (index_info['v'])
			del (index_info['key'])
			client_output[db].create_index(keys, name=name, **index_info)


def reset_db(mongo_client=None):
	"""
	reset a db. The db is chosen by keyboard input or param.
	:param mongo_client: mongo client to reset
	:return: None
	"""
	if not mongo_client:
		mongo_client = get_db_from_user_input("Quelle BDD supprimer (dev, prod, dump) ? ")

	dbs = ["articles", "hashtags", "themes", "tweets", "users"]

	for db in dbs:
		mongo_client[db].drop()
		mongo_client.create_collection(db)

	mongo_client["articles"].create_index("url", unique=True)
	mongo_client["hashtags"].create_index("entry", unique=True)
	mongo_client["themes"].create_index("theme", unique=True)
	mongo_client["tweets"].create_index("id", unique=True)
	mongo_client["users"].create_index("username", unique=True)
	mongo_client["users"].create_index("email", unique=True)


def get_db_from_user_input(text="Choisissez la BDD (dev, prod, dump) ? "):
	"""
	connect to the mongo client chosen by the user
	:param text: text to display to the user before chosing the db
	:return: mongo client
	"""
	db = input(text)

	conf = yaml_load(open("./../resources/credentials.yaml"), Loader=BaseLoader)["mongodb"]

	conf_dbs = {
		"dev": yaml_load(open("./../resources/credentials.yaml"), Loader=BaseLoader)["mongodb_dev"],
		"prod": yaml_load(open("./../resources/credentials.yaml"), Loader=BaseLoader)["mongodb_prod"],
		"dump": yaml_load(open("./../resources/credentials.yaml"), Loader=BaseLoader)["mongodb_dump"]
	}

	conf_db = conf_dbs.get(db)
	mongo_client = connect_mongo_client(conf_db["url"], conf_db["db"], conf["user"], conf["pwd"])

	return mongo_client


def make_mongo_url(user, pwd, url, db):
	"""
	makes the mongo url string
	:param user: user
	:param pwd: password
	:param url: url
	:param db: db
	:return: mongo url string
	"""
	return "mongodb://" + user + ":" + pwd + "@" + url + "/" + db


def connect_mongo_client(url, db, user=None, pwd=None):
	"""
	connect to a mongo client
	:param user: user
	:param pwd: password
	:param url: url
	:param db: db
	:return: mongo client
	"""
	if bool(user) != bool(pwd):
		raise Exception("erreur")
	elif not user:
		return MongoClient(url, retryWrites=False)[db]
	else:
		return MongoClient(make_mongo_url(user, pwd, url, db), retryWrites=False)[db]


def export_hashtags():
	"""
	export hastags of a db in a file hashtag_out.txt
	:return:
	"""
	hashtag_mongo = HashtagMongo(get_db_from_user_input("Choisissez la BDD (dev, prod, dump) ? "))
	hashtags = hashtag_mongo.gets_all()
	hashtags = list(hashtags)

	with open('./../resources/hashtag_out.txt', 'a', encoding='UTF-8') as f:
		f.writelines("%s\n" % hashtag["entry"] for hashtag in hashtags)

	print("Hashtags exported in the file hashtag_out.txt")


def __init__():
	"""
	init method. Used to chose which action to do on a db
	:return: None
	"""
	en_cours = True

	while en_cours:

		print("|== === === === === === === === === === === === === === === ==|\n"
			  "| Actions :                                                   |\n"
			  "|   1. reset DB                                               |\n"
			  "|   2. dump DB                                                |\n"
			  "|   3. import_indexed_hashtags (file indexed_hashtags.csv)    |\n"
			  "|   4. export_hashtags                                        |\n"
			  "|                                                             |\n"
			  "|   9. quitter le programme                                   |\n"
			  "|== === === === === === === === === === === === === === === ==|")
		choix = input()

		if choix == "1":
			reset_db()
		elif choix == "2":
			dump_db()
		elif choix == "3":
			import_indexed_hashtags()
		elif choix == "4":
			export_hashtags()
		elif choix == "9":
			en_cours = False


__init__()

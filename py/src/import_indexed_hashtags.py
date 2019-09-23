import requests
from yaml import load as yaml_load, BaseLoader
from pymongo import MongoClient
from Tweet import Hashtag
from hashtag_mongo import HashtagMongo


def import_indexed_hashtags():
	headers = {'Authorization': yaml_load(open("./../resources/credentials.yaml"), Loader=BaseLoader)["jeton"]["super_user"]}

	# First lign ignored
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

	for hashtag_entry in hashtags:

		parsed_hashtag = hashtag_entry.split(";")

		print("")
		print(parsed_hashtag[0])

		_id = next((db_h["_id"] for db_h in db_hashtags if db_h["entry"] == parsed_hashtag[0]), False)

		print("    id found: " + str(_id))

		if _id:
			o = {
				"entry": parsed_hashtag[0],
				"articleToBeDeleted": str(parsed_hashtag[3]).startswith('TRUE'),
				"themeToBeDeleted": str(parsed_hashtag[4]).startswith('TRUE')
			}

			if parsed_hashtag[2]:
				o["associatedThemes"] = parsed_hashtag[2].split('|')

			print("    " + str(o))

			requests.put(hashtag_url + "/" + _id, json=o, headers=headers)


def dump_db():

	db_input = input("Quelle BDD sauvegarder (dev, prod, dump) ? ")
	db_output = input("Quelle BDD de destination (dev, prod, dump) ? ")

	dbs = ["articles", "hashtags", "themes", "tweets", "users"]

	conf = yaml_load(open("./../resources/credentials.yaml"), Loader=BaseLoader)["mongodb"]

	conf_dbs = {
		"dev" : yaml_load(open("./../resources/credentials.yaml"), Loader=BaseLoader)["mongodb_dev"],
		"prod" : yaml_load(open("./../resources/credentials.yaml"), Loader=BaseLoader)["mongodb_prod"],
		"dump" : yaml_load(open("./../resources/credentials.yaml"), Loader=BaseLoader)["mongodb_dump"]
	}

	conf_input = conf_dbs.get(db_input)
	conf_output = conf_dbs.get(db_output)

	client_input = connect_mongo_client(conf_input["url"], conf_input["db"], conf["user"], conf["pwd"])
	client_output = connect_mongo_client(conf_output["url"], conf_output["db"], conf["user"], conf["pwd"])

	reset_db(db=db_output)

	for db in dbs:
		print(db)
		res = list(client_input[db].find())
		if len(res):
			client_output[db].insert_many(list(res))


def reset_db(db=None):

	if not db:
		db = input("Quelle BDD supprimer (dev, prod, dump) ? ")

	dbs = ["articles", "hashtags", "themes", "tweets", "users"]

	conf = yaml_load(open("./../resources/credentials.yaml"), Loader=BaseLoader)["mongodb"]

	conf_dbs = {
		"dev" : yaml_load(open("./../resources/credentials.yaml"), Loader=BaseLoader)["mongodb_dev"],
		"prod" : yaml_load(open("./../resources/credentials.yaml"), Loader=BaseLoader)["mongodb_prod"],
		"dump" : yaml_load(open("./../resources/credentials.yaml"), Loader=BaseLoader)["mongodb_dump"]
	}

	conf_db = conf_dbs.get(db)
	mongo_client = connect_mongo_client(conf_db["url"], conf_db["db"], conf["user"], conf["pwd"])

	for db in dbs:
		mongo_client[db].drop()
		mongo_client.create_collection(db)

	mongo_client["articles"].create_index("url", unique=True)
	mongo_client["hashtags"].create_index("entry", unique=True)
	mongo_client["themes"].create_index("theme", unique=True)
	mongo_client["tweets"].create_index("id", unique=True)
	mongo_client["users"].create_index("username", unique=True)


def make_mongo_url(user, pwd, url, db):
	return "mongodb://" + user + ":" + pwd + "@" + url + "/" + db


def connect_mongo_client(url, db, user=None, pwd=None):
	if bool(user) != bool(pwd):
		raise Exception("erreur")
	elif not user:
		return MongoClient(url)[db]
	else:
		return MongoClient(make_mongo_url(user, pwd, url, db))[db]


def export_hashtags():

	hashtag_mongo = HashtagMongo()
	hashtags = hashtag_mongo.gets_all()
	hashtags = list(hashtags)

	with open('./../resources/hashtag_out.txt', 'a', encoding='UTF-8') as f:
		f.writelines("%s\n" % hashtag["entry"] for hashtag in hashtags)

	print("Hashtags exported in the file hashtag_out.txt")


def __init__():

	en_cours = True

	while en_cours:

		print("=== === === === === === === === === === === === === === === ==|\n"
			  "| Actions :                                                   |\n"
			  "|   1. reset DB                                               |\n"
			  "|   2. dump DB                                                |\n"
			  "|   3. import_indexed_hashtags (file indexed_hashtags.csv)    |\n"
			  "|   4. export_hashtags                                        |\n"
			  "|                                                             |\n"
			  "|   9. quitter programme                                      |\n"
			  "|== === === === === === === === === === === === === === === ===")
		choix = input()

		if choix is "1":
			reset_db()
		elif choix is "2":
			dump_db()
		elif choix is "3":
			import_indexed_hashtags()
		elif choix is "4":
			export_hashtags()
		elif choix is "9":
			en_cours = False


__init__()
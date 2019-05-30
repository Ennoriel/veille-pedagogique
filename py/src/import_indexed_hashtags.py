import requests
from yaml import load as yaml_load
from pymongo import MongoClient
from Tweet import Hashtag
from hashtag_mongo import HashtagMongo


def import_indexed_hashtags():
	headers = {'Authorization': yaml_load(open("credentials.yaml"))["jeton"]["super_user"]}

	with open('../resources/indexed_hashtags.csv', 'r') as f:
		hashtags = f.read()

	hashtags = hashtags.split("\n")

	hashtags = [h for h in hashtags if not h.endswith(";;;")]

	hashtag_mongo = HashtagMongo()
	hashtags = hashtags[1:-1]
	hashtag_mongo.saves_many([Hashtag(hashtag_entry.split(";")[0]).get() for hashtag_entry in hashtags])

	hashtag_url = "http://localhost:3001/api/hashtag"
	db_hashtags = requests.get(url=hashtag_url, headers=headers).json()

	for hashtag_entry in hashtags:

		parsed_hashtag = hashtag_entry.split(";")

		_id = next((db_h["_id"] for db_h in db_hashtags if db_h["entry"] == parsed_hashtag[0]), False)
		if _id:
			print(_id, parsed_hashtag[0], parsed_hashtag[2])
			o = {
				"entry": parsed_hashtag[0],
				"articleToBeDeleted": parsed_hashtag[3] is True,
				"themeToBeDeleted": parsed_hashtag[4] is True,
				"associatedThemes": parsed_hashtag[2].replace("|", ";")
			}
			# print(o)

			requests.put(hashtag_url + "/" + _id, json=o, headers=headers)


def dump_db():
	dbs = ["articles", "hashtags", "themes", "tweets", "users"]

	conf = yaml_load(open("credentials.yaml"))["mongodb"]
	conf_dev = yaml_load(open("credentials.yaml"))["mongodb_dev"]
	conf_prod = yaml_load(open("credentials.yaml"))["mongodb_prod"]
	conf_dump = yaml_load(open("credentials.yaml"))["mongodb_dump"]

	# conf_input = conf_prod
	# conf_output = conf_dump

	conf_input = conf_dump
	conf_output = conf_dev

	mongo_url_i = "mongodb://" + conf["user"] + ":" + conf["pwd"] + "@" + conf_input["url"] + "/" + conf_input["db"]
	client_input = MongoClient(mongo_url_i)[conf_input["db"]]

	mongo_url_o = "mongodb://" + conf["user"] + ":" + conf["pwd"] + "@" + conf_output["url"] + "/" + conf_output["db"]
	client_output = MongoClient(mongo_url_o)[conf_output["db"]]

	for db in dbs:
		print(db)
		res = list(client_input[db].find())
		client_output[db].delete_many({})
		if len(res):
			# TODO à décommenter uniquement si PROD => DUMP
			# if db == "articles":
			# 	for r in res:
			# 		r["notYetIndexedThemes"] = r["themes"]
			# 		r["themes"] = []
			client_output[db].insert_many(list(res))


dump_db()
import_indexed_hashtags()

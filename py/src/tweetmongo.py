from pymongo import MongoClient
from yaml import load as yaml_load


conf = yaml_load(open("credentials.yaml"))["mongodb"]
db = conf["db"]
mongo_url = "mongodb://" + conf["user"] + ":" + conf["pwd"] + "@" + conf["url"] + "/" + db


def gets(id):
	client = MongoClient(mongo_url)
	tweet = client[db]["tweets"].find({"id": id})
	return tweet


def exists(id):
	tweet = gets(id)
	return tweet.count() > 0


def saves_one(tweet):
	client = MongoClient(mongo_url)
	return client[db]["tweets"].insert_one(tweet)


def saves_many(tweets):
	client = MongoClient(mongo_url)
	return client[db]["tweets"].insert_many(tweets)

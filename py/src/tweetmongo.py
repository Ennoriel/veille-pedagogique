from pymongo import MongoClient
from yaml import load as yaml_load


class TweetMongo:

	def __init__(self):
		conf = yaml_load(open("credentials.yaml"))["mongodb"]
		self.db = conf["db"]
		mongo_url = "mongodb://" + conf["user"] + ":" + conf["pwd"] + "@" + conf["url"] + "/" + self.db

		self.client = MongoClient(mongo_url)

	def gets(self, id):
		return self.client[self.db]["tweets"].find({"id": id})

	def exists(self, id):
		return self.gets(id).count() > 0

	def saves_one(self, tweet):
		return self.client[self.db]["tweets"].insert_one(tweet)

	def saves_many(self, tweets):
		return self.client[self.db]["tweets"].insert_many(tweets)

	def delete_all(self):
		return self.client[self.db]["tweets"].delete_many({})

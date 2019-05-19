from pymongo import MongoClient
from yaml import load as yaml_load


class DictionnaryMongo:

	def __init__(self):
		"""
		Initializes mongo connexion
		"""
		conf = yaml_load(open("credentials.yaml"))["mongodb"]
		self.db = conf["db"]
		mongo_url = "mongodb://" + conf["user"] + ":" + conf["pwd"] + "@" + conf["url"] + "/" + self.db

		self.client = MongoClient(mongo_url)[self.db]["dictionnary"]

	def gets_all(self):
		"""
		Fetch all dictionnary from databases
		:return: all dictionnary
		"""
		return self.client.find({})

	def delete_all(self):
		""""
		Delete all words from database
		"""
		return self.client.delete_many({})

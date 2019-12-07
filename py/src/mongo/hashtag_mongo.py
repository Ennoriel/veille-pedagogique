from pymongo import MongoClient
from pymongo.errors import BulkWriteError
from yaml import load as yaml_load, BaseLoader
from typing import List


class HashtagMongo:

	def __init__(self, client=None):
		"""
		Initializes mongo connexion
		"""
		if client:
			self.client = client["hashtags"]
		else:
			conf = yaml_load(open("./../resources/credentials.yaml"), Loader=BaseLoader)["mongodb"]
			self.db = conf["db"]
			mongo_url = "mongodb://" + conf["user"] + ":" + conf["pwd"] + "@" + conf["url"] + "/" + self.db

			self.client = MongoClient(mongo_url, retryWrites=False)[self.db]["hashtags"]

	def gets(self, hashtags: List[str]):
		"""
		Fetch hashtags from databases
		:param hashtags: hashtags to search
		:return: hashtags
		"""
		return self.client.find(
			{
				"entry": {"$in": hashtags}
			}
		)

	def gets_all(self):
		"""
		Fetch al hashtags from databases
		:return: hashtags
		"""
		return self.client.find({})

	def updates_one(self, hashtag, upsert=True) -> None:
		"""
		Update a connexion by a weight
		:param hashtag: hashtag
		:param upsert: upsert document
		"""
		self.client.update_one(
			{
				"entry": hashtag.entry
			},
			{
				hashtag
			},
			upsert=upsert
		)

	def saves_many(self, hashtags):
		"""
		Saves hashtags
		:param hashtags: hashtags
		"""

		res = {}

		try:
			# try except with ordered false to save unique hashtags
			res = self.client.insert_many(hashtags, ordered=False)
		except BulkWriteError:
			pass

		return res

	def delete_all(self):
		""""
		Delete all themes from database
		"""
		return self.client.delete_many({})

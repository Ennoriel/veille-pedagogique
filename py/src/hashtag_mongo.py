from pymongo import MongoClient
from pymongo.errors import BulkWriteError
from yaml import load as yaml_load
from typing import List


class HashtagMongo:

	def __init__(self):
		"""
		Initializes mongo connexion
		"""
		conf = yaml_load(open("credentials.yaml"))["mongodb"]
		self.db = conf["db"]
		mongo_url = "mongodb://" + conf["user"] + ":" + conf["pwd"] + "@" + conf["url"] + "/" + self.db

		self.client = MongoClient(mongo_url)[self.db]["hashtags"]

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
		for hashtag in hashtags:
			print(str(hashtag))

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

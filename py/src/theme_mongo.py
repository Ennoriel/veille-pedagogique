from pymongo import MongoClient
from yaml import load as yaml_load

class ThemeMongo:

	def __init__(self):
		"""
		Initializes mongo connexion
		"""
		conf = yaml_load(open("./../resources/credentials.yaml"))["mongodb"]
		self.db = conf["db"]
		mongo_url = "mongodb://" + conf["user"] + ":" + conf["pwd"] + "@" + conf["url"] + "/" + self.db

		self.client = MongoClient(mongo_url)[self.db]["themes"]

	def update_weight(self, main_theme, second_theme, weight=1):
		"""
		update the weight of the connexion betweet two themes
		:param mainTheme: main theme
		:param secondTheme: second theme
		:param weight: weight og the connexion
		:return:
		"""
		return self.client.update_one(
			{
				"theme": main_theme,
				"neighboors.node": second_theme
			},
			{
				"$inc": {
					"neighboors.$.weight": weight
				}
			}
		)

	def delete_all(self):
		""""
		Delete all themes from database
		"""
		return self.client.delete_many({})

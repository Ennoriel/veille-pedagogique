from pymongo import MongoClient
from yaml import load as yaml_load


class ArticleMongo:

	def __init__(self):

		conf = yaml_load(open("credentials.yaml"))["mongodb"]
		self.db = conf["db"]
		mongo_url = "mongodb://" + conf["user"] + ":" + conf["pwd"] + "@" + conf["url"] + "/" + self.db

		self.client = MongoClient(mongo_url)

	def gets(self, url: str):
		"""
		Gets the articles with specific url. Maximum article associated should be 1
		:param url: url
		:return: article
		"""
		article = self.client[self.db]["articles"].find({"url": url})
		return article

	def gets_per_page(self, page):
		"""
		Gets articles per page
		:param page: page
		:return: list of articles
		"""
		per_page = 1
		page = max(0, page)

		return self.client[self.db]["articles"].find({}).limit(per_page).skip(page * per_page)

	def exists(self, url):
		"""
		Returns whether an article exists or not
		:param url: unique url
		:return: true, false
		"""
		article = self.gets(url)
		return article.count() > 0

	def saves_many(self, articles):
		"""
		Saves many articles at one
		:param articles: articles
		:return: result of inserting
		"""
		return self.client[self.db]["articles"].insert_many(articles)

	def update_tweet_ids(self, article):
		"""
		Adds tweet ids to an existing article
		:param article: article
		:return: rstult of updating
		TODO vérifier fonctionnement du "$set" => plutôt {"$push": { "tweetId": { "$each": article['tweetId']}}}
		"""
		return self.client[self.db]["articles"].update_one({"_id": article['_id']}, {'$set': {'tweetId' : article['tweetId']}})

	def delete_all(self):
		""""
		Delete all articles from database
		"""
		return self.client[self.db]["articles"].delete_many({})

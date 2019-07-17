from pymongo import MongoClient
from yaml import load as yaml_load


class ArticleMongo:

	def __init__(self):

		conf = yaml_load(open("./../resources/credentials.yaml"))["mongodb"]
		self.db = conf["db"]
		mongo_url = "mongodb://" + conf["user"] + ":" + conf["pwd"] + "@" + conf["url"] + "/" + self.db

		self.client = MongoClient(mongo_url)[self.db]["articles"]

	def gets(self, url: str):
		"""
		Gets the articles with specific url. Maximum article associated should be 1
		:param url: url
		:return: article
		"""
		article = self.client.find({"url": url})
		return article

	def gets_per_page(self, page):
		"""
		Gets articles per page
		:param page: page
		:return: list of articles
		"""
		per_page = 1
		page = max(0, page)

		return self.client.find({}).limit(per_page).skip(page * per_page)

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
		return self.client.insert_many(articles)

	def update_tweet_ids(self, url, tweet_id):
		"""
		Adds tweet ids to an existing article
		:param url: url de l'article
		:param tweet_id: identifiant du tweet
		:return: rstult of updating
		"""
		return self.client.update_one(
			{
				"url": url
			},
			{
				'$push': {'tweetId': tweet_id}
			})

	def delete_all(self):
		""""
		Delete all articles from database
		"""
		return self.client.delete_many({})

from pymongo import MongoClient
from yaml import load as yaml_load


class ArticleMongo:

	def __init__(self):

		conf = yaml_load(open("credentials.yaml"))["mongodb"]
		self.db = conf["db"]
		mongo_url = "mongodb://" + conf["user"] + ":" + conf["pwd"] + "@" + conf["url"] + "/" + self.db

		self.client = MongoClient(mongo_url)

	def gets(self, url):
		article = self.client[self.db]["articles"].find({"url": url})
		return article

	def get_per_page(self, page):
		per_page = 1
		page = max(0, page)

		articles = self.client[self.db]["articles"].find({}).limit(per_page).skip(page * per_page)
		return articles

	def exists(self, url):
		article = self.gets(url)
		return article.count() > 0

	def saves_many(self, articles):
		return self.client[self.db]["articles"].insert_many(articles)

	def update_tweet_ids(self, article):
		return self.client[self.db]["articles"].update_one({"_id": article['_id']}, {'$set': {'tweetId' : article['tweetId']}})

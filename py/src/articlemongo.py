from pymongo import MongoClient
from yaml import load as yaml_load


conf = yaml_load(open("credentials.yaml"))["mongodb"]
db = conf["db"]
mongo_url = "mongodb://" + conf["user"] + ":" + conf["pwd"] + "@" + conf["url"] + "/" + db


def gets(url):
	client = MongoClient(mongo_url)
	article = client[db]["articles"].find({"url": url})
	return article


def get_per_page(page):
	per_page = 1
	page = max(0, page)

	client = MongoClient(mongo_url)
	articles = client[db]["articles"].find({}).limit(per_page).skip(page * per_page)
	return articles


def exists(url):
	article = gets(url)
	return article.count() > 0


def saves_many(articles):
	client = MongoClient(mongo_url)
	return client[db]["articles"].insert_many(articles)


def update_tweet_ids(article):
	client = MongoClient(mongo_url)
	return client[db]["articles"].update_one({"_id": article['_id']}, {'$set': {'tweetId' : article['tweetId']}})

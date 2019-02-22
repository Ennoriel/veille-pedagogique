import pymongo


def gets(url):
	client = pymongo.MongoClient("mongodb://abcdef1:abcdef1@ds117158.mlab.com:17158/veille-pedago")
	article = client["veille-pedago"]["articles"].find({"url": url})
	return article


def exists(url):
	article = gets(url)
	return article.count() > 0


def saves(articles):
	client = pymongo.MongoClient("mongodb://abcdef1:abcdef1@ds117158.mlab.com:17158/veille-pedago")
	return client["veille-pedago"]["articles"].insert_many(articles)


def update_tweet_ids(article):
	client = pymongo.MongoClient("mongodb://abcdef1:abcdef1@ds117158.mlab.com:17158/veille-pedago")
	return client["veille-pedago"]["articles"].update_one({"_id": article['_id']}, {'$set': {'tweetId' : article['tweetId']}})

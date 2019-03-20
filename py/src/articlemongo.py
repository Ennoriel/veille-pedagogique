import pymongo


def gets(url):
	client = pymongo.MongoClient("mongodb://abcdef1:abcdef1@ds117158.mlab.com:17158/veille-pedago")
	article = client["veille-pedago"]["articles"].find({"url": url})
	return article


def get_per_page(page):
	per_page = 1
	page = max(0, page)

	client = pymongo.MongoClient("mongodb://abcdef1:abcdef1@ds117158.mlab.com:17158/veille-pedago")
	articles = client["veille-pedago"]["articles"].find({}).limit(per_page).skip(page * per_page)
	return articles


def exists(url):
	article = gets(url)
	return article.count() > 0


def saves_many(articles):
	client = pymongo.MongoClient("mongodb://abcdef1:abcdef1@ds117158.mlab.com:17158/veille-pedago")
	return client["veille-pedago"]["articles"].insert_many(articles)


def update_tweet_ids(article):
	client = pymongo.MongoClient("mongodb://abcdef1:abcdef1@ds117158.mlab.com:17158/veille-pedago")
	return client["veille-pedago"]["articles"].update_one({"_id": article['_id']}, {'$set': {'tweetId' : article['tweetId']}})

import pymongo


def gets(id):
	client = pymongo.MongoClient("mongodb://abcdef1:abcdef1@ds117158.mlab.com:17158/veille-pedago")
	tweet = client["veille-pedago"]["tweets"].find({"id": id})
	return tweet


def exists(id):
	tweet = gets(id)
	return tweet.count() > 0


def saves(tweet):
	client = pymongo.MongoClient("mongodb://abcdef1:abcdef1@ds117158.mlab.com:17158/veille-pedago")
	return client["veille-pedago"]["tweets"].insert_one(tweet)

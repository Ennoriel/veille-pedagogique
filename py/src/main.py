#!/usr/bin/python
# -*- coding: UTF-8 -*-

# List of installed dependencies:
#    sudo apt-get install python3-dev
#    sudo apt install python-pip
# 	 pip install tweepy
# 	 pip install pymongo
# 	 pip install twisted

from twisted.internet import task, reactor
from datetime import datetime
from Tweet import ApiCusto

from tweetmongo import TweetMongo
from articlemongo import ArticleMongo
from hashtag_mongo import HashtagMongo


api_custo = ApiCusto()

timeout = 40.0


def delete_all_in_db():
	text = input("suppression de tous les articles (y/n) ? ")

	if text == 'y':
		article_mongo = ArticleMongo()
		tweet_mongo = TweetMongo()
		hashtag_mongo = HashtagMongo()

		article_mongo.delete_all()
		tweet_mongo.delete_all()
		hashtag_mongo.delete_all()


def do_work():
	print("\n\n")
	print(datetime.now())
	api_custo.fetch_and_parse()
	print('- - - - - - - - -')


# delete_all_in_db()
# do_work()

loop = task.LoopingCall(do_work)
loop.start(timeout)

reactor.run()


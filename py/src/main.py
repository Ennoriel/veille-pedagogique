#!/usr/bin/python
# -*- coding: UTF-8 -*-

from threading import Thread

from datetime import datetime
from api_custo import ApiCusto
from time import sleep

from mongo.tweet_mongo import TweetMongo
from mongo.article_mongo import ArticleMongo
from mongo.hashtag_mongo import HashtagMongo


timeout = 1.0


def delete_all_in_db():
    text = input("suppression de tous les articles (y/n) ? ")

    if text == 'y':
        article_mongo = ArticleMongo()
        tweet_mongo = TweetMongo()
        hashtag_mongo = HashtagMongo()

        article_mongo.delete_all()
        tweet_mongo.delete_all()
        hashtag_mongo.delete_all()


class DoWork(Thread):

    def __init__(self):
        Thread.__init__(self)
        self.api_custo = ApiCusto()

    def run(self):
        print("\n\n")
        print(datetime.now())
        self.api_custo.fetch_and_parse(fetch_local=True)
        print('- - - - - - - - -')


def __main__():

    worker = DoWork()
    while(True):
        # time = datetime.now()
        if not worker.is_alive():
            worker = DoWork()
            worker.start()
        sleep(1)


delete_all_in_db()
__main__()

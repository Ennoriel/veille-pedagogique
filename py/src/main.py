# List of installed dependencies:
#	sudo apt-get install python3-dev
# 	pip install tweepy
# 	pip install pymongo
# 	pip install twisted

import tweepy
import tweetmongo
import articlemongo
import re
from twisted.internet import task, reactor
import datetime


consumer_key = "AXuCZQkAfoThsLg0Jp7I0UNJ5"
consumer_secret = "seFkcnlYUytqK9MkyrRxgt3BdTVBF1FhLnbC3nqrI53hGSnDZJ"
access_token = "2498179466-x2m98oTJm3u3bMO0pAVyotWMVxuCGSt1mLPwS3K"
access_token_secret = "L8p4dU8gjqlmQSejicfezr4JXRdAhkD5PGz2WidxpVHOD"

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

api = tweepy.API(auth)


def print_first_tweet(tweet):
	print(tweet.full_text)
	print(str(tweet))


def getModel(tweet):
	return {
		"id": tweet._json["id"],
		"text": tweet.full_text,
		"created_at": tweet._json["created_at"],
		"user": {
			"id": tweet.author._json["id"],
			"name": tweet.author._json["name"],
			"screen_name": tweet.author._json["screen_name"]
		},
		"url": "https://twitter.com/" + tweet.author._json["screen_name"] + "/status/" + tweet._json["id_str"],
		# TODO feature : lorsque les liens sont trop longs, ils apparaissent tronqué dans le texte, les remplacer par le vrai
		# TODO feature : lorsqu'il y a un media, il y a un lien dans le tweet, le supprimer
	}


def get_article_models(tweet):
	articles = []

	for url in tweet.entities["urls"]:

		if articlemongo.exists(url["expanded_url"]):
			# TODO feature : dans ce cas, il faut lier l'article existant au tweet
			continue

		if re.search("^https://twitter.com/\w+/status/\d+$", url["expanded_url"]):
			continue

		article = {
			"title": "",
			"url": url["expanded_url"],
			"language": tweet.lang,
			"medium": "",
			"createdAt": "",
			"description": "",
			"themes": [hashtag["text"] for hashtag in tweet.entities["hashtags"]],
			"siteInternet": re.findall("\w+\.[\w\.]+", url["expanded_url"])[0],
			"auteur": tweet.author._json["id"],
			"tweetId": tweet._json["id"]
		}

		articles.append(article)

	return articles


def main():
	pedagogy_tweets = api.search(q='#pedagogie', result_type='recent', tweet_mode='extended', lang='fr', count=5)

	nbTweetEnregistre = 0
	nbArticleEnregistre = 0

	for index, tweet in enumerate(pedagogy_tweets):
		# print_first_tweet(tweet)

		if not tweetmongo.exists(tweet._json["id"]):

			tweetModel = getModel(tweet)
			tweetmongo.saves(tweetModel)
			articleModels = get_article_models(tweet)

			if len(articleModels) > 0:
				articlemongo.saves(articleModels)

			nbTweetEnregistre = nbTweetEnregistre + 1
			nbArticleEnregistre = nbArticleEnregistre + len(articleModels)

	print(str(nbTweetEnregistre) + " tweets enregistrés.")
	print(str(nbArticleEnregistre) + " articles enregistrés.")






timeout = 300.0


def doWork():
	print("\n\n")
	print(datetime.datetime.now())
	main()


loop = task.LoopingCall(doWork)
loop.start(timeout)

reactor.run()

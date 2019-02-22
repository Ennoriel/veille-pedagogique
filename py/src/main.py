#!/usr/bin/python
# -*- coding: UTF-8 -*-

# List of installed dependencies:
#    sudo apt-get install python3-dev
# 	 pip install tweepy
# 	 pip install pymongo
# 	 pip install twisted

import tweepy
import tweetmongo
import articlemongo
import re
from twisted.internet import task, reactor
import datetime
import url_utils
import ast
import time

consumer_key = "AXuCZQkAfoThsLg0Jp7I0UNJ5"
consumer_secret = "seFkcnlYUytqK9MkyrRxgt3BdTVBF1FhLnbC3nqrI53hGSnDZJ"
access_token = "2498179466-x2m98oTJm3u3bMO0pAVyotWMVxuCGSt1mLPwS3K"
access_token_secret = "L8p4dU8gjqlmQSejicfezr4JXRdAhkD5PGz2WidxpVHOD"

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

api = tweepy.API(auth)


def bulk_replace(text, tab):
	if not tab:
		return text
	else:
		rep = dict((re.escape(k), v) for k, v in tab.items())
		pattern = re.compile("|".join(rep.keys()))
		return pattern.sub(lambda m: rep[re.escape(m.group(0))], text)


def get_tweet_model(tweet):
	return {
		"id": tweet._json["id"],
		"text": bulk_replace(tweet.full_text, {url["url"]: url["expanded_url"] for url in tweet.entities["urls"]}),
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


def update_article_if_exists(url: str, tweet_id: str) -> bool:
	"""
		If an article already exists, add the tweet id to it
		Returns whether an article has been found or not
	"""

	articles = articlemongo.gets(url)

	if articles.count() > 0:
		for article in articles:
			article['tweetId'].append(tweet_id)
			articlemongo.update_tweet_ids(article)

	return articles.count() > 0


def get_article_models(tweet):
	articles = []

	for url in tweet.entities["urls"]:

		unshorten_url = url_utils.unshorten(url["expanded_url"])

		if update_article_if_exists(unshorten_url, tweet._json["id"]):
			continue

		if re.search("^https://twitter.com/\\w+/status/\\d+$", url["expanded_url"]):
			continue

		# TODO feature : si l'url est un site, ne pas l'enregistrer en tant qu'article
		# la regex (?<!\/)\/(?!\/) permet de trouver le premier caractère après la fin de l'url du site

		article = {
			"title": "",
			"url": unshorten_url,
			"language": tweet.lang,
			"medium": "",
			"createdAt": None,
			"indexedAt": datetime.datetime.now(),
			"approvedAt": None,
			"description": "",
			"themes": [hashtag["text"] for hashtag in tweet.entities["hashtags"]],
			"siteInternet": re.findall("[\\w-]+\.[\\w\.-]+", unshorten_url)[0],
			"auteur": [],
			"tweetId": [tweet._json["id"]]
		}

		articles.append(article)

	return articles


def get_saved_tweet_id():
	with open('tweet_id.txt', 'r') as f:
		tweet_id = f.read()

	tweet_id = ast.literal_eval(tweet_id)

	interval = 30
	interval_max = min(interval, len(tweet_id))

	tweet_id_out = tweet_id[0:interval_max]

	if interval == interval_max:
		tweet_id_in = tweet_id[interval:len(tweet_id)]
	else:
		tweet_id_in = []

	with open('tweet_id.txt', 'w') as f:
		f.write(str(tweet_id_in))

	with open('tweet_id_out.txt', 'a') as f:
		f.writelines("%s\n" % tweet_id_o for tweet_id_o in tweet_id_out)

	return tweet_id_out


def main():
	# pedagogy_tweets = api.search(q='#pedagogie', result_type='recent', tweet_mode='extended', lang='fr', count=5)

	ts = time.time()

	tweet_id = get_saved_tweet_id()
	pedagogy_tweets = api.statuses_lookup(tweet_id, tweet_mode='extended')

	with open('test2.json', 'w') as f:
		f.write(str(pedagogy_tweets))

	nb_tweet_enregistre = 0
	nbarticle_enregistre = 0

	for index, tweet in enumerate(pedagogy_tweets):
		# print_first_tweet(tweet)
		print(str(index + 1) + " / " + str(len(pedagogy_tweets) + 1))

		if tweet.lang != 'fr':
			continue

		if not tweetmongo.exists(tweet._json["id"]):

			tweet_model = get_tweet_model(tweet)
			tweetmongo.saves(tweet_model)
			article_models = get_article_models(tweet)

			if len(article_models) > 0:
				articlemongo.saves(article_models)

			nb_tweet_enregistre = nb_tweet_enregistre + 1
			nbarticle_enregistre = nbarticle_enregistre + len(article_models)

	print("En " + str(time.time() - ts) + "s, le programme a :")
	print(str(nb_tweet_enregistre) + " / " + str(len(pedagogy_tweets)) + " tweets enregistrés.")
	print(str(nbarticle_enregistre) + " articles enregistrés.")


timeout = 60.0


def do_work():
	print("\n\n")
	print(datetime.datetime.now())
	main()


loop = task.LoopingCall(do_work)
loop.start(timeout)

reactor.run()

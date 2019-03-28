from tweepy.models import Status
from datetime import datetime
from ast import literal_eval
from tweepy import OAuthHandler, API
from tweetmongo import TweetMongo
from articlemongo import ArticleMongo
from re import compile, escape, findall, search
from url_utils import unshorten
from itertools import chain
from newspaper import Config as NPConfig, Article as NPArticle, ArticleException
from yaml import load as yaml_load
from logg import dir_log


class User:

	def __init__(self, status: Status):
		author = status.__getattribute__("author").__getattribute__("_json")

		self.id = author["id"]
		self.name = author["name"]
		self.screen_name = author["screen_name"]

	def get(self):
		return {
			"id": self.id,
			"name": self.name,
			"screenName": self.screen_name,
		}


class Tweet:

	def __init__(self, status: Status):
		_json = status.__getattribute__("_json")
		full_text = status.__getattribute__("full_text")
		entities = status.__getattribute__("entities")

		self.id = _json["id"]
		self.text = bulk_replace(full_text, {url["url"]: url["expanded_url"] for url in entities["urls"]})
		self.created_at = _json["created_at"]
		self.user = User(status)
		self.url = "https://twitter.com/" + self.user.screen_name + "/status/" + _json["id_str"]

	@staticmethod
	def get_saved_tweet_ids():

		with open('tweet_id.txt', 'r') as f:
			tweet_ids = f.read()

		tweet_ids = literal_eval(tweet_ids)

		interval_max = 50
		interval = min(interval_max, len(tweet_ids))

		tweet_ids_to_fetch = tweet_ids[0:interval]

		# saving remaining tweet ids
		with open('tweet_id.txt', 'w') as f:
			if interval == interval_max:
				f.write(str(tweet_ids[interval:len(tweet_ids)]))
			else:
				f.write('[]')

		# logging tweet ids to be searched
		with open('tweet_id_out.txt', 'a') as f:
			f.writelines("%s\n" % tweet_id_o for tweet_id_o in tweet_ids_to_fetch)

		return tweet_ids_to_fetch

	@staticmethod
	def get_page_content(url: str):
		config = NPConfig()
		config.MAX_TITLE = 500
		config.language = 'fr'
		config.request_timeout = 20
		config.memoize_articles = False

		return NPArticle(url=url, config=config)

	def get(self):
		return {
			"id": self.id,
			"text": self.text,
			"createdAt": self.created_at,
			"user": self.user.get(),
			"url": self.url
		}


class Article:

	def __init__(self, status: Status, article_content: NPArticle, url: str):
		self.title = article_content.title
		self.url = url
		self.language = status.__getattribute__("lang")
		self.medium = ""
		self.top_image = article_content.top_img
		self.created_at = article_content.publish_date
		self.indexed_at = datetime.now()
		self.approved_at = None
		self.description = article_content.text[:500] if len(article_content.text) > 500 else article_content.text
		self.full_text = article_content.text
		self.themes = [hashtag["text"] for hashtag in status.__getattribute__("entities")["hashtags"]].extend(article_content.keywords)
		self.site_internet = findall("[\\w-]+\.[\\w.-]+", url)[0]
		self.auteur = article_content.authors
		self.tweets = [Tweet(status)]

	def add_tweet(self, status):
		# TODO : lorsque l'on ajoute un tweet, ajouter les hashtags comme thèmes (potentiellement différents)
		self.tweets.append(Tweet(status))

	@staticmethod
	def update_article_if_exists(article_mongo: ArticleMongo, url: str, tweet_id: str) -> bool:
		"""
			If an article already exists, add the tweet id to it
			Returns whether an article has been found or not
		"""

		articles = article_mongo.gets(url)

		if articles.count() > 0:
			for article in articles:
				article['tweetId'].append(tweet_id)
				article_mongo.update_tweet_ids(article)

		return articles.count() > 0

	def get(self):
		return {
			"title": self.title,
			"url": self.url,
			"language": self.language,
			"medium": self.medium,
			"topImage": self.top_image,
			"createdAt": self.created_at,
			"indexedAt": self.indexed_at,
			"approvedAt": self.approved_at,
			"description": self.description,
			"fullText": self.full_text,
			"themes": self.themes,
			"siteInternet": self.site_internet,
			"auteur": self.auteur,
			"isVisible": self.title is not None and self.description is not None,
			"tweetId": [tweet.id for tweet in self.tweets]
		}


class ApiCusto:

	def __init__(self):

		conf = yaml_load(open("credentials.yaml"))["twitter_api"]

		consumer_key = conf["consumer_key"]
		consumer_secret = conf["consumer_secret"]
		access_token = conf["access_token"]
		access_token_secret = conf["access_token_secret"]

		auth = OAuthHandler(consumer_key, consumer_secret)
		auth.set_access_token(access_token, access_token_secret)

		self.api = API(auth)
		self.article_mongo = ArticleMongo()
		self.tweet_mongo = TweetMongo()

	def fetch(self):
		"""
		fetch remote or local if time is remote fetch limit is not reached
		:return: tweets
		"""
		return self.fetch_local()

	def fetch_remote(self):
		"""
		Fetch to Twitter API tweets by their hashtags
		:return:
		"""
		return self.api.search(q='#pedagogie', result_type='recent', tweet_mode='extended', lang='fr', count=5)

	def fetch_local(self):
		"""
		Fetch to Twitter API local saved tweet ids
		:return:
		"""
		tweet_ids_to_fetch = Tweet.get_saved_tweet_ids()
		if tweet_ids_to_fetch:
			return self.api.statuses_lookup(tweet_ids_to_fetch, tweet_mode='extended')
		else:
			return []

	def parse(self):

		statuses = self.fetch()

		articles = []

		for index_status, status in enumerate(statuses):

			dir_log(0, index_status + 1, len(statuses))

			# Suppression des tweets non francophones
			if status.__getattribute__("lang") != 'fr':
				continue

			# Suppression des tweets déjà enregistrés
			if self.tweet_mongo.exists(status.__getattribute__("_json")["id"]):
				continue

			article_courants = []
			_json = status.__getattribute__("_json")

			urls = status.entities["urls"]

			for index_article, url in enumerate(urls):

				dir_log(1, index_article + 1, len(urls))

				unshorten_url = unshorten(url["expanded_url"])

				# Suppression des url en double dans un tweet
				if unshorten_url in [a.url for a in article_courants]:
					continue

				# Suppression des url qui sont des liens vers d'autres status Twitter
				if search("^https://twitter.com/\\w+/status/\\d+$", url["expanded_url"]):
					continue

				# Si l'url pointe vers un article déjà référencé, on le mets à jour et on passe à l'url suivante
				if Article.update_article_if_exists(self.article_mongo, unshorten_url, _json["id"]):
					continue

				# TODO feature : si l'url est un site, ne pas l'enregistrer en tant qu'article
				# la regex (?<!\/)\/(?!\/) permet de trouver le premier caractère après la fin de l'url du site

				# Si article déjà référencé, on le met à jour localement
				if unshorten_url in [article.url for article in articles]:
					for article in articles:
						if article.url == unshorten_url:
							article.add_tweet(status)
							break
					continue

				article_content = Tweet.get_page_content(unshorten_url)

				try:
					article_content.build()
				except ArticleException:
					# Lien ne renvoyant pas à une URL disponible, on ne l'enregistre pas
					# TODO : enregistrer les articles nont joignabes avec gestion de tentatives de retry
					continue

				article_courants.append(Article(status, article_content, unshorten_url))

			articles.extend(article_courants)

		return articles

	def fetch_and_parse(self):
		articles = self.parse()

		if articles:
			self.article_mongo.saves_many([article.get() for article in articles])

			tweets = list(chain.from_iterable([article.tweets for article in articles]))
			self.tweet_mongo.saves_many([tweet.get() for tweet in tweets])


def bulk_replace(text, tab):
	if not tab:
		return text
	else:
		rep = dict((escape(k), v) for k, v in tab.items())
		pattern = compile("|".join(rep.keys()))
		return pattern.sub(lambda m: rep[escape(m.group(0))], text)

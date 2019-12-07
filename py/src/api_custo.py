from itertools import chain, combinations
from re import search
from urllib.parse import urlparse

from pymongo.errors import BulkWriteError
from tweepy import OAuthHandler, API
from yaml import load as yaml_load, BaseLoader

from objects.article import Article
from objects.hashtag import Hashtag
from objects.tweet import Tweet
from mongo.article_mongo import ArticleMongo
from mongo.hashtag_mongo import HashtagMongo
from mongo.theme_mongo import ThemeMongo
from mongo.tweet_mongo import TweetMongo
from utils.log_utils import dir_log
from utils.url_utils import unshorten


class ApiCusto:

	def __init__(self):

		conf = yaml_load(open("./../resources/credentials.yaml"), Loader=BaseLoader)["twitter_api"]

		consumer_key = conf["consumer_key"]
		consumer_secret = conf["consumer_secret"]
		access_token = conf["access_token"]
		access_token_secret = conf["access_token_secret"]

		auth = OAuthHandler(consumer_key, consumer_secret)
		auth.set_access_token(access_token, access_token_secret)

		self.api = API(auth)
		self.article_mongo = ArticleMongo()
		self.tweet_mongo = TweetMongo()
		self.hashtag_mongo = HashtagMongo()
		self.theme_mongo = ThemeMongo()

		self.articles = []

	def fetch(self, fetch_local=True):
		"""
		fetch remote or local if time is remote fetch limit is not reached
		:param fetch_local: if true, retrieve tweets id from a file, otherwise from a hashtag on twitter
		:return: tweets
		"""
		return self.fetch_local() if fetch_local else self.fetch_remote()

	def fetch_remote(self):
		"""
		Fetch to Twitter API tweets by their hashtags
		:return:
		"""
		return self.api.search(q='#pedagogie', result_type='recent', tweet_mode='extended', lang='fr', count=20)

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

	def parse(self, fetch_local):
		"""
		Gets statuses from Twitter, make an article out of links and dowload article content
		:param fetch_local: if true, retrieve tweets id from a file, otherwise from a hashtag on twitter
		"""

		statuses = self.fetch(fetch_local)

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

			# variable counting url already indexed as an article, in order to save the tweet eventhoug all its urls
			# are already referenced. If the tweet as at least one url not indexed as an article, it will be saved later
			# TODO vérifier l'utilité de ce truc car comme le tweet est ajouté à un article, il devrait être enregistré
			count_url_already_indexed = 0

			for index_article, url in enumerate(urls):

				dir_log(1, index_article + 1, len(urls))
				print('              ' + str(_json["id"]))

				unshorten_url = unshorten(url["expanded_url"])

				# Suppression des url en double dans un tweet
				if unshorten_url in [a.url for a in article_courants]:
					continue

				# Suppression des url qui sont des liens vers d'autres status Twitter
				if search("^https://twitter.com/\\w+/status/\\d{19}", unshorten_url):
					continue

				# Suppression des url qui sont des urls de sites et non d'articles
				url_path = urlparse(unshorten_url).path
				if url_path == '' or url_path == '/':
					continue

				# Si l'url pointe vers un article déjà référencé, on le mets à jour et on passe à l'url suivante
				if Article.update_article_if_exists(self.article_mongo, unshorten_url, _json["id"]):
					count_url_already_indexed += 1
					continue

				# Si article déjà référencé, on le met à jour localement
				if unshorten_url in [article.url for article in self.articles]:
					for article in self.articles:
						if article.url == unshorten_url:
							article.add_tweet(status)
							break
					continue

				article_courant = Article.get_article_content(unshorten_url, status)

				if not article_courant:
					continue

				article_courants.append(article_courant)

			if count_url_already_indexed == len(urls):
				self.tweet_mongo.saves_one(Tweet(status).get())

			self.articles.extend(article_courants)

	def save(self):
		"""
		Save articles, tweets, hashtags and updates themes
		"""
		if self.articles:
			for article in self.articles:
				print(str(article.get()))

			# save articles
			try:
				self.article_mongo.saves_many([article.get() for article in self.articles])
			except BulkWriteError as e:
				print(e.details)
				raise

			# save tweets
			tweets = list(chain.from_iterable([article.tweets for article in self.articles]))
			self.tweet_mongo.saves_many([tweet.get() for tweet in tweets])

			# save hashtags
			hashtags = []
			for article in self.articles:
				hashtags.extend([theme for theme in article.not_indexed_theme_entries])

			# clean duplicates
			hashtags = list(dict.fromkeys(hashtags))
			hashtags = [Hashtag(hashtag).get() for hashtag in hashtags]

			if len(hashtags):
				self.hashtag_mongo.saves_many(hashtags)

			# update themes
			for article in self.articles:
				for [themeA, themeB] in combinations(article.indexed_theme_entries, 2):
					self.theme_mongo.update_weight(themeA, themeB)
					self.theme_mongo.update_weight(themeB, themeA)

	def fetch_and_parse(self, fetch_local):
		"""
		fetch statuses, parse them to articles and saves articles
		:param fetch_local: if true, retrieve tweets id from a file, otherwise from a hashtag on twitter
		"""
		self.parse(fetch_local)
		self.save()
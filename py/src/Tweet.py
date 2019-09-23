from pymongo.errors import BulkWriteError
from tweepy.models import Status
from datetime import datetime, date
from ast import literal_eval
from tweepy import OAuthHandler, API

from tweet_mongo import TweetMongo
from article_mongo import ArticleMongo
from hashtag_mongo import HashtagMongo
from theme_mongo import ThemeMongo
from re import compile, escape, findall, search
from url_utils import unshorten
from itertools import chain, combinations
from newspaper import Config as NPConfig, Article as NPArticle, ArticleException
from yaml import load as yaml_load, BaseLoader
from logg import dir_log
from typing import List
from urllib.parse import urlparse
from re import sub as re_sub


class Hashtag:

	def __init__(self, entry):
		self.entry = entry
		self.articleToBeDeleted = False
		self.themeToBeDeleted = False
		self.associatedThemes = []

	def get(self):
		"""
		get the hashtag as a database object
		"""
		return {
			"entry": self.entry,
			"articleToBeDeleted": self.articleToBeDeleted,
			"themeToBeDeleted": self.themeToBeDeleted,
			"associatedThemes": self.associatedThemes,
		}


class User:

	def __init__(self, status: Status):
		author = status.__getattribute__("author").__getattribute__("_json")

		self.id: str = author["id"]
		self.name: str = author["name"]
		self.screen_name: str = author["screen_name"]

	def get(self):
		"""
		get the user as a database object
		"""
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
	def get_saved_tweet_ids(interval_max=25) -> List[int]:
		"""
		get tweet ids from a file (./../resources/tweet_id.txt) where tweet ids are stored as a list.
		removes the tweet_ids of the file and log them in antoher file (./../resources/tweet_id_out.txt) as one id by line

		:param interval_max: number of tweet ids to fetch each time
		:return: list of tweet ids
		"""
		with open('./../resources/tweet_id.txt', 'r') as f:
			tweet_ids = f.read()

		tweet_ids = literal_eval(tweet_ids)

		interval = min(interval_max, len(tweet_ids))

		tweet_ids_to_fetch = tweet_ids[0:interval]

		# saving remaining tweet ids
		with open('./../resources/tweet_id.txt', 'w') as f:
			if interval == interval_max:
				f.write(str(tweet_ids[interval:len(tweet_ids)]))
			else:
				f.write('[]')

		# logging tweet ids to be searched
		with open('./../resources/tweet_id_out.txt', 'a') as f:
			f.writelines("%s\n" % tweet_id_o for tweet_id_o in tweet_ids_to_fetch)

		return tweet_ids_to_fetch

	@staticmethod
	def get_page_content(url: str):
		"""
		get the page content with newspaper library
		"""
		config = NPConfig()
		config.MAX_TITLE = 500
		config.language = 'fr'
		config.request_timeout = 20
		config.memoize_articles = False

		return NPArticle(url=url, config=config)

	def get(self):
		"""
		get the tweet as a database object
		"""
		return {
			"id": self.id,
			"text": self.text,
			"createdAt": self.created_at,
			"user": self.user.get(),
			"url": self.url
		}


class Article:

	def __init__(self, status: Status, article_content: NPArticle, url: str):

		self.indexed_theme_entries = []
		self.not_indexed_theme_entries = []

		# initialize indexed_theme_entries and not_indexed_theme_entries
		self.isVisible = self.parse_themes(status)

		self.title = article_content.title
		self.url = url
		self.language = status.__getattribute__("lang")
		self.medium = ""
		self.top_image = article_content.top_img
		self.created_at = article_content.publish_date
		self.indexed_at = datetime.now()
		self.approved_at = None
		self.full_text = re_sub(' +', ' ', article_content.text)

		self.description = self.full_text[:500] + "... [continuer sur le site de l'auteur]" if len(self.full_text[:500]) > 500 else self.full_text

		self.site_internet = findall("[\\w-]+\.[\\w.-]+", url)[0]
		self.auteur = article_content.authors
		self.tweets = [Tweet(status)]

	def parse_themes(self, status):
		"""
		Parse themes of one status
		:param status: tweet status
		:return: True or False whether there is a theme 'deletes' an article or not'
		"""
		hashtag_mongo = HashtagMongo()

		article_hashtags = [hashtag["text"] for hashtag in status.__getattribute__("entities")["hashtags"]]
		print(str(article_hashtags))

		# clean duplicates
		article_hashtags = list(dict.fromkeys(article_hashtags))

		db_hashtags = list(hashtag_mongo.gets(article_hashtags))

		is_article_to_keep = True

		for theme in article_hashtags:
			entry = next((db_hashtag for db_hashtag in db_hashtags if db_hashtag["entry"] == theme), False)
			if entry:
				if entry["themeToBeDeleted"]:
					# theme to delete because the theme seems irrelevent
					continue
				elif entry["articleToBeDeleted"] and entry["associatedThemes"]:
					# articles to delete because the theme seems out of scope
					is_article_to_keep = False
					self.indexed_theme_entries.extend(entry["associatedThemes"])
				elif entry["associatedThemes"]:
					# theme to add as associated theme
					self.indexed_theme_entries.extend(entry["associatedThemes"])
			else:
				# new theme to add as not yet indexed theme
				self.not_indexed_theme_entries.append(theme)

		return is_article_to_keep

	def add_tweet(self, status):
		self.tweets.append(Tweet(status))

	@staticmethod
	def update_article_if_exists(article_mongo: ArticleMongo, url: str, tweet_id: str) -> bool:
		"""
			If an article already exists, add the tweet id to it
			Returns whether an article has been found or not
		"""
		res = article_mongo.update_tweet_ids(url, tweet_id)
		return res.modified_count > 0

	def get(self):
		"""
		get the article as a database object
		"""
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
			"themes": self.indexed_theme_entries,
			"notYetIndexedThemes": self.not_indexed_theme_entries,
			"siteInternet": self.site_internet,
			"auteur": self.auteur,
			"isVisible": self.title is not None and self.description is not None,
			"tweetId": [tweet.id for tweet in self.tweets]
		}

	@staticmethod
	def get_article_content(url, status, fake=False):
		"""
		Search for page content with Newspaper3k and initialize a new article. Return False if treatment went wrong.
		:param url: url of the webpage
		:param status: status
		:param fake: is True, use a fake article content to make the treatment faster
		:return: a new article or False
		"""

		if fake:
			class FakeArticleContent:
				def __init__(self):
					self.title = "title"
					self.top_img = "top_img"
					self.publish_date = date(year=2018, month=1, day=1)
					self.text = "text"
					self.authors = [
						"tom",
						"tom"
					]

			article_content = FakeArticleContent()

		else:

			article_content = Tweet.get_page_content(url)

			try:
				article_content.build()
			except ArticleException:
				# Lien ne renvoyant pas à une URL disponible, on ne l'enregistre pas
				# TODO : enregistrer les articles non joignabes avec gestion de tentatives de retry
				return False

		return Article(status, article_content, url)


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
				if search("^https://twitter.com/\\w+/status/\\d+$", unshorten_url):
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


def bulk_replace(text, replacement):
	"""
	replace all occurence of the keys of the object replacement by its values in the text
	:param text: text to modify
	:param replacement: replacement object as {old_text: new_text}
	:return: text modified
	"""
	if not replacement:
		return text
	else:
		rep = dict((escape(k), v) for k, v in replacement.items())
		pattern = compile("|".join(rep.keys()))
		return pattern.sub(lambda m: rep[escape(m.group(0))], text)

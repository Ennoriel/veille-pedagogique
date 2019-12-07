from datetime import datetime, date
from re import sub as re_sub, findall

from tweepy import Status
from newspaper import Article as NPArticle, ArticleException

from objects.tweet import Tweet
from mongo.article_mongo import ArticleMongo
from mongo.hashtag_mongo import HashtagMongo


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

		if article_content.source_url == 'https://www.youtube.com':
			self.full_text = article_content.meta_data['description']
		else:
			self.full_text = re_sub(' +', ' ', article_content.text)

		self.description = self.full_text[:500] + "... [continuer sur le site de l'auteur]" if len(self.full_text) > 500 else self.full_text

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
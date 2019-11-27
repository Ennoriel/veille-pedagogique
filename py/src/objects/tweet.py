from tweepy.models import Status
from ast import literal_eval

from objects.user import User
from newspaper import Config as NPConfig, Article as NPArticle
from typing import List

from utils.string_utils import bulk_replace


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

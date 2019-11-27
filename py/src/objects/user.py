from tweepy import Status


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
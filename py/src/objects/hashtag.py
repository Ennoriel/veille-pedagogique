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
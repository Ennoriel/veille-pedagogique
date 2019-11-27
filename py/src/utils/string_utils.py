from locale import setlocale, LC_ALL, strcoll
from functools import cmp_to_key
from re import escape, compile


class StringUtil:

	def __init__(self):
		setlocale(LC_ALL, 'en_US.UTF-8')

	@staticmethod
	def sorts(unsorted_list):
		"""
		Sorts an array
		:param unsorted_list: unsorted array
		:return: sorted array
		"""
		return sorted(unsorted_list, key=cmp_to_key(strcoll))


def bulk_replace(text, replacement):
	"""
	replace all occurence of the keys of the replacement map by its values in the text
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
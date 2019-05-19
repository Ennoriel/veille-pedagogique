from locale import setlocale, LC_ALL, strcoll
from functools import cmp_to_key


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

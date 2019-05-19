def dir_log(level: int, index: int, total: int) -> None:
	"""
	Prints one level of a tree like object
	:param level: level of the element in the object
	:param index: index of element in the array
	:param total: length of the array
	"""
	if index == total:
		print(' ' * (2 + 4 * level) + '└── ' + str(index) + ' / ' + str(total))
	else:
		print(' ' * (2 + 4 * level) + '├── ' + str(index) + ' / ' + str(total))
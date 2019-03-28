def dir_log(level, index, total):
	if index == total:
		print(' ' * (2 + 4 * level) + '└── ' + str(index) + ' / ' + str(total))
	else:
		print(' ' * (2 + 4 * level) + '├── ' + str(index) + ' / ' + str(total))
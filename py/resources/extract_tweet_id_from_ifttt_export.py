import re

file_names = [
    'pedagogie.html.txt',
    'pedagogie.html (1).txt',
    'pedagogie.html (2).txt',
    'pedagogie.html (3).txt',
    'pedagogie.html (4).txt',
    'pedagogie.html (5).txt',
    'pedagogie.html (6).txt',
    'pedagogie.html (7).txt',
    'pedagogie.html (8).txt',
    'pedagogie.html (9).txt',
    'pedagogie.html (10).txt',
    'pedagogie.html (11).txt',
    'pedagogie.html (12).txt',
    'pedagogie.html (13).txt',
    'pedagogie.html (14).txt',
    'pedagogie.html (15).txt',
    'pedagogie.html (16).txt',
    'pedagogie.html (17).txt',
    'pedagogie.html (18).txt',
    'pedagogie.html (19).txt',
    'pedagogie.html (20).txt',
    'pedagogie.html (21).txt',
    'pedagogie.html (22).txt',
    'pedagogie.html (23).txt',
    'pedagogie.html (24).txt',
    'pedagogie.html (26).txt',
]

tweet_ids = []

for file_name in file_names:
	with open(file_name, 'r', encoding='UTF-8') as content_file:
		content = content_file.read()
		tweet_ids.extend(re.findall("(?<=status\\/)\\d{19}", str(content)))

tweet_ids = list(set(tweet_ids))
tweet_ids.sort()
print(len(tweet_ids))

with open('tweet_id.txt',
    'w', encoding='UTF-8') as file:
	file.write(str(tweet_ids))


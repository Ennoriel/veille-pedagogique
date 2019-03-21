#!/usr/bin/python
# -*- coding: UTF-8 -*-

# List of installed dependencies:
#    sudo apt-get install python3-dev
#    sudo apt install python-pip
# 	 pip install tweepy
# 	 pip install pymongo
# 	 pip install twisted

from twisted.internet import task, reactor
from datetime import datetime
from Tweet import ApiCusto


api_custo = ApiCusto()

timeout = 30.0


def do_work():
	print("\n\n")
	print(datetime.now())
	api_custo.fetch_and_parse()


loop = task.LoopingCall(do_work)
loop.start(timeout)

reactor.run()

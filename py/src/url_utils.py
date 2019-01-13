import requests


def unshorten(url):
    return requests.head(url, allow_redirects=True).url

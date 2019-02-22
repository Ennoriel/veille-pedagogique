import requests


def unshorten(url):
    try:
        return requests.head(url, allow_redirects=True).url
    except:
        print("Erreur redirection avec l'url : " + url)
        return url;


from gatherer import Fetch, Cache

c = Cache("cache")
fetcher = Fetch(headers={"User-Agent": "Gatherer Agent"}, cache=c)


def get_dom(url):
    return fetcher.get(url)

from gatherer import Fetch, Cache

fs_cache = Cache("cache")
fetcher = Fetch(headers={"User-Agent": "Saturday Night Live Data"}, cache=fs_cache)

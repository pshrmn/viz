#Saturday Night Life

Data on various Saturday Night Live cast members and their careers

Sourced from rotten tomatoes and wikipedia.

###Scripts

These are liable to break if the markup of any of the respective web pages changes.

####All Cast Data

Get a list of main cast and other cast members (eg featured players) for every season of Saturday Night Live (currently 1-41).

```
python -m scripts.wiki_all_casts
```

####Season Cast Data

Get a list of main cast and other cast members (eg featured players) for a given season of Saturday Night Live (currently 1-41).

```
python -m scripts.wiki_season_cast --season <season number>
```

####Actor Data

Get basic profile information about an actor from Rotten Tomatoes

```
python -m scripts.rt_actor_data --name <actor's name> --url <rotten tomatoes profile url>
```
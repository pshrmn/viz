#Saturday Night Life

Data on various Saturday Night Live cast members and their careers

Sourced from imdb and wikipedia.

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

Get information on an actor from their IMDB profile.

```
python -m scripts.imdb_actor_data --name <actor's name> --url <imdb profile url>
```

####Episode Data

Get information on the cast of each episode for a season of Saturday Night Live (currently 1-41).

```
python -m scripts.imdb_episodes_data --season <season number>
```

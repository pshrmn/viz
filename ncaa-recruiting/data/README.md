Gather data on where US college football recruits come from.

###team.py

```python
python -m recruiting.team -name <team name> -city <city of school> -state <state of school> -colors <school colors>
```

`<team name>` is the name that is used to refer to the university's athletic teams by ESPN. For example, the University of Wisconsin - Madison is referred to as Wisconsin and Brigham Young University if referred to as BYU.

###averages.py

For some cities, the longitude and latitude are not listed on their respective Wikipedia page. In those cases, it is easiest to manually lookup and enter the coordinates (eg search for the city on Google Maps, right click on the city in the map, select the `What's here?` option, and the coordinates will be listed in the box that shows up). Once the longitude and latitude have been set, you can use `averages.py` to update the file with mean and median distances of players' hometowns to the school.

```python
python -m recruiting.averages -filename <team data file>.json
```

###conference.py

```python
python -m recruiting.conference -name <conference name> -teams <team name> [, <team names>, ...]
```

Group the files for the teams provided in the `teams` arg together in one big file that is saved under the name of the conference. Eg. `-name SEC` will save the teams to `SEC.json`.

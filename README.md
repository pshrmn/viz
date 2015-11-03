Gather data on where US college football recruits come from.

###team.py

```python
python -m recruiting.team -name <team name> -city <city of school> -state <state of school> -colors <school colors>
```

`<team name>` is the name that is used to refer to the university's athletic teams by ESPN. For example, the University of Wisconsin - Madison is referred to as Wisconsin and Brigham Young University if referred to as BYU.

###conference.py

```python
python -m recruiting.conference -name <conference name> -teams <team name> [, <team names>, ...]
```

Group the files for the teams provided in the `teams` arg together in one big file that is saved under the name of the conference. Eg. `-name SEC` will save the teams to `SEC.json`.
#Saturday Night Life

Data on various Saturday Night Live cast members and their careers

Sourced from rotten tomatoes, wikipedia, and imdb.

###Scripts

1. Get the data

```
python -m scripts.full_data
```

2. Fill in data for incomplete cast members (in `data/full/cast_members.csv`) and save as `data/full/full_cast_members.csv`

3. Import the data into a database

```
python -m scripts.db_import
```

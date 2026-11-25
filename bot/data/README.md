# Dictionary data

`qawHaq.db` is a generated SQLite database for the beq lookup function. It is
created from the [boQwI' data repository](https://github.com/De7vID/klingon-assistant-data)
by the manual GitHub Actions workflow `Update Klingon dictionary`.

The workflow runs on Linux because the upstream YAML tree contains filenames
that differ only by letter case and therefore cannot be checked out reliably on
the default Windows filesystem. `SOURCE.txt` records the upstream commit and
database version for every generated update.

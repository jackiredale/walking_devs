# Horror Movie Database

This project collects information for 40 chosen horror films from TMDB.

The five subgenres are:

- Slasher
- Supernatural
- Psychological
- Zombie
- Sci-Fi Horror

Every movie receives exactly two categories: `Horror` and one subgenre.

## What the finished movies.json contains

Each movie has:

- id
- tmdbId
- title
- description
- categories
- director
- runtime
- releaseYear
- posterUrl

## Setup on your Mac

1. Open this folder in VS Code.
2. Open Terminal in VS Code.
3. Install the one required package:

```bash
npm install
```

4. Duplicate `.env.example` and rename the copy to `.env`.
5. Paste your TMDB **API Read Access Token** into `.env`:

```env
TMDB_TOKEN=your_real_token_here
```

6. Run:

```bash
npm start
```

The program creates `movies.json`.

## Important

Do not upload `.env` to GitHub. It is already included in `.gitignore`.

The script searches using both title and release year, then requests the movie
details and credits so it can obtain the runtime and director.

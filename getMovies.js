require("dotenv").config();
const fs = require("fs");
const path = require("path");
const selectedFilms = require("./selectedFilms.json");

const token = process.env.TMDB_TOKEN;

if (!token) {
  console.error("Missing TMDB_TOKEN. Add it to your .env file.");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${token}`,
  accept: "application/json"
};

async function tmdbGet(url) {
  const response = await fetch(url, { headers });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`TMDB error ${response.status}: ${message}`);
  }

  return response.json();
}

async function searchMovie(title, year) {
  const params = new URLSearchParams({
    query: title,
    primary_release_year: String(year),
    include_adult: "false",
    language: "en-GB"
  });

  const data = await tmdbGet(
    `https://api.themoviedb.org/3/search/movie?${params}`
  );

  const exactMatch = data.results.find((movie) => {
    const releaseYear = movie.release_date?.slice(0, 4);
    const titleMatches =
      movie.title.toLowerCase() === title.toLowerCase() ||
      movie.original_title.toLowerCase() === title.toLowerCase();

    return titleMatches && releaseYear === String(year);
  });

  return exactMatch || data.results[0] || null;
}

async function getMovieDetails(tmdbId) {
  const params = new URLSearchParams({
    language: "en-GB",
    append_to_response: "credits"
  });

  return tmdbGet(
    `https://api.themoviedb.org/3/movie/${tmdbId}?${params}`
  );
}

function getDirector(credits) {
  const director = credits?.crew?.find(
    (person) => person.job === "Director"
  );

  return director?.name || "Unknown";
}

async function collectMovies() {
  const movies = [];
  const notFound = [];

  for (let index = 0; index < selectedFilms.length; index += 1) {
    const chosenFilm = selectedFilms[index];

    try {
      console.log(
        `[${index + 1}/40] Finding ${chosenFilm.title} (${chosenFilm.year})`
      );

      const searchResult = await searchMovie(
        chosenFilm.title,
        chosenFilm.year
      );

      if (!searchResult) {
        notFound.push(chosenFilm);
        console.warn(`Not found: ${chosenFilm.title}`);
        continue;
      }

      const details = await getMovieDetails(searchResult.id);

      movies.push({
        id: movies.length + 1,
        tmdbId: details.id,
        title: details.title,
        description: details.overview || "No description available.",
        categories: ["Horror", chosenFilm.subgenre],
        director: getDirector(details.credits),
        runtime: details.runtime,
        releaseYear: Number(details.release_date?.slice(0, 4)) || chosenFilm.year,
        posterUrl: details.poster_path
          ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
          : null
      });
    } catch (error) {
      notFound.push(chosenFilm);
      console.error(
        `Could not collect ${chosenFilm.title}: ${error.message}`
      );
    }
  }

  fs.writeFileSync(
    path.join(__dirname, "movies.json"),
    JSON.stringify(movies, null, 2)
  );

  if (notFound.length > 0) {
    fs.writeFileSync(
      path.join(__dirname, "notFound.json"),
      JSON.stringify(notFound, null, 2)
    );
  }

  console.log(`\nFinished. Saved ${movies.length} films to movies.json.`);

  if (notFound.length > 0) {
    console.log(
      `${notFound.length} film(s) were not found. Check notFound.json.`
    );
  }
}

collectMovies();

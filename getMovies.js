require("dotenv").config();

const fs = require("fs");
const path = require("path");
const selectedFilms = require("./selectedFilms.json");

const token = process.env.TMDB_TOKEN;

if (!token) {
  console.error("TMDB_TOKEN is missing from your .env file.");
  process.exit(1);
}

const headers = {
  accept: "application/json",
  Authorization: `Bearer ${token}`,
};

async function fetchFromTMDB(url) {
  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `TMDB request failed: ${response.status} ${response.statusText}\n${errorText}`
    );
  }

  return response.json();
}

async function findMovie(chosenFilm) {
  const encodedTitle = encodeURIComponent(chosenFilm.title);

  const searchUrl =
    `https://api.themoviedb.org/3/search/movie` +
    `?query=${encodedTitle}` +
    `&primary_release_year=${chosenFilm.year}` +
    `&language=en-GB`;

  const searchResults = await fetchFromTMDB(searchUrl);

  if (!searchResults.results || searchResults.results.length === 0) {
    throw new Error(
      `Could not find ${chosenFilm.title} (${chosenFilm.year})`
    );
  }

  const exactMatch =
    searchResults.results.find((movie) => {
      const releaseYear = movie.release_date
        ? Number(movie.release_date.slice(0, 4))
        : null;

      return (
        movie.title.toLowerCase() === chosenFilm.title.toLowerCase() &&
        releaseYear === chosenFilm.year
      );
    }) || searchResults.results[0];

  return exactMatch;
}

async function getMovieDetails(tmdbId) {
  const detailsUrl =
    `https://api.themoviedb.org/3/movie/${tmdbId}` +
    `?language=en-GB&append_to_response=credits`;

  return fetchFromTMDB(detailsUrl);
}

function getDirector(credits) {
  if (!credits || !Array.isArray(credits.crew)) {
    return "Unknown";
  }

  const director = credits.crew.find(
    (crewMember) => crewMember.job === "Director"
  );

  return director ? director.name : "Unknown";
}

async function createMovieDatabase() {
  const movies = [];

  for (let index = 0; index < selectedFilms.length; index += 1) {
    const chosenFilm = selectedFilms[index];

    console.log(
      `[${index + 1}/${selectedFilms.length}] Finding ` +
        `${chosenFilm.title} (${chosenFilm.year})`
    );

    try {
      const searchMatch = await findMovie(chosenFilm);
      const details = await getMovieDetails(searchMatch.id);

      const releaseYear = details.release_date
        ? Number(details.release_date.slice(0, 4))
        : chosenFilm.year;

      movies.push({
        id: movies.length + 1,
        tmdbId: details.id,
        title: details.title,
        description:
          details.overview || "No description is currently available.",
        categories: ["Horror", chosenFilm.subgenre],
        director: getDirector(details.credits),
        runtime: details.runtime || null,
        releaseYear,
        averageRating:
          typeof details.vote_average === "number"
            ? Number(details.vote_average.toFixed(1))
            : null,
        posterUrl: details.poster_path
          ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
          : null,
      });
    } catch (error) {
      console.error(
        `Could not add ${chosenFilm.title}: ${error.message}`
      );
    }
  }

  const outputPath = path.join(__dirname, "movies.json");

  fs.writeFileSync(
    outputPath,
    JSON.stringify(movies, null, 2),
    "utf8"
  );

  console.log(`\nFinished. Added ${movies.length} movies.`);
  console.log(`Created: ${outputPath}`);
}

createMovieDatabase().catch((error) => {
  console.error("The program stopped:", error.message);
  process.exit(1);
});
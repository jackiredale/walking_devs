// Shared by GenreContext and SubcategoryContext — both pick from this same
// list of horror subcategories, but keep their own independent selection/results state.

export const HORROR_GENRE_ID = 27; // TMDB's genre id for "Horror"

export const HORROR_SUBCATEGORIES = [
  "Slasher",
  "Supernatural",
  "Occult",
  "Zombie",
  "Psychological",
  "Body Horror",
  "Folk Horror",
];

// TMDB doesn't have these as genres, only as keywords, so a subcategory label
// has to be resolved to a keyword id first, then used to discover movies.
export function discoverByHorrorSubcategory(label, { apiUrl, apiKey, rating, decade, sortBy }) {
  const term = encodeURIComponent(label.toLowerCase());

  return fetch(`${apiUrl}/search/keyword?query=${term}&api_key=${apiKey}`)
    .then((response) => response.json())
    .then((keywordData) => {
      
      const keywordId = keywordData.results?.[0]?.id;
      // console.log(label, "→ matched keyword:", keywordData.results?.[0]);

      if (!keywordId) {
        return { results: [] }; // no matching TMDB keyword for this label
      }

      const params = new URLSearchParams({
        api_key: apiKey,
        with_genres: HORROR_GENRE_ID,
        with_keywords: keywordId,
        sort_by: sortBy || "popularity.desc",
      });
      if (rating) {
        params.set("vote_average.gte", rating);
      }
      if (decade) {
        params.set("primary_release_date.gte", `${decade}-01-01`);
        params.set("primary_release_date.lte", `${Number(decade) + 9}-12-31`);
      }

      return fetch(`${apiUrl}/discover/movie?${params}`).then((response) => response.json());
    });
}

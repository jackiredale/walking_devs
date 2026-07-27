# Horror Movie Database

A React application for discovering and exploring horror films. Users will be
able to browse a collection of movies, search for specific titles, and view
detailed information about each film.

## User Story

_As a horror film fan, I want to search and browse a movie database so that I
can discover films and learn more about them._

## Features

- Browse a collection of horror films
- Search for movies by title
- Filter films by genre, release year, or rating
- View movie details, including the synopsis, poster, release date, and rating
- Save favourite films for easy access
- Responsive design for desktop, tablet, and mobile devices

## Technologies Used

- React
- React Router
- JavaScript
- HTML
- CSS
- A third-party movie API

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd <your-project-folder>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and add the API key required by your
chosen movie service:

```env
VITE_MOVIE_API_KEY=your_api_key
```

### 4. Run the app locally

```bash
npm run dev
```

Visit the local URL shown in the terminal, usually
**http://localhost:5173**.

## Planned Folder Structure

```text
src/
  components/    reusable interface components
  pages/         application pages
  services/      movie API requests
  context/       shared application state
  assets/        images and other static files
  App.jsx        routes and main application layout
  main.jsx       application entry point
```

## Links

- **GitHub repository:** _Add repository URL_
- **Deployed application:** _Add live URL_

## Future Improvements

- Add user accounts
- Allow users to rate and review films
- Create personalised watchlists
- Recommend films based on saved favourites

## Author

Tamara Everett

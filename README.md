# Horror Movie Database

A React application for discovering and exploring horror films. Users will be
able to browse a collection of movies, search for specific titles, and view
detailed information about each film.

## User Story

As horror film fans, we want to search and browse a movie database so that we
can discover films and learn more about them.

## Features

- Browse a collection of horror films
- Save favourite films for easy access
- Responsive design

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

Movie Portal – React Project

A simple movie browsing application built with React, React Router, and The Movie Database (TMDB) API.

Users can browse top‑rated movies, search for movies, filter by genre, navigate through pages, and view detailed information including cast.

Features

Home Page
- Displays a list of Top Rated Movies from TMDB.
- Search bar to find movies by title.
- Genre filter dropdown to filter movies by category.
- Pagination with Next and Previous buttons.
- Each movie is displayed using a reusable MovieCard component.

Details Page
- Shows detailed information about a selected movie:
- Title
- Release year
- Rating
- Overview
- Cast list (first 10 actors)
- Includes a Back button to return to the previous page.
- Uses a dedicated MovieDetails component for clean structure.

API Integration
- Uses TMDB API to fetch:
- Top‑rated movies
- Search results
- Genres
- Movie details
- Cast information

Component-Based Architecture
- MovieCard for movie previews
- MovieDetails for detailed view
- Home and Details pages
- Tmdb.js API helper for all API calls

Styling
- Fully styled using CSS Modules:
- Home.module.css
- MovieCard.module.css
- MovieDetails.module.css

Project Structure
src/
  Api/
    Tmdb.js
  Components/
    MovieCard/
      MovieCard.jsx
      MovieCard.module.css
    MovieDetails/
      MovieDetails.jsx
      MovieDetails.module.css
  Pages/
    Home/
      Home.jsx
      Home.module.css
    Details/
      Details.jsx
  App.jsx
  main.jsx
  index.css



How to Run the Project

1. Install dependencies
npm install

2. Start the development server
npm run dev

3. Open in browser
Visit:
http://localhost:5173


Technologies Used
- React
- React Router
- Vite
- CSS Modules
- TMDB API

TMDB API Key
This project uses a TMDB API key stored directly in Tmdb.js for simplicity.

What This Project Demonstrates
- React component structure
- Routing and navigation
- API integration and async data fetching
- State management with hooks
- Filtering, searching, and pagination
- Clean UI with CSS Modules

import { useEffect, useState } from 'react';
import './movie.css';
import { AiOutlineSearch } from "react-icons/ai";
import axios from 'axios';

function Movie() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [expandedMovieId, setExpandedMovieId] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
        params: {
          api_key: '16bee316f6c8125c2b6c830a4a0d471a',
        },
      });
      setGenres(response.data.genres);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
        params: {
          api_key: '16bee316f6c8125c2b6c830a4a0d471a',
          sort_by: sortBy,
          page:1,
          query: searchQuery,
          with_genres: selectedGenre,
        },
      });
      setMovies(response.data.results);
    };
    fetchMovies();
  }, [searchQuery, sortBy, selectedGenre]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = async () => {
    const response = await axios.get("https://api.themoviedb.org/3/search/movie",
    {
      params: {
        api_key: '16bee316f6c8125c2b6c830a4a0d471a',
        query: searchQuery,
      },
    }
  );
    setMovies(response.data.results);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const toggleDescription = (movieId) => {
    setExpandedMovieId(expandedMovieId === movieId ? null : movieId);
  };

  return (
    <div>
      <h1>MOVIE HUNTER</h1>
      <div className="search-bar">
        <input type="text" placeholder="Search movie.." value={searchQuery} onChange={handleSearchChange} className="search-input" />

        <button onClick={handleSearchSubmit} className="search-button">
          <AiOutlineSearch />
        </button>
      </div>
      <div className="filter">
        <label htmlFor="sort-by">Sort By:</label>
        <select id="sort-by" value={sortBy} onChange={handleSortChange} >
          <option value="popularity.desc">Popularity Descending</option>
          <option value="popularity.asc">Popularity Ascending</option>
          <option value="vote_average.desc">Rating Descending</option>
          <option value="vote_average.asc">Rating Ascending</option>
          <option value="release_date.desc">Release Date Descending</option>
          <option value="release_date.asc">Release Date Ascending</option>
        </select>
        <label htmlFor="genre">Genre:</label>
        <select id="genre" value={selectedGenre} onChange={handleGenreChange} >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>


      <div className="movie-wrapper">
        {movies.map((movie) => (
          <div key={movie.id} className="movie">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <h2>{movie.title}</h2>
            <p className="rating">Rating: {movie.vote_average}</p>
            {expandedMovieId === movie.id ? (
              <p>{movie.overview}</p>
            ) : (
              <p>{movie.overview.substring(0, 150)}...</p>
            )}
            <button
              onClick={() => toggleDescription(movie.id)}
              className="read-more" >
              {expandedMovieId === movie.id ? 'Show Less' : 'Read More'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Movie;
 










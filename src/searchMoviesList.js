export function MovieList({ movies, onSelectMovie, selectedId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          onSelectMovie={onSelectMovie}
          selectedId={selectedId}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie, selectedId }) {
  return (
    <li
      className={selectedId === movie.imdbID ? "active" : ""}
      onClick={() => onSelectMovie(movie.imdbID)}
    >
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

import { useState, useRef, useEffect } from "react";
import { useKey } from "./useKey.js";

import { Loader, ErrorMessage } from "./loaderAndError.js";
import StarRating from "./StarRating.js";

const KEY = "366c9440";
export function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatchedMovie,
  watched,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState({});
  const [userRating, setUserRating] = useState("");

  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) countRef.current++;
    },
    [userRating]
  );

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  function handleAdd() {
    const watchedMovie = {
      imdbID: selectedId,
      poster,
      title,
      imdbRating: +imdbRating,
      runtime: +runtime.split(" ").at(0),
      userRating,
      countRatingDecision: countRef,
    };

    onAddWatchedMovie(watchedMovie);
    onCloseMovie();
  }

  const {
    Actors: actors,
    Title: title,
    Genre: genre,
    Runtime: runtime,
    Released: released,
    imdbRating,
    Plot: plot,
    Poster: poster,
    Director: director,
  } = movies;

  useEffect(
    function () {
      async function getMovieDetails() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
          );
          if (!res.ok)
            throw new Error("Something went wrong with fetching the movies");
          const data = await res.json();

          if (data.Response === "False") throw new Error(data.Error);

          setMovies(data);
        } catch (err) {
          console.error(err.message);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie |${title} `;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  //custom useState
  useKey("Escape", onCloseMovie);

  return (
    <div className="details">
      {isLoading && <Loader />}
      {!isLoading && !error && (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} - {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={20}
                    onSetRating={setUserRating}
                  />
                  {userRating && (
                    <button className="btn-add" onClick={handleAdd}>
                      Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You have already rated this movie with ⭐ {watchedUserRating}
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>{actors}</p>
            <p>{director}</p>
          </section>
        </>
      )}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}

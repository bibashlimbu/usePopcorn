import { useState } from "react";

import { useMovies } from "./useMovie.js";
import { useLoaclStorage } from "./useLocalStroageState.js";

import NabBar from "./navBar.js";
import { Search, Results } from "./navBar.js";
import { Loader, ErrorMessage } from "./loaderAndError.js";
import { Main, Box } from "./main.js";
import { MovieList } from "./searchMoviesList.js";
import { MovieDetails } from "./moviesDetails.js";
import { WatchedSummery } from "./watchedSummery.js";
import { WatchedMoviesList } from "./watchedMoviesList.js";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);

  const [watched, setWatched] = useLoaclStorage([], "watched");

  // const query = "avengers";

  function handleSelectedMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function deleteWatchedMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NabBar>
        {" "}
        <Search query={query} setQuery={setQuery} />
        <Results movies={movies} />
      </NabBar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              onSelectMovie={handleSelectedMovie}
              selectedId={selectedId}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatchedMovie={handleAddWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummery watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatchedMovie={deleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

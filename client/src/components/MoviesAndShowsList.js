import React, { useState } from 'react';
import { useQuery, gql, useLazyQuery } from '@apollo/client';
import { DataGrid } from '@mui/x-data-grid';
import {Box, Typography } from '@mui/material';

const GET_ALL_MOVIES_AND_SHOWS = gql`
  query GetAllMoviesAndShows {
    allMoviesAndShows {
      moviesAndShowsDBID
      title
      director
      monthReleased
      yearReleased
      contentType {
        content
      }
      genres {
        genre
      }
    }
  }
`;

export const GET_MOVIES_BY_GENRE = gql`
  query GetContentByGenre($genreID: Int!) {
    contentByGenre(genreID: $genreID) {
      moviesAndShowsDBID
      title
      director
      monthReleased
      yearReleased
      contentType {
        content
      }
      genres {
        genre
      }
    }
  }
`;

export const GET_GENRES_BY_MOVIE = gql`
  query GetGenresByMovie($moviesAndShowsID: Int!) {
    genresByContent(moviesAndShowsID: $moviesAndShowsID) {
      genreID
      genre
    }
  }
`;

export const GET_ALL_GENRES = gql`
  query GetAllGenres {
    allGenres {
      genreDBID
      genre
    }
  }
`;


const MoviesAndShowsList = () => {
  const [selectedMovieID, setSelectedMovieID] = useState(null);
  const { loading, error, data } = useQuery(GET_ALL_MOVIES_AND_SHOWS);
  const [getGenresByMovie, { data: movieGenresData}] = useLazyQuery(GET_GENRES_BY_MOVIE);


  const handleMovieClick = (movieID) => {
    setSelectedMovieID(movieID);
    getGenresByMovie({ variables: { moviesAndShowsID: movieID } });
  };

  if (loading ) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error?.message}</Typography>;

  const columns = [
    { field: 'moviesAndShowsDBID', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Title', width: 150 },
    { field: 'director', headerName: 'Director', width: 150 },
    { field: 'monthReleased', headerName: 'Month Released', width: 150 },
    { field: 'yearReleased', headerName: 'Year Released', width: 150 },
    { field: 'contentType', headerName: 'Content Type', width: 150, valueGetter: (params) => params.content },
    { field: 'genres', headerName: 'Genres', width: 150, valueGetter: (params) => params.map(genre => genre.genre).join(', ') }
  ];

  const rows = (data.allMoviesAndShows).map(movie => ({
    id: movie.moviesAndShowsDBID,
    ...movie
  }));

  return (
    <Box sx={{ height: 400, width: '100%', marginBottom: 4 }}>
      <Typography variant="h6" gutterBottom>
        Movies and Shows
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        onRowClick={(params) => handleMovieClick(params.id)}
      />
      {selectedMovieID && movieGenresData && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6" gutterBottom>
            Genres for Movie ID: {selectedMovieID}
          </Typography>
          {movieGenresData.genresByMovie.map((genre) => (
            <Typography key={genre.genreID}>{genre.genre}</Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default MoviesAndShowsList;
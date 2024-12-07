import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Box, Typography } from '@mui/material';

import AddRatingForm from './AddRatingForm';

const GET_ALL_MOVIES_AND_SHOWS = gql`
  query GetAllRatings {
    allMoviesAndShows {
      moviesAndShowsDBID
      title
      director
      monthReleased
      yearReleased
      contentType {
        content
      }
    }
  }
`;

export const GET_RATINGS_BY_MOVIE = gql`
  query GetRatingsByMovie($moviesAndShowsID: Int!) {
    ratingsByMovies(moviesAndShowsID: $moviesAndShowsID) {
      userID
      rating
      movieAndShow {
        title
      }
    }
  }
`;

export const GET_RATINGS_BY_USER = gql`
  query GetRatingsByUser($userID: Int!) {
    ratingsByUsers(userID: $userID) {
      moviesAndShowsID
      rating
      movieAndShow {
        title
      }
    }
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    allUsers {
      userID
      firstName
      lastName
    }
  }
`;



const MoviesAndShowsList = () => {
  const { loading, error, data } = useQuery(GET_ALL_MOVIES_AND_SHOWS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const columns = [
    { field: 'moviesAndShowsDBID', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Title', width: 150 },
    { field: 'director', headerName: 'Director', width: 150 },
    { field: 'monthReleased', headerName: 'Month Released', width: 150 },
    { field: 'yearReleased', headerName: 'Year Released', width: 150 },
    //{ field: 'contentType', headerName: 'Content Type', width: 150, valueGetter: (params) => params.row.contentType.content }
  ];

  const rows = data.allMoviesAndShows.map(movie => ({
    id: movie.moviesAndShowsDBID,
    ...movie
  }));

  return (
    <div style={{ height: 400, width: '100%' }}>
      <h2>Movies and Shows</h2>
      <DataGrid rows={rows} columns={columns} pageSize={5} />
    </div>
  );
};

const RatingList = () => {
  const [selectedMovieID, setSelectedMovieID] = useState(null);
  const [selectedUserID, setSelectedUserID] = useState(null);

  const { loading: loadingByMovie, error: errorByMovie, data: dataByMovie, refetch: refetchByMovie } = useQuery(GET_RATINGS_BY_MOVIE, {
    variables: { moviesAndShowsID: selectedMovieID },
    skip: !selectedMovieID,
  });

  const { loading: loadingByUser, error: errorByUser, data: dataByUser, refetch: refetchByUser } = useQuery(GET_RATINGS_BY_USER, {
    variables: { userID: selectedUserID },
    skip: !selectedUserID,
  });

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Title', width: 150 },
    { field: 'rating', headerName: 'Rating', width: 150 },
    { field: 'userID', headerName: 'User ID', width: 150 },
  ];

  const rowsByMovie = dataByMovie?.ratingsByMovies.map((rating, index) => ({
    id: index + 1,
    title: rating.movieAndShow.title,
    rating: rating.rating,
    userID: rating.userID,
  })) || [];

  const rowsByUser = dataByUser?.ratingsByUsers.map((rating, index) => ({
    id: index + 1,
    title: rating.movieAndShow.title,
    rating: rating.rating,
    moviesAndShowsID: rating.moviesAndShowsID,
    userID: selectedUserID,
  })) || [];

  const handleRatingAdded = () => {
    if (selectedMovieID) {
      refetchByMovie();
    }
    if (selectedUserID) {
      refetchByUser();
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Ratings
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        <TextField
          label="Select Movie ID"
          type="number"
          value={selectedMovieID || ''}
          onChange={(e) => setSelectedMovieID(parseInt(e.target.value) || null)}
          fullWidth
        />
        <TextField
          label="Select User ID"
          type="number"
          value={selectedUserID || ''}
          onChange={(e) => setSelectedUserID(parseInt(e.target.value) || null)}
          fullWidth
        />
      </Box>
      {selectedUserID && (
        <AddRatingForm userID={selectedUserID} onRatingAdded={handleRatingAdded} />
      )}
      {selectedMovieID && (
        <Box sx={{ height: 400, width: '100%', marginTop: 2 }}>
          <Typography variant="h6" gutterBottom>
            Ratings for Movie ID: {selectedMovieID}
          </Typography>
          {loadingByMovie && <Typography>Loading...</Typography>}
          {errorByMovie && <Typography color="error">Error: {errorByMovie.message}</Typography>}
          <DataGrid rows={rowsByMovie} columns={columns} pageSize={5} />
        </Box>
      )}
      {selectedUserID && (
        <Box sx={{ height: 400, width: '100%', marginTop: 2 }}>
          <Typography variant="h6" gutterBottom>
            Ratings for User ID: {selectedUserID}
          </Typography>
          {loadingByUser && <Typography>Loading...</Typography>}
          {errorByUser && <Typography color="error">Error: {errorByUser.message}</Typography>}
          <DataGrid rows={rowsByUser} columns={columns} pageSize={5} />
        </Box>
      )}
    </Box>
  );
};

export default RatingList;
export { MoviesAndShowsList };
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { TextField, Button, Box, Typography } from '@mui/material';

export const ADD_RATING = gql`
  mutation AddRating($userID: Int!, $moviesAndShowsID: Int!, $rating: Int!) {
    addRating(userID: $userID, moviesAndShowsID: $moviesAndShowsID, rating: $rating) {
      userID
      moviesAndShowsID
      rating
    }
  }
`;

const AddRatingForm = ({ userID, onRatingAdded }) => {
  const [moviesAndShowsID, setMoviesAndShowsID] = useState('');
  const [rating, setRating] = useState('');
  const [addRating, { loading, error }] = useMutation(ADD_RATING);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addRating({
      variables: {
        userID: parseInt(userID),
        moviesAndShowsID: parseInt(moviesAndShowsID),
        rating: parseInt(rating)
      }
    });
    onRatingAdded();
    setMoviesAndShowsID('');
    setRating('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, margin: 'auto' }}>
      <Typography variant="h6">Add Rating</Typography>
      <TextField
        label="Movie ID"
        type="number"
        value={moviesAndShowsID}
        onChange={(e) => setMoviesAndShowsID(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Rating"
        type="number"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        required
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        Add Rating
      </Button>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">Error: {error.message}</Typography>}
    </Box>
  );
};

export default AddRatingForm;
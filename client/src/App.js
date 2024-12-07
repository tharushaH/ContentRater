import React from 'react';
import MoviesAndShowsList from './components/MoviesAndShowsList';
import UsersList from './components/UserList';
import RatingList from './components/RatingList';
import { Box, Typography } from '@mui/material';

const App = () => {
  return (
    <Box sx={{ padding: 10 }}>
      <Typography variant="h3" gutterBottom>
        Content Rater
      </Typography>
      <Box sx={{ marginTop: 5 }}>
        <MoviesAndShowsList />
      </Box>
      <Box sx={{ marginTop: 20 }}>
        <UsersList />
      </Box>
      <Box sx={{ marginTop: 10 }}>
        <RatingList />
      </Box>
    </Box>
  );
};

export default App;
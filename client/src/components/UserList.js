import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

const GET_ALL_USERS = gql`
  query GetAllUsers {
    allUsers {
      userID
      firstName
      lastName
      username
    }
  }
`;

const UsersList = () => {
  const { loading, error, data } = useQuery(GET_ALL_USERS);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  const columns = [
    { field: 'userID', headerName: 'ID', width: 90 },
    { field: 'firstName', headerName: 'First Name', width: 150 },
    { field: 'lastName', headerName: 'Last Name', width: 150 },
    { field: 'username', headerName: 'Username', width: 150 }
  ];

  const rows = data.allUsers.map(user => ({
    id: user.userID,
    ...user
  }));

  return (
    <Box sx={{ height: 400, width: '100%', marginBottom: 4 }}>
      <Typography variant="h6" gutterBottom>
        Users
      </Typography>
      <DataGrid rows={rows} columns={columns} pageSize={5} />
    </Box>
  );
};

export default UsersList;
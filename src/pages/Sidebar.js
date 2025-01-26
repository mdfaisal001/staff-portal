import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();

  return (
    <Drawer variant="permanent" anchor="left">
      <Box sx={{ width: 250 }}>
        <List>
          <ListItem button onClick={() => navigate('/students')}>
            <ListItemText primary="Students Page" />
          </ListItem>
          <ListItem button onClick={onLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}


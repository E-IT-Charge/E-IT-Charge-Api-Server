import React from 'react';
import { Typography, Button, Container, Divider, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../../components/Layout/NavBar'; // Navbar 컴포넌트를 import
import ChargingServiceInfo from '../../components/ChargingServiceInfo';
import StatisticsInfo from '../../components/StatisticsInfo';
import EVSystem from '../../components/EVSystem';
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const Home = () => {
  const classes = useStyles();
  return (
    <>
    <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <StatisticsInfo />
          </Grid>
          <Grid item xs={12} md={4}>
            <EVSystem />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Home;

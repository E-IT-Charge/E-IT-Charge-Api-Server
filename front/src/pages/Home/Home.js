import React from 'react';
import { Typography, Button, Container, Grid, Paper } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Navbar from '../../components/Layout/NavBar'; // Navbar 컴포넌트 import
import ChargingServiceInfo from '../../components/ChargingServiceInfo';
import StatisticsInfo from '../../components/StatisticsInfo';
import EVSystem from '../../components/EVSystem';

import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import Divider from '@mui/material/Divider';
import { useNavigate } from "react-router-dom";



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
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
const images = [
  {
    label: 'San Francisco ? Oakland Bay Bridge, United States',
    imgPath: require('../../assets/image/banner1.png'),
  },
  {
    label: 'Bird',
    imgPath: require('../../assets/image/banner2.png'),
  },
  {
    label: 'Bali, Indonesia',
    imgPath: require('../../assets/image/banner3.png'),
  },
  {
    label: 'Go?, Serbia',
    imgPath: require('../../assets/image/banner4.png'),
  },
];

const Home = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleFirst = () => {
    setActiveStep((prevActiveStep) => 0);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleLast = () => {
    setActiveStep((prevActiveStep) => maxSteps - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  const navigate = useNavigate();

  const handleMapClick = () => {
    navigate("/map");
  };
  const handleSearchClick = () => {
    navigate("/search");
  };
  const handleReportClick = () => {
    navigate("/report/list");
  };
  const handleInquiryClick = () => {
    navigate("/inquiry");
  };



  const classes = useStyles();
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', borderRadius: '50px', marginTop: '50px' }}>

        <Box sx={{ maxWidth: '1200px ', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <AutoPlaySwipeableViews
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'background.default',
            }}
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={activeStep}
            onChangeIndex={handleStepChange}
            enableMouseEvents
          >
            {images.map((step, index) => (
              <div key={step.label} style={{borderRadius: '50px'}}>
                {Math.abs(activeStep - index) <= 2 ? (
                  <Box
                    component="img"
                    sx={{
                      display: 'block',
                      overflow: 'hidden',
                      width: '100%',
                      height: '35vh',
                      borderRadius: '50px'
                    }}
                    src={step.imgPath}
                    alt={step.label}
                  />
                ) : null}
              </div>
            ))}
          </AutoPlaySwipeableViews>
          <MobileStepper
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button
                size="small"
                onClick={activeStep === maxSteps - 1 ? handleFirst : handleNext}
              >
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button size="small"
                onClick={activeStep === 0 ? handleLast : handleBack}>
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}

              </Button>
            }
          />
        </Box>
      </div>
      <div style={{ height: '5vh' }}>

      </div>
      <div style={{ display: 'flex', flexDirection: window.innerWidth < 960 ? 'column' : 'row', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'row', margin: '20px', justifyContent: 'center' }}>
          <Card sx={{ width: '220px', minWidth: '130px', height: '180px', minHeight: '130px', margin: '20px', border: '2px solid #BFC7F8' }}>
            <CardActionArea sx={{ height: '100%' }} onClick={handleMapClick}>
              <CardMedia
                component="img"
                image={require('../../assets/image/map.png')}
                alt="green iguana"
                style={{ width: '80px', height: '75px', margin: '0 auto', marginTop: '20px' }}
              />
              <CardContent >
                <Typography gutterBottom variant="h5" component="div" style={{ fontWeight: 'bold', textAlign: 'center', margin: '5px', color: '#3F51B5' }}>
                  주변검색
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card sx={{ width: '220px', minWidth: '130px', height: '180px', minHeight: '130px', margin: '20px', border: '2px solid #BFC7F8' }} onClick={handleSearchClick}>
            <CardActionArea sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                image={require('../../assets/image/mapSearch.png')}
                alt="green iguana"
                style={{ width: '80px', height: '75px', margin: '0 auto', marginTop: '20px' }}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" style={{ fontWeight: 'bold', textAlign: 'center', margin: '5px', color: '#3F51B5' }}>
                  필터검색
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

        </div>
        <div style={{ display: 'flex', flexDirection: 'row', margin: '20px', justifyContent: 'center' }}>
          <Card sx={{ width: '220px', minWidth: '130px', height: '180px', minHeight: '130px', margin: '20px', border: '2px solid #BFC7F8' }} onClick={handleReportClick}>
            <CardActionArea sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                image={require('../../assets/image/check.png')}
                alt="green iguana"
                style={{ width: '80px', height: '75px', margin: '0 auto', marginTop: '20px' }}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" style={{ fontWeight: 'bold', textAlign: 'center', margin: '5px', color: '#3F51B5' }}>
                  신고하기
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card sx={{ width: '220px', minWidth: '130px', height: '180px', minHeight: '130px', margin: '20px', border: '2px solid #BFC7F8' }} onClick={handleInquiryClick}>
            <CardActionArea sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                image={require('../../assets/image/counter.png')}
                alt="green iguana"
                style={{ width: '80px', height: '75px', margin: '0 auto', marginTop: '20px' }}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" style={{ fontWeight: 'bold', textAlign: 'center', margin: '5px', color: '#3F51B5' }}>
                  문의하기
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Home;

import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Link,
  Box,
  Divider,
  TextField,
  MenuItem,
} from "@mui/material";
import styled from "@emotion/styled";
import LoginForm from "../../components/LoginForm";

import Logo from "../../components/Logo";
import { motion } from "framer-motion";

import Bg from "../../components/bg";
import Grid from "@mui/material/Grid";



const RootStyle = styled("div")({
  background: "rgb(249, 250, 251)",
  height: "100vh",
  display: "grid",
  placeItems: "center",
});
const Wrapper = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gridGap: 8,
  marginTop: 16,
});
const HeadingStyle = styled(Box)({
  textAlign: "center",
});

const ContentStyle = styled("div")({
  maxWidth: 480,
  padding: 25,
  margin: "auto",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  background: "#fff",
});

let easing = [0.6, -0.05, 0.01, 0.99];
const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0,
    transition: { duration: 0.6, ease: easing },
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easing,
    },
  },
};

const Login = (props) => {
  const { setAuth, setPeople } = props;
  const handleSetPeople = (data) => {
    setPeople(data);
  };
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [entityRID, setEntityRID] = useState("");



  useEffect(() => {
    fetch('http://10.197.8.17:2023/hmis/api/v1/hospital', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(errorData => {
            const errorMessage = `Network response was not ok. Status: ${response.status}, Message: ${errorData.message}`;
            throw new Error(errorMessage);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log('Hospitals fetched successfully:', data);
        setHospitals(data);
      })
      .catch((error) => {
        console.error('Error fetching hospitals:', error);
      });
  }, []);

  const handleHospitalChange = (event) => {
    setSelectedHospital(event.target.value);
    setEntityRID(hospitals.filter(hospital => hospital.hospitalSortName === event.target.value)[0].hospitalID);
  }
  return (
    <RootStyle>
      <Container>
        <Grid xs={12} container>
          <Grid xs={8} item>
            <Bg />
          </Grid>
          <Grid xs={4} item>
            <ContentStyle>
              <HeadingStyle component={motion.div} {...fadeInUp}>
                <Logo />
                <Typography sx={{ color: "text.secondary", mb: 5 }}>
                  Login to your account
                </Typography>
              </HeadingStyle>

              {/* <Box component={motion.div} {...fadeInUp}>
            <SocialAuth />
          </Box> */}

              {/* <Divider sx={{ my: 3 }} component={motion.div} {...fadeInUp}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              OR
            </Typography>
          </Divider> */}
              <Box marginBottom={2}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  color="secondary"
                  id="outlined-basic"
                  label="Locations"
                  variant="outlined"
                  value={selectedHospital}
                  onChange={(event) => handleHospitalChange(event)}
                >
                  {hospitals.map((hospital) => (
                    <MenuItem key={hospital.hospitalID} value={hospital.hospitalSortName}>
                      {hospital.hospitalSortName}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <LoginForm
                setAuth={setAuth}
                setPeople={handleSetPeople}
                entityRID={entityRID}
              ></LoginForm>

              <Typography
                component={motion.p}
                {...fadeInUp}
                variant="body2"
                align="center"
                sx={{ mt: 3 }}
              >
                Don’t have an account?{" "}
                <Link variant="subtitle2" component={RouterLink} to="/signup">
                  Sign up
                </Link>
              </Typography>
            </ContentStyle>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
};

export default Login;

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import NavbarLanding from "../navbars/navbarLanding";
import { useParams } from "react-router-dom";
import axios from "axios";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="http://www.zam.co.in/">
        Hire Truck
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// const theme = createTheme();
const theme = createTheme({
  palette: {
    primary: {
      main: "#0077be",
    },
    secondary: {
      main: "#d9d9d9",
    },
  },
  typography: {
    fontFamily: ["Montserrat", "sans-serif"].join(","),
  },
});

export default function Login(props) {
  // localStorage.setItem("userToken", "");
  const navigate = useNavigate();

  React.useEffect(() => {
    if (props.isJwt) {
      navigate("/dashboard");
    }
  }, []);
  const uType = useParams().usertype;
  const [isButtonLoading, setButtonLoading] = React.useState(false);
  const [data, setData] = useState({
    userName: "",
    passWord: "",
  });

  const changeHandler = (event) => {
    setData({ ...data, [event.target.name]: [event.target.value] });
  };

  const sendData = async (usr_data) => {
    var post_url = "http://localhost:4003/user/";

    if (uType === "freight") {
      post_url += "login_freight_owner";
    } else {
      post_url += "login_truck_owner";
    }

    axios
      .post(post_url, usr_data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        alert("Authenticated!");
        setButtonLoading(false);
        props.setUserType(uType);
        props.setUserName(data.userName[0]);
        localStorage.setItem("userToken", res.data.token);
        console.log("rogjddpasjkfcvoi", res.data.token);
        props.setJwt(res.data.token);
        props.setIsJwt(true);
        navigate("/dashboard");
      })
      .catch((error) => {
        if (error.response.status === 404) {
          alert("Incorrect Username/Password!");
        } else {
          alert("User does not exist!");
        }
        setButtonLoading(false);
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setButtonLoading(true);
    console.log("data", data);
    const sData = JSON.stringify({
      userName: data.userName[0],
      passWord: data.passWord[0],
    });

    await sendData(sData);
  };

  return (
    <div style={{ backgroundColor: "#f0f4f8", minHeight: "100vh" }}>
      <NavbarLanding />
      <ThemeProvider theme={theme} sx={{ paddingTop: "20px" }}>
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "40px",
            paddingTop: "20px",
            marginTop: "40px",
          }}
          // component="main"
          // style={{
          //   backgroundColor: "skyblue",
          //   borderRadius: "100px",
          //   height: "70vh",
          //   width: "500px",
          // }}
        >
          <CssBaseline />
          <Box
            sx={{
              // marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main", marginTop: 8 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="User Name"
                name="userName"
                autoComplete="userName"
                autoFocus
                onChange={changeHandler}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="passWord"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={changeHandler}
              />
              {isButtonLoading ? (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress />
                </div>
              ) : (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={data.userName == "" || data.passWord == ""}
                  style={{
                    backgroundColor:
                      data.userName == "" || data.passWord == ""
                        ? "#0077be"
                        : "",
                  }}
                >
                  Sign In
                </Button>
              )}
              <Grid container>
                <Grid item>
                  <Button
                    variant="body2"
                    // href="#"
                    onClick={props.func}
                    // fullWidth variant="outlined"
                    sx={{ width: 400, padding: 1, margin: 2 }}
                  >
                    {"Don't have an account? Register"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </div>
  );
}
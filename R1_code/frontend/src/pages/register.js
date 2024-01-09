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
import NavbarLanding from "../navbars/navbarLanding";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

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

const theme = createTheme();

export default function Register(props) {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (props.isJwt) {
      navigate("/dashboard");
    }
  }, []);
  const uType = useParams().usertype;
  const [isButtonLoading, setButtonLoading] = React.useState(false);
  const [data, setData] = React.useState({
    companyName: "",
    companyType: "",
    registrationDate: "",
    registrationNumber: "",
    tin: "",
    gstNumber: "",
    officeAddress: "",
    officePincode: "",
    state: "",
    emailId: "",
    phoneNumber: "",
    faxNumber: "",
    userName: "",
    password: "",
  });

  const changeHandler = (event) => {
    setData({ ...data, [event.target.name]: [event.target.value] });
  };

  const sendData = async (reg_data) => {
    var post_url = "http://localhost:4003/user/";

    if (uType === "freight") {
      post_url += "register_freight_owner";
    } else {
      post_url += "register_truck_owner";
    }

    // console.log(reg_data);

    axios
      .post(post_url, reg_data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        alert("User Registered, Kindly Login");
        setButtonLoading(false);
        console.log(res.data);
        // setButtonLoading(false);
        // props.setUserName(res.datauser.emailId);
        // localStorage.setItem("userTok", res.data.token);
        // props.setJwt(res.data.token);
        // props.JwtState(true);
        // navigate("/dashboard");
      })
      .catch((error) => {
        // console.log(error.response.status);
        if (error.response.status === 404) {
          alert("User already exists!");
        } else {
          alert("User could not be registered! Try again!");
        }
        setButtonLoading(false);
      });
  };

  const handleSubmit = (event) => {
    setButtonLoading(true);
    event.preventDefault();

    const registerObj = {
      companyName: data.companyName[0],
      companyType: data.companyType[0],
      registrationDate: data.registrationDate[0],
      registrationNumber: data.registrationNumber[0],
      tin: data.tin[0],
      gstNumber: data.gstNumber[0],
      officeAddress: data.officeAddress[0],
      officePincode: data.officePincode[0],
      state: data.state[0],
      emailId: data.emailId[0],
      contact: data.phoneNumber[0],
      faxNumber: data.faxNumber[0],
      username: data.userName[0],
      password: data.password[0],
    };

    const sData = JSON.stringify(registerObj);

    sendData(sData);
  };

  return (
    <div style={{ backgroundColor: "#f0f4f8", minHeight: "100vh" }}>
      <NavbarLanding />
      <div style={{ paddingTop: "30px" }}>
        <ThemeProvider
          theme={theme}
          sx={{
            paddingTop: "20px",
            padding: "20px",
            paddingLeft: "30px",
            paddingRight: "30px",
          }}
        >
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
          >
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign up
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      // autoComplete="given-name"
                      name="companyName"
                      required
                      fullWidth
                      id="companyName"
                      label="Company Name"
                      autoFocus
                      onChange={changeHandler}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="userName"
                      label="User Name"
                      name="userName"
                      autoComplete="userName"
                      onChange={changeHandler}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="companyType"
                      label="Company Type"
                      name="companyType"
                      autoComplete="companyType"
                      onChange={changeHandler}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      // autoComplete="user-name"
                      name="registrationDate"
                      required
                      fullWidth
                      id="registrationDate"
                      label="Registration Date"
                      autoFocus
                      onChange={changeHandler}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      // autoComplete="user-name"
                      name="registrationNumber"
                      required
                      fullWidth
                      id="registrationNumber"
                      label="Registration Number"
                      autoFocus
                      onChange={changeHandler}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="tin"
                      label="TIN Number"
                      name="tin"
                      onChange={changeHandler}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="gstNumber"
                      label="GST Number"
                      name="gstNumber"
                      onChange={changeHandler}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="officeAddress"
                      label="Office Address"
                      name="officeAddress"
                      onChange={changeHandler}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="officePincode"
                      label="Office Pincode"
                      name="officePincode"
                      onChange={changeHandler}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="state"
                      label="State"
                      name="state"
                      onChange={changeHandler}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="emailId"
                      label="Email Id"
                      name="emailId"
                      onChange={changeHandler}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="phoneNumber"
                      label="Phone Number"
                      name="phoneNumber"
                      onChange={changeHandler}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="faxNumber"
                      label="Fax Number"
                      name="faxNumber"
                      onChange={changeHandler}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="password"
                      label="Password"
                      name="password"
                      onChange={changeHandler}
                    />
                  </Grid>
                </Grid>
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
                    disabled={
                      data.companyName == "" ||
                      data.companyType == "" ||
                      data.registrationDate == "" ||
                      data.registrationNumber == "" ||
                      data.userName == "" ||
                      data.password == "" ||
                      data.tin == "" ||
                      data.gstNumber == "" ||
                      data.officeAddress == "" ||
                      data.officePincode == "" ||
                      data.state == "" ||
                      data.officePincode == "" ||
                      data.emailId == "" ||
                      data.phoneNumber == "" ||
                      data.faxNumber == ""
                    }
                    style={{
                      color: "white",
                      backgroundColor:
                        data.companyName == "" ||
                        data.companyType == "" ||
                        data.registrationDate == "" ||
                        data.registrationNumber == "" ||
                        data.userName == "" ||
                        data.password == "" ||
                        data.tin == "" ||
                        data.gstNumber == "" ||
                        data.officeAddress == "" ||
                        data.officePincode == "" ||
                        data.state == "" ||
                        data.officePincode == "" ||
                        data.emailId == "" ||
                        data.phoneNumber == "" ||
                        data.faxNumber == ""
                          ? "#0077be"
                          : "",
                    }}
                  >
                    Sign Up
                  </Button>
                )}
                {/* <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => props.onFormSwitch("login")}
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid> */}
                <Grid container>
                  <Grid item>
                    <Button
                      variant="body2"
                      // href="#"
                      onClick={props.func}
                      // fullWidth variant="outlined"
                      sx={{ width: 400, padding: 1, margin: 2 }}
                    >
                      {"Don't have an account? Login"}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
          </Container>
        </ThemeProvider>
      </div>
    </div>
  );
}

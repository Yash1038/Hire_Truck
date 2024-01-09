import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: "#222",
  },
  logo: {
    fontWeight: "bold",
    textTransform: "uppercase",
    marginLeft: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  linkContainer: {
    marginLeft: theme.spacing(5),
    display: "flex",
  },
  navButton: {
    marginLeft: theme.spacing(5),
    fontWeight: "bold",
    color: "yellow",
    textTransform: "uppercase",
    cursor: "pointer",
  },
}));

export default function Navbar(props) {
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("userToken");
    props.setJwt(null);
    props.setIsJwt(false);
    navigate("/");
  }

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.logo}>
            Hire Truck
          </Typography>
          <div className={classes.linkContainer}>
            <Link to="http://www.zam.co.in/about-us.html" className={classes.navButton}>
              About Us
            </Link>
            <Link to="/" className={classes.navButton}>
              Home
            </Link>
          </div>
          <LogoutOutlinedIcon
            sx={{ fontSize: "40px" }}
            className={classes.navButton}
            onClick={logout}
          />
        </Toolbar>
      </AppBar>
    </div>
  );
}

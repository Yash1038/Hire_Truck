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
    backgroundColor: "#000",
    height: 80,
  },
  logo: {
    fontWeight: "bold",
    textTransform: "uppercase",
    marginLeft: theme.spacing(2),
    fontSize: '32px',
    color: "#fff",
    textDecoration: "none",
    "&:hover": {
      color: "#ffcc00",
    },
  },
  title: {
    flexGrow: 1,
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: '28px',
  },
  linkContainer: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: theme.spacing(2),
  },
  navButton: {
    marginLeft: theme.spacing(5),
    fontWeight: "bold",
    color: "#fff",
    textTransform: "uppercase",
    fontSize: '25px',
    textDecoration: "none",
    "&:hover": {
      color: "#ffcc00",
      backgroundColor: "#222",
      borderRadius: "5px",
    },
  },
  logoutButton: {
    marginLeft: theme.spacing(5),
    fontWeight: "bold",
    backgroundColor: "#ff0000",
    color: "#fff",
    textTransform: "uppercase",
    fontSize: '20px',
    textDecoration: "none",
    "&:hover": {
      color: "#ffcc00",
      backgroundColor: "#222",
      borderRadius: "5px",
    },
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
        <Toolbar className={classes.toolbar}>
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
            <Link to="/dashboard2" className={classes.navButton}>
              Ask Quotes
            </Link>
            <Link to="/search" className={classes.navButton}>
              Search
            </Link>
            <Link to="/quoterequests" className={classes.navButton}>
              Quotations Offers
            </Link>
            <Link to="/match" className={classes.navButton}>
              Best Suggestions
            </Link>
            <Link to="/acceptedquotes" className={classes.navButton}>
              Accepted Quotes
            </Link>
            {/* <Link to="/rendermap" className={classes.navButton}>
Map
</Link> */}
            <Button
              variant="contained"
              startIcon={<LogoutOutlinedIcon />}
              onClick={logout}
              className={classes.logoutButton}
            >
              Logout
            </Button> 
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

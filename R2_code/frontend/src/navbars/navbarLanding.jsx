// import React from "react";
// import { Link } from "react-router-dom";
// import "../styles/navbarLanding.css";
// import LocalShippingIcon from "@mui/icons-material/LocalShipping";

// export default function NavbarLanding(props) {
//   return (
//     <nav className="navbar">
//       <h3 className="logo">
//         <p>HIRE TRUCK</p>
//       </h3>
//       {/* <LocalShippingIcon /> */}
//       <ul className="nav-links">
//         <Link to="/" className="home">
//           <li>Home</li>
//         </Link>
//         <Link to="/about" className="about">
//           <li>About Us</li>
//         </Link>
//         <Link to="/freight" className="freight">
//           <li>Freight Owner? Hire a Truck?</li>
//         </Link>
//         <Link to="/truck" className="truck">
//           <li>Truck Owner?</li>
//         </Link>
//       </ul>
//     </nav>
//   );
// }

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: '#000',
    height: 80,
  },
  logo: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginLeft: theme.spacing(2),
    fontSize: '32px',
    color: '#fff',
    textDecoration: 'none',
    '&:hover': {
      color: '#ffcc00',
    },
  },
  title: {
    flexGrow: 1,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: '28px',
  },
  linkContainer: {
    marginLeft: 'auto',
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: theme.spacing(2),
  },
  navButton: {
    marginLeft: theme.spacing(5),
    fontWeight: 'bold',
    color : "#fff",
    textTransform: 'uppercase',
    fontSize: '25px',
    textDecoration: 'none',
    '&:hover': {
      color: '#ffcc00',
      backgroundColor: '#222',
      borderRadius: '5px',
    },
  },
  toolbar: {
    alignItems: 'center',
  },
}));


export default function Navbar() {
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
            <Link to="/freight" className={classes.navButton}>
              Freight Owner ?
            </Link>
            <Link to="/truck" className={classes.navButton}>
              Truck Owner ?
            </Link>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

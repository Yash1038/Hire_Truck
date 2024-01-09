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
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: '#222',
  },
  logo: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginLeft: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  linkContainer: {
    marginLeft: theme.spacing(5),
    display: "flex",
  },
  navButton: {
    marginLeft: theme.spacing(5),
    fontWeight: 'bold',
    color : "yellow",
    textTransform: 'uppercase',
  },
}));

export default function Navbar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.logo}>
            Hire Truck
          </Typography>
          <div className={classes.linkContainer}>
            <Link to = "/dashboard" className={classes.navButton}>
              About Us
            </Link>
            <Link to = "/" className={classes.navButton}>
              Home
            </Link>
            <Link to = "/freight" className={classes.navButton}>
              Freight Owner ?
            </Link>
            <Link to = "/truck" className={classes.navButton}>
              Truck Owner ?
            </Link>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}


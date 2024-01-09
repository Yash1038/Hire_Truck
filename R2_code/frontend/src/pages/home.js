import "../styles/homepage.css";
import React from "react";
import Navbar from "../navbars/navbarLanding";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

import truck_owner from '../images/truck_owner.jpg';
import freight_owner from '../images/freight_owner.jpg';

const useStyles = makeStyles((theme) => ({
  button : {
    backgroundColor: '#000000', /* Set the background color */
    border: '3px solid black', /* Remove the border */
    color: 'white', /* Set the text color */
    marginBottom : '24px',
    padding: '15px 25px', /* Set the padding */
    fontSize: '20px', /* Set the font size */
    fontColor: 'black',
    cursor: 'pointer', /* Set the cursor style */
    borderRadius: '4px', /* Add rounded corners */
    transition: '0.4s',
    // background : 'white',
    '&:hover': {
      backgroundColor: 'red', /* Add a dark-grey background on hover */
      textDecoration: 'none',
      padding : '8px 64px 8px 64px',
      color : 'white'
    }
  },

  
}));


const Home = (props) => {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (props.isJwt) {
      navigate("/dashboard");
    }
  }, []);

  const classes = useStyles();
  return (
    <div>
      <Navbar />
      <div id="banner">
        <h1>HireTruck</h1>
        {/* <h3>Placeholder text</h3> */}
      </div>
      <main id="main-container">
        <a href="bloglist.html">
          <h2 className="section-heading">Links</h2>
        </a>
        <section>
          <div className="card">
            <div className="card-image">
              <img src={freight_owner} alt="" className="square"/>
            </div>
            <div className="card-description">
              <a href="freight">
                <h2>Freight Owners</h2>
              </a>
              {/* <p></p> */}
              <br/>
              <Link to="/freight" className={classes.button}>
               Login/Register
              </Link>
            </div>
          </div>
          <div className="card">
            <div className="card-image">
              <img src={truck_owner} alt="" className="square" />
            </div>
            <div className="card-description">
              <a href="truck">
                <h2>Truck Owners</h2>
              </a>
              {/* <p>Lorem ipsum goes here</p> */}
              <br/>
              <Link to="/truck" className={classes.button}>
               Login/Register
              </Link>
            </div>
          </div>
        </section>

        <h2 className="section-heading">About Us</h2>
        <section id="section-source">
          <p>
            Zam Logistics
          </p>
          {/* <a href="#">GitHub Profile</a> */}
        </section>
      </main>
      <script src="main.js"></script>
    </div>
  );
};

export default Home;

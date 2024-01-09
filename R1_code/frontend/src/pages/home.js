import "../App.css";
import React from "react";
import Navbar from "../navbars/navbarLanding";
import { useNavigate } from "react-router-dom";

function Home(props) {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (props.isJwt) {
      navigate("/dashboard");
    }
  }, []);
  return (
    <div>
      <Navbar />
      <div className="home_style_bg">
        <div
          className="home_style"
          style={{ fontSize: 100, fontFamily: "Pacifico" }}
        >
          <h3> Welcome to Hire Truck! </h3>
        </div>
      </div>
      {/* <Outlet/> */}
    </div>
  );
}
export default Home;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Register from "./pages/register";
import Login from "./pages/login";
import DashboardFreight from "./pages/dashboardFreight";
import DashboardTruck from "./pages/dashboardTruck";
import "./App.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProtectedRoute from "./protectedRoutes/protectedRoutes";

function Root() {
  const [t, sett] = React.useState(0);
  const [userType, setUserType] = React.useState(0);
  const [isJwt, setIsJwt] = React.useState(false);
  const [jwt, setJwt] = React.useState(localStorage["userToken"]);
  const [userName, setUserName] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (jwt) {
      setLoading(true);
      axios
        .post(
          "http://localhost:4003/user/extract_user_details",
          {
            jwt: jwt,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          let type_user = "";
          // console.log(res.data.userType);
          if (res.data.userDetails.userType === "Freight") {
            type_user = "freight";
          } else {
            type_user = "truck";
          }
          setUserName(() => res.data.userDetails.username);
          setUserType(() => type_user);

          setIsJwt(true);
        })
        .catch((err) => {
          if (err.response.request.status == 401) {
            alert("Unauthorized User! Kindly Login!");
            setIsJwt(false);
          } else {
            alert(err.response.data.message);
          }
        });
    } else {
      setUserType(1);
    }
  }, []);

  console.log(userType);

  function df() {
    sett(!t);
  }

  return (
    <div>
      {userType === 0 ? (
        <div></div>
      ) : (
        <Routes>
          <Route exact path="/" element={<Home isJwt={isJwt} />} />
          <Route
            exact
            path="/:usertype"
            element={
              t ? (
                <Register func={df} isJwt={isJwt} />
              ) : (
                <Login
                  func={df}
                  setJwt={setJwt}
                  setIsJwt={setIsJwt}
                  isJwt={isJwt}
                  setUserName={setUserName}
                  setUserType={setUserType}
                  userName={userName}
                />
              )
            }
          />
          <Route
            exact
            path="/dashboard"
            element={
              <ProtectedRoute>
                {userType === "freight" ? (
                  <DashboardFreight
                    userType={userType}
                    userName={userName}
                    jwt={jwt}
                    auth={isJwt}
                    setIsJwt={setIsJwt}
                    setJwt={setJwt}
                  />
                ) : (
                  <DashboardTruck
                    userType={userType}
                    userName={userName}
                    jwt={jwt}
                    auth={isJwt}
                    setIsJwt={setIsJwt}
                    setJwt={setJwt}
                  />
                )}
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Root />
    </Router>
  );
}
export default App;

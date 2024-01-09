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
import Dashboard2Freight from "./pages/dashboard2Freight";
import Dashboard2Truck from "./pages/dashboard2truck";
import SearchTruck from "./pages/searchFreight";
import SearchFreight from "./pages/searchTruck";
import QuotesFreight from "./pages/quotesFreight";
import QuotesTruck from "./pages/quotesTruck";
import RenderMap from "./pages/renderMap";
import AcceptedFreight from "./pages/acceptedfreight";
import AcceptedTruck from "./pages/acceptedtruck";
import MatchFreight from "./pages/matchingAlgoFreight";
import MatchTruck from "./pages/matchingAlgoTruck";

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
          <Route
            exact
            path="/dashboard2"
            element={
              <ProtectedRoute>
                {userType === "freight" ? (
                  <Dashboard2Freight
                    userType={userType}
                    userName={userName}
                    jwt={jwt}
                    auth={isJwt}
                    setIsJwt={setIsJwt}
                    setJwt={setJwt}
                  />
                ) : (
                  <Dashboard2Truck
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
          <Route
            exact
            path="/search"
            element={
              <ProtectedRoute>
                {userType === "freight" ? (
                  <SearchTruck
                    userType={userType}
                    userName={userName}
                    jwt={jwt}
                    auth={isJwt}
                    setIsJwt={setIsJwt}
                    setJwt={setJwt}
                  />
                ) : (
                  <SearchFreight
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
          <Route
            exact
            path="/quoterequests"
            element={
              <ProtectedRoute>
                {userType === "freight" ? (
                  <QuotesFreight
                    userType={userType}
                    userName={userName}
                    jwt={jwt}
                    auth={isJwt}
                    setIsJwt={setIsJwt}
                    setJwt={setJwt}
                  />
                ) : (
                  <QuotesTruck
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
          <Route
            exact
            path="/rendermap"
            element={
              <ProtectedRoute>
                <RenderMap
                  userType={userType}
                  userName={userName}
                  jwt={jwt}
                  auth={isJwt}
                  setIsJwt={setIsJwt}
                  setJwt={setJwt}
                />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/acceptedquotes"
            element={
              <ProtectedRoute>
                {userType === "freight" ? (
                  <AcceptedFreight
                    userType={userType}
                    userName={userName}
                    jwt={jwt}
                    auth={isJwt}
                    setIsJwt={setIsJwt}
                    setJwt={setJwt}
                  />
                ) : (
                  <AcceptedTruck
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
          <Route
            exact
            path="/match"
            element={
              <ProtectedRoute>
                {userType === "freight" ? (
                  <MatchFreight
                    userType={userType}
                    userName={userName}
                    jwt={jwt}
                    auth={isJwt}
                    setIsJwt={setIsJwt}
                    setJwt={setJwt}
                  />
                ) : (
                  <MatchTruck
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

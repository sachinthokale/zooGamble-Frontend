import Home from "./pages/Home";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Game from "./pages/Game";
import Login from "./pages/Login";

const App = () => {
  let isAuthenticatedUserId = localStorage.getItem("token") ? true : false;
  // isAuthenticatedUserId = true;

  return (
    <>
      <Router>
        {isAuthenticatedUserId == true ? (
          <Routes>
            <Route path="/game" element={<Game />} />
            <Route path="/" element={<Home />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        )}
      </Router>
    </>
  );
};

export default App;

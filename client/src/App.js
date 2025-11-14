import "bootstrap/dist/css/bootstrap.min.css";
import AppNavbar from "./components/AppNavbar";
import AddPost from "./components/AddPost";
import Posts from "./components/Posts";
import SinglePost from "./components/SinglePost";
import About from "./components/About";
import Home from "./components/Home";
import AppFooter from "./components/AppFooter";
import Register from "./components/Register";
import Profile from "./components/profile/Profile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "reactstrap";
import { loadUser } from "./actions/AuthActions";
import { useEffect } from "react";
import store from "./store/store";

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  });
  return (
    <Router>
      <div className="App">
        <Register />
        <div className="content">
          <AppNavbar />
          <Container>
            <Routes>
              <Route path="/api/posts/newpost" element={<AddPost />} />
              <Route path="/api/posts/:id" exact element={<SinglePost />} />
              <Route path="/api/posts" element={<Posts />} />
              <Route path="/api/users/:username" exact element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </Container>
        </div>
        <div className="foot">
          <AppFooter />
        </div>
      </div>
    </Router>
  );
}

export default App;

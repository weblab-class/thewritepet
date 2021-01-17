import React, { Component } from "react";
import { navigate, Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Landing from "./pages/Landing.js";
import Home from "./pages/Home.js";
import NewEntry from "./pages/NewEntry.js";
import PastEntry from "./pages/PastEntry.js";

import "../utilities.css";

import { socket } from "../client-socket.js";
import Navbar from "./modules/Navbar";

import { get, post } from "../utilities";

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({ 
          userId: user._id, 
        });
      }
    });
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      this.setState({ userId: user._id });
      post("/api/initsocket", { socketid: socket.id });
    }).then(() => {
      navigate("/home");
    });
  };

  handleLogout = () => {
    this.setState({ userId: undefined });
    post("/api/logout").then(() => {
      navigate("/");
    });
  };

  render() {
    if(this.state.userId) {
      return(
        <>
        <Navbar
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
        />
        <Router>
          <Landing
            path="/"
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            userId={this.state.userId}
          />
          <Home
            path="/home"
          />
          <NewEntry
            path="/newentry"
          />
          <PastEntry
            path="/timeline"
          />
          <NotFound default />
        </Router>
        </>
      );

    } else {
      return (
        <>
             <Navbar
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
        />
          <Router>
          <Landing
            path="/"
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            userId={this.state.userId}
          />
          <NotFound default />
        </Router>
        </>
      );
    }
  }
}

export default App;

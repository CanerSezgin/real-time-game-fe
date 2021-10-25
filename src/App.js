import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './pages/Home';
import Game from './pages/Game';

import io from 'socket.io-client';
const ENDPOINT = 'http://127.0.0.1:4000';

const socket = io.connect(ENDPOINT);

function App() {
  
  useEffect(() => {
    console.log("app")
  }, []);

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact>
            <Home socket={socket} />
          </Route>
          <Route path="/game/:gameId" exact>
            <Game socket={socket} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

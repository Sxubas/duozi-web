import React, { Component } from 'react';
import Login from './components/Login/Login';
import Duozi from './components/Duozi/Home/Home';
import './App.css';

class App extends Component {

  constructor(){
    super();
    this.state = {
      loggedIn: false
    };
  }

  renderLogin() {
    return(
      <Login 
        onLogin={result => {
          this.setState({loggedIn: result});
        }}
      />
    );
  }

  renderApp() {
    return(
      <Duozi />
    );
  }

  render() {
    return (
      <div className="App">
        {this.state.loggedIn ? 
          this.renderApp() :
          this.renderLogin() }
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Collection from './Collection/Collection';
import Tools from './Tools/Tools';
import Home from './Home/Home';

class Router extends Component {

  constructor(props) {
    super(props);
    this.state = {
      route: 'home',
      routeParams: {}
    };
  }

  renderRoute() {
    const route = this.state.route;

    const navigate = (route, routeParams) => {
      this.setState({ route: route , routeParams: routeParams});
    };

    let jsx = null;
    if (route === 'home') {
      jsx = (
        <Home
          email={this.props.email}
          navigate={navigate}
        />
      );
    }
    else if (route === 'collection') {
      jsx = (
        <Collection 
          email={this.props.email} 
          navigate={navigate}
          routeParams={this.state.routeParams}
        />
      );
    }
    else if (route === 'tools') {
      jsx = (
        <Tools 
          navigate={navigate}
          routeParams={this.state.routeParams}
        />
      );
    }
    else { // Wrong route 
      jsx = <div><p>Wrong route: {route}</p></div>;
    }

    return jsx;
  }

  render() {
    return (
      <div className='router-container'>
        <div className='header-container'>
          <h1>Duozi</h1>
          <h2>Learning mandarin, made easier</h2>
        </div>
        <hr className='home-hr' />
        <div className='route-container'>
          {this.renderRoute()}
        </div>
      </div>
    );
  }
}

Router.propTypes = {
  email: PropTypes.string
};

export default Router;
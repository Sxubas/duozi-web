import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Collection from './Collection/Collection';
import Tools from './Tools/Tools';
import Home from './Home/Home';
import './Router.css';

//'Root' App component which is in charge of routing to different components
class Router extends Component {

  constructor(props) {
    super(props);
    this.state = {
      route: 'home',
      routeParams: undefined
    };
  }

  renderRoute() {
    const route = this.state.route;

    //Function passed to every route, to modify app's route
    //routeParams depends on destinantion route
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
      /* this header will allways be shown in the app */
      <div className='router-container'>
        <div className='header-container'>
          <div>
            <h1>Duozi - 多字</h1>
            <h2>Toolbox for chinese learners</h2>
          </div>
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Tools extends Component {
  render() {
    return (
      <div>
        Currently in: tools {this.props.routeParams ? 'with params: ' + JSON.stringify(this.props.routeParams) : 'with no params'}
      </div>
    );
  }
}

Tools.propTypes = {
  navigate: PropTypes.func,
  routeParams: PropTypes.object
};

export default Tools;

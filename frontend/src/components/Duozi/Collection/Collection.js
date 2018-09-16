import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Collection extends Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <div>
        Currently in: collections {this.props.routeParams ? 'with params: ' + JSON.stringify(this.props.routeParams) : 'with no params'}
      </div>
    );
  }
}

Collection.propTypes = {
  email: PropTypes.string,
  navigate: PropTypes.func,
  routeParams: PropTypes.object
};

export default Collection;

import React, { Component } from 'react';

export default class Home extends Component {
  render() {
    return (
      <div className='home-container'>
        <div className='header-container'>
          <h1>Duozi</h1>
          <h2>Learning mandarin, made easier</h2>
        </div>
        <hr className='home-hr'/>
        <div className='bottom-container'>
          <div className='collection-preview-container'>

          </div>
          <div className='vertical-hr'></div>
          <div className='tools-container'>

          </div>
        </div>
      </div>
    );
  }
}

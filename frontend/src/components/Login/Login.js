import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Login extends Component {

  tryLogin = () =>{
    let validatedLogin = false;
    //TODO implement login method
    
    validatedLogin = true;
    this.props.onLogin(validatedLogin);
  }

  render() {
    return (
      <div className='login-container'>
        <div className='login-modal-container'>
          <label>User</label>
          <input type="text" placeholder=""/>
      
          <label>Password</label>
          <input type="password"/>

          <button className="login-button" onClick={this.tryLogin}>Log in</button>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  onLogin: PropTypes.func
};

export default Login;

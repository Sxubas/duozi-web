import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  handleChangeEmail(e) {
    this.setState({email: e.target.value});
  }

  handleChangePassword(e) {
    this.setState({password: e.target.value});
  }

  ComponentDidMount() {
    fetch('/users', {
      headers: {
        'email': this.state.email,
        'password': this.state.password
      }
    })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          response.json().then((json) => {console.log(json); this.props.onLogin(true);}); //the onLogin method should receive the email to storage the info of the session.
        }
      });
  }

  tryLogin() {
    //TODO implement login method
    this.ComponentDidMount();
    this.setState({email: '', password: ''});
    
  }

  render() {
    return (
      <div className='login-container'>
        <div className='login-modal-container'>
          <label>Email</label>
          <input type="text" placeholder="" value={this.state.email} onChange={this.handleChangeEmail.bind(this)}/>
      
          <label>Password</label>
          <input type="password" value={this.state.password} onChange={this.handleChangePassword.bind(this)}/>

          <button className="login-button" onClick={this.tryLogin.bind(this)}>Log in</button>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  onLogin: PropTypes.func
};

export default Login;

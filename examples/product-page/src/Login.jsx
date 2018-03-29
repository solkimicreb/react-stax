import React, { Component, Fragment } from 'react';
import { view, store, route } from 'react-easy-stack';
import { FormGroup } from 'material-ui/Form';
import Button from 'material-ui/Button';
// import { TextField } from './autoBlur';
import TextField from 'material-ui/TextField';
import * as app from './appStore';

const buttonStyle = {
  marginTop: 15
};

class Login extends Component {
  store = store();

  onChange = ev => {
    this.store[ev.target.name] = ev.target.value;
  };

  onLogin = async () => {
    await app.login(this.store);
    route({ to: '/products' });
  };

  onRegister = async () => {
    await app.register(this.store);
    route({ to: '/products' });
  };

  render() {
    return (
      <FormGroup>
        <TextField
          type="email"
          name="email"
          label="Email"
          margin="dense"
          onChange={this.onChange}
        />
        <TextField
          type="password"
          name="pass"
          label="Password"
          margin="dense"
          onChange={this.onChange}
        />
        <TextField name="username" label="Username" margin="dense" />
        <Button onClick={this.onRegister} variant="raised" style={buttonStyle}>
          Register
        </Button>
        <Button
          onClick={this.onLogin}
          variant="raised"
          color="primary"
          style={buttonStyle}
        >
          Login
        </Button>
      </FormGroup>
    );
  }
}

export default view(Login);

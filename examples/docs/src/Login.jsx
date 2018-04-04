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
      <form>
        <FormGroup>
          <TextField
            type="email"
            name="email"
            label="Email"
            autoComplete="email"
            margin="dense"
            onChange={this.onChange}
          />
          <TextField
            type="password"
            name="pass"
            label="Password"
            autoComplete="current-password"
            margin="dense"
            onChange={this.onChange}
          />
          <TextField
            name="username"
            label="Username"
            autoComplete="username"
            margin="dense"
          />
          <Button
            onClick={this.onLogin}
            variant="raised"
            color="primary"
            style={buttonStyle}
          >
            Login
          </Button>
          <Button
            onClick={this.onRegister}
            variant="raised"
            style={buttonStyle}
          >
            Register
          </Button>
        </FormGroup>
      </form>
    );
  }
}

export default view(Login);

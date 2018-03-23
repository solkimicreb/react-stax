import React, { Component } from 'react';
import { view, store, route } from 'react-easy-stack';
import { FormGroup } from 'material-ui/Form';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import appStore from './appStore';

class Login extends Component {
  store = store();

  onChange = ev => {
    this.store[ev.target.name] = ev.target.value;
  };

  onLogin = async () => {
    await appStore.login(this.store);
    route({ to: '/products' });
  };

  onRegister = async () => {
    await appStore.register(this.store);
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
        <TextField
          name="username"
          label="Username"
          margin="dense"
          onChange={this.onChange}
        />
        <Button onClick={this.onLogin}>Login</Button>
        <Button onClick={this.onRegister}>Register</Button>
      </FormGroup>
    );
  }
}

export default view(Login);

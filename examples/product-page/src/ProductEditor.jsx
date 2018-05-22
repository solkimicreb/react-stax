import React, { Component } from 'react';
import { view, store, params, route } from 'react-easy-stack';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import appStore, * as app from './appStore';

const pageStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  padding: 'inherit'
};

const productShell = {
  name: '',
  description: '',
  price: 0,
  currency: 'EUR',
  available: false
};

class ProductEditor extends Component {
  store = store({
    changes: params.id ? {} : productShell
  });

  onChange = ev => {
    this.store.changes[ev.target.name] = ev.target.value;
  };

  onCheckChange = ev => {
    this.store.changes[ev.target.name] = ev.target.checked;
  };

  onSave = async () => {
    if (params.id) {
      await app.editProduct(params.id, this.store.changes);
    } else {
      await app.saveProduct(this.store.changes);
    }
    route({ to: '/' });
  };

  render() {
    const { changes } = this.store;
    const { name, description, price, available } = Object.assign(
      {},
      appStore.product,
      changes
    );
    const label = params.id ? 'Edit Product' : 'Add Product';

    return (
      <form style={pageStyle}>
        <FormGroup>
          <TextField
            name="name"
            label="Name"
            margin="dense"
            value={name}
            onChange={this.onChange}
          />
          <TextField
            name="description"
            label="Description"
            margin="dense"
            multiline
            value={description}
            onChange={this.onChange}
          />
          <TextField
            name="price"
            type="number"
            label="Price"
            margin="dense"
            value={price}
            onChange={this.onChange}
          />
          <FormControlLabel
            label="Avaliable"
            control={
              <Checkbox
                name="available"
                checked={available}
                onChange={this.onCheckChange}
              />
            }
          />
          <Button onClick={this.onSave} variant="raised" color="primary">
            {label}
          </Button>
        </FormGroup>
      </form>
    );
  }
}

export default view(ProductEditor);

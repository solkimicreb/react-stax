import React, { Component } from 'react';
import { view, store, params } from 'react-easy-stack';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import appStore from './appStore';

const productShell = {
  name: '',
  description: '',
  price: 0,
  currency: 'EUR',
  available: undefined
};

const currencies = [
  {
    value: 'USD',
    label: '$'
  },
  {
    value: 'EUR',
    label: '€'
  },
  {
    value: 'BTC',
    label: '฿'
  },
  {
    value: 'JPY',
    label: '¥'
  }
];

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
      await appStore.editProduct(params.id, this.store.changes);
    } else {
      const { id } = await appStore.saveProduct(this.store.changes);
      params.id = id;
    }
  };

  render() {
    const { product } = this.props;
    const { changes } = this.store;
    const { name, description, price, available } = Object.assign(
      {},
      product,
      changes
    );
    const label = params.id ? 'Edit Product' : 'Add Product';

    return (
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
          multiline={true}
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
          control={
            <Checkbox
              name="available"
              checked={available}
              indeterminate={available === undefined}
              onChange={this.onCheckChange}
            />
          }
          label="Avaliable"
        />
        <Button onClick={this.onSave}>{label}</Button>
      </FormGroup>
    );
  }
}

export default view(ProductEditor);

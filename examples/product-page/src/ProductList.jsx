import React, { Component, Fragment } from 'react';
import { view, storage, params, Link } from 'react-easy-stack';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import appStore from './appStore';
import Product from './Product';

const listStyle = {
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'space-around',
  flexWrap: 'wrap'
};

const addButtonStyle = {
  position: 'fixed',
  right: 20,
  bottom: 20
};

function ProductList({ pageResolved, products }) {
  const { isLoggedIn } = appStore;
  if (!pageResolved) {
    products = storage.cache[params.search] || [];
  }

  return (
    <Fragment>
      <div style={listStyle}>
        {products.map(product => (
          <Product key={product.id} product={product} />
        ))}
      </div>
      {isLoggedIn && (
        <Link to="/product" style={addButtonStyle}>
          <Button color="primary" variant="fab">
            <AddIcon />
          </Button>
        </Link>
      )}
    </Fragment>
  );
}

export default view(ProductList);

import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { view, storage, params, path, Link } from 'react-easy-stack';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import Zoom from 'material-ui/transitions/Zoom';
import appStore from './appStore';
import Product from './Product';

const listStyle = {
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'space-around',
  flexWrap: 'wrap',
  margin: '0 -15px'
};

const addButtonStyle = {
  position: 'fixed',
  right: 20,
  bottom: 20
};

const notFoundStyle = {
  textAlign: 'center',
  textTransform: 'uppercase',
  marginTop: 30
};

function ProductList({ pageResolved, products }) {
  const { isLoggedIn } = appStore;
  if (!pageResolved) {
    products = storage.cache[params.search] || [];
  }

  return (
    <Fragment>
      {products.length ? (
        <div style={listStyle}>
          {products.map(product => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <h3 style={notFoundStyle}>No products found for '{params.search}'</h3>
      )}
      {isLoggedIn &&
        ReactDOM.createPortal(
          <Zoom in={path[0] === 'products'}>
            <Link to="/product" style={addButtonStyle}>
              <Button color="primary" variant="fab">
                <AddIcon />
              </Button>
            </Link>
          </Zoom>,
          document.getElementById('action-button')
        )}
    </Fragment>
  );
}

export default view(ProductList);

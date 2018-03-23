import React, { Component, Fragment } from 'react';
import { Router, view, params } from 'react-easy-stack';
import NavBar from './NavBar';
import ProductList from './ProductList';
import ProductEditor from './ProductEditor';
import Login from './Login';
import appStore from './appStore';

const appStyle = {
  maxWidth: 800,
  margin: '80px auto'
};

const enterAnimation = {
  keyframes: {
    opacity: [0, 1],
    transform: ['translateY(-15px)', 'none']
  },
  options: 150
};

const leaveAnimation = {
  keyframes: {
    opacity: [1, 0],
    transform: ['none', 'translateY(15px)']
  },
  options: 150
};

class App extends Component {
  searchProducts = async () => {
    await appStore.search(params.search);
  };

  render() {
    return (
      <Fragment>
        <NavBar />
        <Router
          defaultPage="products"
          style={appStyle}
          enterAnimation={enterAnimation}
          leaveAnimation={leaveAnimation}
          animate={true}
        >
          <ProductList
            page="products"
            resolve={this.searchProducts}
            timeout={800}
          />
          <ProductEditor page="product" resolve={appStore.resolveProduct} />
          <Login page="login" />
        </Router>
      </Fragment>
    );
  }
}

export default view(App);

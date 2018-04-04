import React, { Component, Fragment } from 'react';
import { Router, view, params, route } from 'react-easy-stack';
import ReactMarkdown from 'react-markdown';

const appStyle = {
  maxWidth: 880,
  margin: '50px auto',
  padding: 20
};

const enterAnimation = {
  keyframes: {
    opacity: [0, 1],
    transform: ['translateX(-10px)', 'none']
  },
  duration: 150
};

const leaveAnimation = {
  keyframes: {
    opacity: [1, 0],
    transform: ['none', 'translateX(10px)']
  },
  duration: 50
};

const input = '# This is a header\n\nAnd this is a paragraph';
const input2 = '# This is a header2\n\nAnd this is a paragraph';

class App extends Component {
  render() {
    return (
      <Router
        defaultPage="products"
        onRoute={this.onRoute}
        style={appStyle}
        enterAnimation={enterAnimation}
        leaveAnimation={leaveAnimation}
        animate={true}
      >
        <ReactMarkdown resolve={resolveMarkdown} page="products" />
        <ReactMarkdown source={input2} page="product" />
      </Router>
    );
  }
}

async function resolveMarkdown() {
  console.log(await import('./input.md'));
  return { source: await import('./input.md') };
}

export default view(App);

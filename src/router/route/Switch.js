import React, { Component } from 'react';
import { view } from '../../state';
import { path } from '../integrations';
import PropTypes from 'prop-types';

class Switch extends Component {
  // have a compex regex match instead?
  // matching with the rest of the route??
  static propTypes = {
    page: PropTypes.string.isRequired
  };

  static childContextTypes = { easyRouterDepth: PropTypes.number };
  static contextTypes = { easyRouterDepth: PropTypes.number };

  get depth() {
    return this.context.easyRouterDepth || 0;
  }

  getChildContext() {
    return { easyRouterDepth: this.depth + 1 };
  }

  render() {
    const { page, children } = this.props;

    // watch for path change instead and trigger the animation
    // then do a setState
    // it should do a leave animation!! -> I guess
    return page === path[this.depth] ? children : null;
  }
}

export default view(Switch);

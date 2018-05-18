import React, { Component } from "react";
import { view } from "react-easy-stack";
import timeago from "timeago.js";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

class TimeAgo extends Component {
  store = {
    timeAgo: ""
  };

  constructor(props) {
    super(props);
    this.updateTime();
  }

  updateTime = () => {
    const startTime = this.props.startTime * 1000;
    this.store.timeAgo = timeago().format(startTime);

    const diff = Date.now() - startTime;
    if (diff < MINUTE) {
      this.timeout = setTimeout(() => this.updateTime(), SECOND);
    } else if (diff < HOUR) {
      this.timeout = setTimeout(() => this.updateTime(), MINUTE);
    } else {
      this.timeout = setTimeout(() => this.updateTime(), HOUR);
    }
  };

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    return <span>{this.store.timeAgo}</span>;
  }
}

export default view(TimeAgo);

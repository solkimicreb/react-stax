import React, { Component } from 'react';
import { view, store, path, params } from 'react-easy-stack';
import styled from 'styled-components';
import Frame from 'react-frame-component';
import GithubIcon from 'react-icons/lib/fa/github';
import LinkIcon from 'react-icons/lib/fa/external-link';
import BackIcon from 'react-icons/lib/fa/angle-left';
import ForwardIcon from 'react-icons/lib/fa/angle-right';
import RefreshIcon from 'react-icons/lib/fa/refresh';
import { colors, ease, layout } from './theme';

const BrowserFrame = styled.div`
  width: ${props => (props.isMobile ? '100vw' : '100%')};
  height: 300px;
  margin-left: ${props => (props.isMobile ? -15 : 0)}px;
  margin-right: ${props => (props.isMobile ? -15 : 0)}px;
  border-radius: ${props => (props.isMobile ? 0 : 3)}px;
  box-shadow: 1px 1px 4px 1px ${colors.textLight};
`;

const BrowserBar = styled.nav`
  top: 0;
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 10px;
  background-color: ${colors.code};
  color: ${colors.text};
  border-bottom: 1px solid ${colors.textLight};

  svg {
    width: 30px;
    height: 30px;
    padding: 3px;
    margin: 3px;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 0.2s;
    &:hover {
      background-color: ${colors.textLight};
    }
  }
`;

const AddressBar = styled.input`
  height: 30px;
  font-size: 16px;
  margin-left: 15px !important;
  padding: 10px;
  max-width: calc(100vw - 120px);
  width: 400px;
  border: 1px solid ${colors.textLight};
  border-radius: 3px;
`;

const IFrame = styled.iframe`
  width: 100%;
  height: calc(100% - 40px);
  overflow: scroll;
  border: none;
`;

// this block all extra popstate listeners from dynamically imported
// easy-stack instances and only lets the first one activate
// this avoids double routings in history button pushes
window.addEventListener('popstate', ev => {
  // handle cases for popstate triggered by example buttons here
  // maybe example buttons shouldnt even trigger history
  ev.stopImmediatePropagation();
});

const examples = store(new Map());

const historyProto = Reflect.getPrototypeOf(window.history);
const pushState = historyProto.pushState;
const replaceState = historyProto.replaceState;

Object.assign(historyProto, {
  pushState(state, title, path) {
    // maybe just parse it from the path and later change the path a bit
    // allow passing state in route (+Link options)
    const exampleId = state.exampleId;
    if (exampleId) {
      // currentIdx is usually the idx of the last element
      // it is handled by the sandbox browser's history buttons
      // push a new state and remove future states
      examples.get(exampleId).splice(currentIdx + 1, Infinity, path);
    } else {
      Reflect.apply(pushState, window.history, [state, title, path]);
    }
  },
  replaceState(state, title, path) {
    // every link must have and exampleId
    const exampleId = state.exampleId; // get example id from path, or state maybe
    // routing changes the state object
    // it will be the same for all params changes
    // another example is routed -> changes state
    // the first example is params modified -> it wrongly modifies the second example
    // because the state points to the second example
    // only a single example can be on focus at a time!!
    // this single example is used for all
    // this could work nicely I guess
    // maybe not the best idea
    // issue -> I have to somehow route stuff
    // the only real thing I have is the path, everything else could be a remnant from an old routing
    // even this is not true ):
    // the path can also be a remnant
    // I route on one example
    // I change the params on the other example
    // in the end I should still load stuff in Iframes!!
    if (exampleId) {
      const exampleHistory = examples.get(exampleId);
      // replace the current state, do not remove future states
      exampleHistory[currentIdx] = path;
    } else {
      Reflect.apply(replaceState, window.history, [state, title, path]);
    }
  }
});

let exampleIdCounter = 0;

class Browser extends Component {
  store = store();

  componentDidMount() {
    const { render } = this.props;
    this.exampleId = exampleIdCounter++;
    examples.set(this.exampleId, { items: [], idx: 0 });
  }

  componentWillUnmount() {
    examples.delete(this.exampleId);
  }

  onHistoryBack = () => {
    const history = examples.get(exampleId);
    history.idx = Math.min(history.idx - 1, 0);
  };

  onHistoryForward = () => {
    const history = examples.get(exampleId);
    history.idx = Math.max(history.idx + 1, history.items.length - 1);
  };

  render() {
    const { children } = this.props;
    const history = examples.get(exampleId);
    // store idx in the examples store too!!
    const url = history[this.store.historyIdx];

    return (
      <BrowserFrame isMobile={layout.isMobile}>
        <BrowserBar>
          <BackIcon onClick={this.onHistoryBack} />
          <ForwardIcon onClick={this.onHistoryForward} />
          <RefreshIcon />
          <AddressBar value={url} />
        </BrowserBar>
        <div>{children}</div>
      </BrowserFrame>
    );
  }
}

export default view(Browser);

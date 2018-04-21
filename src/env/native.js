import React from 'react';
import { AsyncStorage, BackHandler, Text, View, Animated } from 'react-native';
import { Queue, priorities } from '@nx-js/queue-util';
import isNode, * as node from './node';

export const compScheduler = isNode
  ? node.compScheduler
  : new Queue(priorities.SYNC);
export const scheduler = isNode ? node.scheduler : new Queue(priorities.LOW);

// TODO -> this is async, which messes up the purpose -> I have to turn all of them into async
export const localStorage = isNode ? node.localStorage : AsyncStorage;

function updateUrl(url = '') {
  let tokens = url.split('?');
  location.pathname = tokens[0];
  location.search = tokens[1] ? `?${tokens[1]}` : '';
  tokens = location.search.split('#');
  location.hash = tokens[1] ? `#${tokens[1]}` : '';
}

const historyItems = [];
export const history = isNode
  ? node.history
  : {
      replaceState(state, title, url) {
        historyItems.pop();
        historyItems.push(url);
        updateUrl(url);
      },
      pushState(url) {
        historyItems.push(url);
        updateUrl(url);
      }
    };

export const location = isNode
  ? node.location
  : {
      pathname: '',
      search: '',
      hash: ''
    };

export const historyHandler = isNode
  ? node.historyHandler
  : handler => {
      const url = historyItems.pop();
      updateUrl(url);
      BackHandler.addEventListener('hardwareBackPress', handler);
    };

export const anchor = Text;
export const div = View;
// maybe change this later!!
export const span = View;

export function animate(keyframes, duration, container) {
  const animatedValue = new Animated.Value(0);
  const animation = Animated.timing(animatedValue, { toValue: 1, duration });

  const animations = {};
  for (let prop in keyframes) {
    if (prop === 'transform') {
      const matches = keyframes[prop].map(keyframe =>
        keyframe.match(/(.*)\((.*)\)/)
      );
      animation[prop] = [
        {
          [matches[0][0]]: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: matches.map(match => match[1])
          })
        }
      ];
    } else {
      animations[prop] = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: keyframes[prop]
      });
    }
  }

  const animatedProps = new Animated.__PropsOnlyForTests(animations, () =>
    container.setNativeProps({ style: animatedProps.__getAnimatedValue() })
  );

  return new Promise(resolve => animation.start(resolve));
}

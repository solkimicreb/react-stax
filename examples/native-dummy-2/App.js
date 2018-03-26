import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Router, Link } from 'react-native-easy-stack';

const enterAnimation = {
  keyframes: { opacity: [0, 1] /*, transform: ['translateY(-15px)', 'none']*/ },
  duration: 500
};

const leaveAnimation = {
  keyframes: { opacity: [1, 0] /*, transform: ['none', 'translateY(15px)']*/ },
  duration: 500
};

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Link to="profile">To Profile</Link>
        <Link to="settings">To Settings</Link>
        <Router
          defaultPage="profile"
          enterAnimation={enterAnimation}
          leaveAnimation={leaveAnimation}
        >
          <Text page="profile">Profile</Text>
          <Text page="settings">Settings</Text>
        </Router>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

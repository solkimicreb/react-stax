import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Router, Link } from "react-native-easy-stack";

const enterAnimation = {
  keyframes: {
    opacity: [0, 1],
    backgroundColor: ["red", "blue"],
    transform: [{ translateX: [0, 100] }]
  },
  duration: 500
};

const leaveAnimation = {
  keyframes: {
    opacity: [1, 0],
    backgroundColor: ["blue", "red"],
    transform: [{ translateX: [0, 100] }]
  },
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
          animate
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

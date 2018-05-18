import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import {
  view,
  store,
  params,
  storage,
  Router,
  Link
} from "react-native-easy-stack";

storage.counter = storage.counter || 0;

class App extends React.Component {
  increment = () => storage.counter++;
  decrement = () => storage.counter--;

  render() {
    return (
      <View style={styles.container}>
        <Link to="profile">Profile</Link>
        <Link to="settings">Settings</Link>
        <Router defaultPage="profile">
          <Text page="profile">Profile</Text>
          <Text page="settings">Settings</Text>
        </Router>
        <Text>Count: {storage.counter}</Text>
        <Button onPress={this.increment} title="Increment" />
        <Button onPress={this.decrement} title="Decrement" />
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

export default view(App);

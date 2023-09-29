import { StyleSheet, Text, View } from "react-native";
import Turtlesim from "./turtlesim";
import Example from "./example";

export default function App() {
  return (
    <View style={styles.container}>
      {/* <Turtlesim /> */}
      <Example />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
});
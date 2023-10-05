import { View, StyleSheet, StatusBar } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
export function Control() {
  function turnLeft() {
    console.log("turnLeft");
  }
  function turnRight() {
    console.log("turnRight");
  }
  function acelerate() {
    console.log("acelerate");
  }
  function brake() {
    console.log("brake");
  }

  return (
    <View style={styles.main}>
      <StatusBar hidden={true} />

      <View style={styles.controls}>
        <View>
          <Ionicons
            name="caret-back"
            size={48}
            onPress={turnLeft}
            style={styles.icons}
          />
          <Ionicons
            name="caret-forward"
            size={48}
            onPress={turnRight}
            style={styles.icons}
          />
        </View>
        <View>
          <Ionicons
            name="caret-down"
            size={48}
            onPress={brake}
            style={styles.icons}
          />
          <Ionicons
            name="caret-up"
            size={48}
            onPress={acelerate}
            style={styles.icons}
          />
        </View>
      </View>

      <View style={styles.cam}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: "row",
  },
  controls: {
    flex: 2,
    backgroundColor: "blue",
    justifyContent: "space-between",
  },
  cam: {
    flex: 8,
    backgroundColor: "green",
  },
  icons: {
    transform: [{ rotate: "90deg" }],
    marginTop: 20,
  },
});

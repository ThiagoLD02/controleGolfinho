import {
  View,
  StyleSheet,
  StatusBar,
  Button,
  TouchableHighlight,
  Text,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ROSLIB from "roslib";
import { useState } from "react";
import { getRos } from "./rosObject";
import { ControlButton } from "./components/controlButton";

export function Control() {
  const ros = getRos();

  const [intervalState, setIntervalState] = useState(null);

  function startAction(callBack) {
    console.log("Start");
    setIntervalState(setInterval(callBack, 300));
  }

  function stopAction() {
    console.log("Para para para para para");
    clearInterval(intervalState);
  }

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
          <ControlButton
            startAction={() => startAction(turnLeft)}
            stopAction={stopAction}
            icon={<Ionicons name="caret-back" size={48} style={styles.icons} />}
          />
          <ControlButton
            startAction={() => startAction(turnRight)}
            stopAction={stopAction}
            icon={
              <Ionicons name="caret-forward" size={48} style={styles.icons} />
            }
          />
        </View>
        <View>
          <ControlButton
            startAction={() => startAction(brake)}
            stopAction={stopAction}
            icon={<Ionicons name="caret-down" size={48} style={styles.icons} />}
          />
          <ControlButton
            startAction={() => startAction(acelerate)}
            stopAction={stopAction}
            icon={<Ionicons name="caret-up" size={48} style={styles.icons} />}
          />
        </View>
      </View>

      <View style={styles.cam}></View>
    </View>
  );
}

/*
function listen() {
    if (!ros.isConnected) console.log("Desconectado");
    const listener = new ROSLIB.Topic({
      ros: ros,
      name: "/thiago",
      serviceType: "std_msgs/msg/String",
    });

    listener.subscribe((res) => {
      console.log(res);
    });
  }

*/

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

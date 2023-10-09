import { View, StyleSheet, StatusBar, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ROSLIB from "roslib";
import { useEffect, useState } from "react";
import { getRos } from "./rosObject";
import { ControlButton } from "./components/controlButton";

export function Control() {
  const [turtleSimPosition, setTurtleSimPosition] = useState({
    angular_velocity: 0.0,
    linear_velocity: 0.0,
    theta: 0.0,
    x: 0.0,
    y: 0.0,
  });
  const [intervalState, setIntervalState] = useState(null);

  const ros = getRos();
  let turtleSimPositionCopy = turtleSimPosition;

  const turtleSimPositionTopic = new ROSLIB.Topic({
    ros: ros,
    name: "/turtle1/pose",
    serviceType: "turtlesim/msg/Pose",
  });

  function isDifferent(data) {
    if (
      turtleSimPositionCopy.angular_velocity !== data.angular_velocity ||
      turtleSimPositionCopy.linear_velocity !== data.linear_velocity ||
      turtleSimPositionCopy.theta !== data.theta ||
      turtleSimPositionCopy.x !== data.x ||
      turtleSimPositionCopy.y !== data.y
    ) {
      setTurtleSimPosition(data);
      return true;
    }
    return false;
  }

  useEffect(() => {
    turtleSimPositionTopic.subscribe((data) => {
      if (isDifferent(data)) {
        turtleSimPositionCopy = data;
        console.log("Updating");
      }
    });
  }, []);

  function getTurtleData() {
    turtleSimPositionTopic.subscribe((data) => {
      if (isDifferent(data)) {
        setTurtleSimPosition(data);
        console.log("Updating");
      }
    });
    turtleSimPositionTopic.unsubscribe();
  }

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
        <View style={[styles.icons, { marginLeft: 20 }]}>
          <ControlButton
            startAction={() => startAction(turnLeft)}
            stopAction={stopAction}
            icon={<Ionicons name="caret-back" size={60} />}
          />
          <ControlButton
            startAction={() => startAction(turnRight)}
            stopAction={stopAction}
            icon={<Ionicons name="caret-forward" size={60} />}
          />
        </View>
        <View style={[styles.icons, { marginRight: 20 }]}>
          <ControlButton
            startAction={() => startAction(brake)}
            stopAction={stopAction}
            icon={<Ionicons name="caret-down" size={60} />}
          />
          <ControlButton
            startAction={() => startAction(acelerate)}
            stopAction={stopAction}
            icon={<Ionicons name="caret-up" size={60} />}
          />
        </View>
      </View>

      <View style={styles.cam}>
        <Text style={styles.text}>Posicao da tartaruga</Text>
        <Text style={styles.text}>
          angular_velocity: {turtleSimPosition.angular_velocity}
        </Text>
        <Text style={styles.text}>
          linear_velocity: {turtleSimPosition.linear_velocity}
        </Text>
        <Text style={styles.text}>theta: {turtleSimPosition.theta}</Text>
        <Text style={styles.text}>x: {turtleSimPosition.x}</Text>
        <Text style={styles.text}>y: {turtleSimPosition.y}</Text>
      </View>
    </View>
  );
}

/*
function listen() {
    if (!ros.isConnected) console.log("Desconectado");
    
  }

*/

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: "column-reverse",
  },
  controls: {
    flex: 2,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "blue",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cam: {
    flex: 8,
    backgroundColor: "green",
    padding: 24,
  },
  icons: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  text: {
    fontSize: 18,
  },
});

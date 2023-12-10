import {
  View,
  StyleSheet,
  StatusBar,
  Vibration,
  Image,
  Text,
  SafeAreaView,
} from "react-native";
import ROSLIB from "roslib";
import { useRef } from "react";
import { getRos } from "./rosObject";
import { SliderControl } from "./components/sliderControl";
import { CameraImg } from "./components/cameraImg";

export function Control() {
  console.log("Reloaded");
  /* Ros */
  const ros = useRef(getRos());

  const controlData = useRef({
    linear: {
      x: 0.0,
      y: 0.0,
      z: 0.0,
    },
    angular: {
      x: 0.0,
      y: 0.0,
      z: 0.0,
    },
  });

  const lastValue = useRef({ linear: 0, angular: 0 });

  const names = [
    {
      leftName: "Esquerda",
      rightName: "Direita",
    },
    {
      leftName: "Ré",
      rightName: "A frente",
    },
  ];

  const cmdVel = new ROSLIB.Topic({
    ros: ros.current,
    name: "/cmd_vel",
    messageType: "geometry_msgs/msg/Twist",
  });

  // setTimeout(() => {
  //   console.log("calling");
  //
  //   console.log("called");
  // }, 10);

  function turn(value) {
    const msg = new ROSLIB.Message({
      linear: {
        x: controlData.current.linear.x,
        y: controlData.current.linear.y,
        z: controlData.current.linear.z,
      },
      angular: {
        x: controlData.current.angular.x,
        y: controlData.current.angular.y,
        z: value,
      },
    });
    controlData.current.angular.z = value;
    cmdVel.publish(msg);
  }

  function acelerate(value) {
    const msg = new ROSLIB.Message({
      linear: {
        x: value,
        y: controlData.current.linear.y,
        z: controlData.current.linear.z,
      },
      angular: {
        x: controlData.current.angular.x,
        y: controlData.current.angular.y,
        z: controlData.current.angular.z,
      },
    });
    controlData.current.linear.x = value;
    // if (value < 0)
    //   controlData.current.angular.z = -controlData.current.angular.z;
    cmdVel.publish(msg);
  }

  function handleAcelerate(value) {
    let normalizedValue = value / 10;

    if (normalizedValue === 0.1 || normalizedValue === -0.1) {
      normalizedValue = 0;
      if (lastValue.current.linear > 0.1 || lastValue.current.linear < -0.1)
        Vibration.vibrate(20);
    }
    if (normalizedValue === 1 || normalizedValue === -1) {
      Vibration.vibrate(50);
    }
    acelerate(normalizedValue);
    lastValue.current.linear = normalizedValue;
  }

  function handleTurn(value) {
    let normalizedValue = value / 10;

    if (normalizedValue === 0.1 || normalizedValue === -0.1) {
      normalizedValue = 0;
      if (lastValue.current.angular > 0.1 || lastValue.current.angular < -0.1)
        Vibration.vibrate(20);
    }
    if (normalizedValue === 1 || normalizedValue === -1) {
      Vibration.vibrate(50);
    }
    if (normalizedValue === 0) turn(normalizedValue);
    else turn(normalizedValue * -1);
    lastValue.current.angular = normalizedValue;
  }

  return (
    <View style={styles.main}>
      <StatusBar hidden={true} />

      <View style={styles.controls}>
        <SliderControl names={names[0]} callBack={handleTurn} />
        <SliderControl names={names[1]} callBack={handleAcelerate} />
      </View>

      <View style={styles.cam}>
        <CameraImg />
      </View>
    </View>
  );
}

// no Fluter tem um elemento de layout pra deixar como background ou foreground chamado Stacked

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: "column-reverse",
    padding: 10,
  },
  controls: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cam: {
    display: "flex",
    flex: 4,
    width: "100%",
    height: "100%",
  },
  icons: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  text: {
    fontSize: 18,
  },
  canvas: {
    display: "flex",
    width: "100%",
    height: "100%",
  },
  img: {
    width: "100%",
    height: "100%",
    borderWidth: 2,
  },
});

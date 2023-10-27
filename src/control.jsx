import { View, StyleSheet, StatusBar, Image, Text } from "react-native";
import ROSLIB from "roslib";
import { useEffect, useState } from "react";
import { getRos } from "./rosObject";
import { SliderControl } from "./components/sliderControl";
import { Buffer } from "buffer";
import Pedal from "../assets/pedal.png";

export function Control() {
  const [controlData, setControlData] = useState({
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
  const [imageData, setImageData] = useState();

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

  useEffect(() => {
    const imageTopic = new ROSLIB.Topic({
      ros: ros,
      name: "/camera1/image_raw",
      messageType: "sensor_msgs/msg/Image",
    });

    imageTopic.subscribe((msg) => {
      console.log("\n\n\n\n\n\n====================");
      imageTopic.unsubscribe();

      // lkadjsçflkjasdçlkf

      const binaryData = Buffer.from(msg.data, "base64");
      const base64Image =
        "data:image/jpeg;base64," + binaryData.toString("base64");
      setImageData(base64Image);
    });
  }, []);

  /* Ros */
  const ros = getRos();

  const topic = new ROSLIB.Topic({
    ros: ros,
    name: "/cmd_vel",
    messageType: "geometry_msgs/msg/Twist",
  });
  /* Ros */

  function turn(value) {
    const msg = new ROSLIB.Message({
      linear: {
        x: controlData.linear.x,
        y: controlData.linear.y,
        z: controlData.linear.z,
      },
      angular: {
        x: controlData.angular.x,
        y: controlData.angular.y,
        z: value,
      },
    });
    setControlData((old) => {
      old.angular.z = value;
      return old;
    });

    topic.publish(msg);
  }

  function acelerate(value) {
    const msg = new ROSLIB.Message({
      linear: {
        x: value,
        y: controlData.linear.y,
        z: controlData.linear.z,
      },
      angular: {
        x: controlData.angular.x,
        y: controlData.angular.y,
        z: controlData.angular.z,
      },
    });
    setControlData((old) => {
      old.linear.x = value;
      return old;
    });

    topic.publish(msg);
  }

  function handleAcelerate(value) {
    const normalizedValue = value / 10;
    acelerate(normalizedValue);
  }

  function handleTurn(value) {
    const normalizedValue = value / 10;
    if (normalizedValue === 0) turn(normalizedValue);
    else turn(normalizedValue * -1);
  }

  return (
    <View style={styles.main}>
      <StatusBar hidden={true} />

      <View style={styles.controls}>
        <SliderControl names={names[0]} callBack={handleTurn} />
        <SliderControl names={names[1]} callBack={handleAcelerate} />
      </View>

      <View style={styles.cam}>
        {imageData ? (
          <Image style={{ width: 800, height: 800 }} source={imageData} />
        ) : (
          <Text>Nada ainda</Text>
        )}
      </View>
    </View>
  );
}

/*

remover: Buffer, 

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
    justifyContent: "space-between",
    alignItems: "center",
  },
  cam: {
    flex: 8,
    padding: 24,
    borderColor: "black",
    borderWidth: 2,
    margin: 10,
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

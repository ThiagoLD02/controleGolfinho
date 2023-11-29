import { View, StyleSheet, StatusBar, Image, Text } from "react-native";
import ROSLIB from "roslib";
import { useEffect, useRef, useState } from "react";
import { getRos } from "./rosObject";
import { SliderControl } from "./components/sliderControl";

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

  /* Ros */
  const ros = useRef(getRos());

  const imageTopic = new ROSLIB.Topic({
    ros: ros.current,
    name: "/camera1/image_raw",
    messageType: "sensor_msgs/msg/Image",
  });

  useEffect(() => {
    imageTopic.subscribe((msg) => {
      console.log("====================");

      // const base64Image = `data:image/jpeg;base64,${msg.data}`;
      const base64Image = convertToBase64(msg.data, 800, 800);
      setImageData(base64Image);
      console.log("Passei");
      imageTopic.unsubscribe();
    });
  }, []);

  const convertToBase64 = (rawData, width, height) => {
    const bytesPerPixel = 3; // Assuming RGB format (3 color channels)
    const bitsPerChannel = 5; // Bit depth per channel

    // Calculate the size of the buffer based on image dimensions and bit depth
    const bufferSize = width * height * bytesPerPixel;

    const buffer = new Uint8Array(bufferSize);

    // Convert raw data to the appropriate format
    for (let i = 0; i < bufferSize; i += bytesPerPixel) {
      // Extract RGB values from raw data (adjust this based on your actual data format)
      const r = (rawData[i] & 0b11111) << (bitsPerChannel * 2);
      const g =
        ((rawData[i + 1] & 0b11111) << bitsPerChannel) |
        ((rawData[i] >> (bitsPerChannel * 3)) & 0b11111);
      const b = (rawData[i + 2] & 0b11111) << bitsPerChannel;

      // Pack RGB values into a 24-bit pixel (adjust this based on your actual data format)
      const pixelValue = (r << 16) | (g << 8) | b;

      // Store the pixel value in the buffer
      buffer[i / bytesPerPixel] = (pixelValue >> 16) & 0xff; // Red
      buffer[i / bytesPerPixel + 1] = (pixelValue >> 8) & 0xff; // Green
      buffer[i / bytesPerPixel + 2] = pixelValue & 0xff; // Blue
    }

    // Convert the buffer to a base64-encoded string
    const base64String = buffer.toString("base64");

    return base64String;
  };
  ("");

  const topic = new ROSLIB.Topic({
    ros: ros.current,
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
    let normalizedValue = value / 10;
    if (normalizedValue === 0.1 || normalizedValue === -0.1)
      normalizedValue = 0;

    acelerate(normalizedValue);
  }

  function handleTurn(value) {
    let normalizedValue = value / 10;

    if (normalizedValue === 0.1 || normalizedValue === -0.1)
      normalizedValue = 0;
    else {
      if (normalizedValue > 0) normalizedValue -= 0.1;
      else if (normalizedValue < 0) normalizedValue += 0.1;
    }
    if (normalizedValue === 0) turn(normalizedValue);
    else turn(normalizedValue * -1);
    value = 0;
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
          <Image
            style={{
              width: 800,
              height: 800,
            }}
            source={{ uri: imageData }}
          />
        ) : (
          <View>
            <Text>Carregando...</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: "column-reverse",
    padding: 10,
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

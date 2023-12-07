import {
  View,
  StyleSheet,
  StatusBar,
  Vibration,
  Image,
  ImageEditor,
} from "react-native";
import ROSLIB from "roslib";
import { useEffect, useRef } from "react";
import { getRos } from "./rosObject";
import { SliderControl } from "./components/sliderControl";
export function Control() {
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

  /* Ros */
  const ros = useRef(getRos());

  const cmdVel = new ROSLIB.Topic({
    ros: ros.current,
    name: "/cmd_vel",
    messageType: "geometry_msgs/msg/Twist",
  });

  const imgTopic = new ROSLIB.Topic({
    ros: ros.current,
    name: "/camera1/image_raw",
    messageType: "sensor_msgs/msg/Image",
  });

  useEffect(() => {
    imgTopic.subscribe((res) => {
      console.log("subscribed");
      // stack(res);
      imgTopic.unsubscribe();
    });
  }, []);

  // const odometer = new ROSLIB.Topic({
  //   ros: ros.current,
  //   name: "/odom",
  //   messageType: "nav_msgs/msg/Odometry",
  // });
  /* Ros */

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

  function stack(res) {
    const data = res.data;
    const width = 800;
    const height = 800;

    const buffer = new Uint8ClampedArray(width * height * 4);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const buffPos = (y * width + x) * 4;

        const a = data.charCodeAt(buffPos + 3);
        const r = data.charCodeAt(buffPos + 0);
        const g = data.charCodeAt(buffPos + 1);
        const b = data.charCodeAt(buffPos + 2);

        buffer[buffPos + 0] = r;
        buffer[buffPos + 1] = g;
        buffer[buffPos + 2] = b;
        buffer[buffPos + 3] = a;
      }
    }

    const imageData = { width, height, data: buffer };

    ImageEditor.cropImage(
      "data:image/png;base64," + Buffer.from(imageData).toString("base64"), // assuming the data is in PNG format
      { offset: { x: 0, y: 0 }, size: { width, height } },
      (croppedImageURI) => {
        // Handle the cropped image URI
      },
      (error) => {
        console.error("Error cropping image:");
      }
    );
  }

  return (
    <View style={styles.main}>
      <StatusBar hidden={true} />

      <View style={styles.controls}>
        <SliderControl names={names[0]} callBack={handleTurn} />
        <SliderControl names={names[1]} callBack={handleAcelerate} />
      </View>

      <View style={styles.cam}>
        {false ? (
          <></>
        ) : (
          <Image
            source={{
              uri: "https://img.freepik.com/fotos-gratis/uma-pintura-de-um-lago-de-montanha-com-uma-montanha-ao-fundo_188544-9126.jpg",
            }}
            style={{ width: 700, height: 250 }} // Adjust the dimensions as needed
          />
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
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cam: {
    flex: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    // borderWidth: 2,
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

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
import { useEffect, useRef, useState } from "react";
import { getRos } from "./rosObject";
import { SliderControl } from "./components/sliderControl";
import Canvas, { ImageData } from "react-native-canvas";
import { Buffer } from "buffer";

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
  const canvasRef = useRef(null);

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

  const imgTopic = new ROSLIB.Topic({
    ros: ros.current,
    name: "/camera1/image_raw",
    messageType: "sensor_msgs/msg/Image",
  });

  function getImage(rawImg) {
    const canvas = canvasRef.current;
    if (canvas) {
      // console.log("entreii");
      canvas.width = 800;
      canvas.height = 800;

      const ctx = canvas.getContext("2d");

      // ctx.getImageData(0, 0, 800, 800).then((imgData) => {
      // console.log("oi");
      let data = new Array(800 * 800 * 4).fill(0);
      // const data = Object.values(imgData.data);
      // console.log("data", data.length);
      const inData = Buffer.from(rawImg, "base64").toString("ascii");
      // console.log(inData.length); => 1.920.000
      let j = 0;
      let i = 0; // j data in , i data out
      while (i < inData.length) {
        const r = inData.charCodeAt(j++); // read 3 16 bit words represent 1 pixel
        const g = inData.charCodeAt(j++);
        const b = inData.charCodeAt(j++);
        data[i++] = r; // red
        data[i++] = g; // green
        data[i++] = b; // blue
        data[i++] = 255; // alpha
      }

      const imageData = new ImageData(canvas, data, 800, 800);
      // ctx.createImageData(800, 800, tome);
      ctx.putImageData(imageData, 0, 0);

      // console.log("cabou");
      // });
    }

    console.log("feshow");
  }

  setTimeout(() => {
    imgTopic.subscribe((res) => {
      // const canvas = new Canvas();
      const rawImg = res.data;
      getImage(rawImg);
      imgTopic.unsubscribe();
    });
  }, 5000);

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

  async function renderCanvas(res) {
    console.log("Entrei");
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
    const canvas = new Canvas();
    const ctx = canvas.getContext("2d");
    canvas.height = 800;
    canvas.width = 800;

    const idata = new ImageData(canvas, buffer, 800, 800);

    ctx.createImageData(800, 800, idata);
    ctx.putImageData(idata, 0, 0);
    const uri = await canvas.toDataURL();
    imgTopic.unsubscribe();

    // idata.data.set(buffer);
    // ctx.putImageData(idata, 0, 0);
    // const dataUri = await canvas.toDataURL();
    // console.log("dataUri", dataUri);
    // setImgUri(dataUri);

    // ctx.putImageData(idata, 0, 0);
    // const dataUri = canvasRef.current.toDataURL();
    // console.log("Fim ", dataUri);
  }

  return (
    <View style={styles.main}>
      <StatusBar hidden={true} />

      <View style={styles.controls}>
        <SliderControl names={names[0]} callBack={handleTurn} />
        <SliderControl names={names[1]} callBack={handleAcelerate} />
      </View>

      <SafeAreaView style={styles.cam}>
        <Canvas ref={canvasRef} style={styles.canvas} />
      </SafeAreaView>
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
    flex: 4,
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
    // borderColor: "black",
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
  canvas: {
    width: "100%",
    height: "100%",
    backgroundColor: "pink",
    display: "flex",
  },
});

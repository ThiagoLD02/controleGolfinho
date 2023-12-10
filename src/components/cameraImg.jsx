import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getRos } from "../rosObject";
import ROSLIB from "roslib";
import { ImageData } from "react-native-canvas";
import { Buffer } from "buffer";
import { Image } from "expo-image";
export function CameraImg() {
  const [uri, setUri] = useState("");

  const ros = useRef(getRos());
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const imgTopic = new ROSLIB.Topic({
    ros: ros.current,
    name: "/camera1/image_raw",
    messageType: "sensor_msgs/msg/Image",
  });

  const thiago = new ROSLIB.Topic({
    ros: ros.current,
    name: "/thiago",
    messageType: "/std_msgs/String",
  });

  function getImage(rawImg) {
    const canvas = canvasRef.current;
    // const canvas = new Canvas();
    if (canvas) {
      // console.log("entreii");
      canvas.width = 800;
      canvas.height = 800;

      const ctx = canvas.getContext("2d");

      let data = new Array(800 * 800 * 4).fill(0);

      const inData = Buffer.from(rawImg, "base64").toString("ascii");
      // console.log(inData.length); => 1.920.000
      let j = 0;
      let i = 0;
      while (i < inData.length) {
        const r = inData.charCodeAt(j++);
        const g = inData.charCodeAt(j++);
        const b = inData.charCodeAt(j++);
        data[i++] = r; // red
        data[i++] = g; // green
        data[i++] = b; // blue
        data[i++] = 255; // alpha
      }
      const imageData = new ImageData(canvas, data, 800, 800);
      ctx.putImageData(imageData, 0, 0);
      canvas.toDataURL().then((uri) => {
        const imgUri = uri.substring(1, uri.length - 2);

        if (imgRef) {
          setUri(imgUri);
          console.log("foi");
        }
      });

      // document.getElementById("img").src = dataUri;
    }

    console.log("feshow");
  }

  function startLoop() {
    imgTopic.subscribe((res) => {
      const rawImg = res.data;
      getImage(rawImg);
      imgTopic.unsubscribe();
    });
  }

  useEffect(() => {
    thiago.subscribe((res) => {
      const uri = res.data;
      setUri(uri);
      // thiago.unsubscribe();
    });
  }, []);

  return (
    <View style={styles.main}>
      {uri !== "" ? (
        <Image transition={0} source={{ uri: uri }} style={styles.canvas} />
      ) : (
        <></>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "100%",
  },
  canvas: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    // backgroundColor: "green",
  },
});

import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import ROSLIB from "roslib";
import { setRos } from "./rosObject";

export function ConnectServer({ navigation }) {
  const [status, setStatus] = useState("Disconected");

  const ros = useRef(new ROSLIB.Ros({ encoding: "ascii" }));

  function connect() {
    // ros.connect("ws://192.168.2.10:8002/ros_tornado_bridge/v1"); // tornado
    ros.current.connect("ws://192.168.2.7:9090"); // rosbridge, se der erro verifique seu IP
    ros.current.on("error", function (error) {
      console.log("Error:");
      setStatus("Error");
      console.log(error);
    });

    ros.current.on("connection", function () {
      console.log("Connected!");
      setStatus("Connected");
      setRos(ros.current);
    });

    ros.current.on("close", function () {
      console.log("Connection closed");
      setStatus("Connection closed");
    });
  }

  function disconnect() {
    ros.current.close();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Status da conexão: {status} </Text>

      <Button title="Conectar" onPress={connect} />
      <Button
        title="Desconectar"
        disabled={status !== "Connected"}
        onPress={disconnect}
      />
      <Button
        title="Iniciar controle"
        disabled={status !== "Connected"}
        onPress={() => {
          navigation.navigate("Control");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  top: {
    flex: 1,
    justifyContent: "center",
  },
  button: {
    backgroundColor: "blue",
  },
});

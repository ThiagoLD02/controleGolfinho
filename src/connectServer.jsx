import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import ROSLIB from "roslib";
import { setRos } from "./rosObject";
import { getRos } from "./rosObject";

export function ConnectServer({ navigation }) {
  const [status, setStatus] = useState("Disconected");

  const ros = new ROSLIB.Ros({ encoding: "ascii" });

  function connect() {
    // ros.connect("ws://192.168.2.10:8002/ros_tornado_bridge/v1"); // tornado
    ros.connect("ws://192.168.2.5:9090"); // rosbridge, se der erro verifique seu IP
    ros.on("error", function (error) {
      console.log("Error:");
      setStatus("Error");
      console.log(error);
    });

    ros.on("connection", function () {
      console.log("Connected!");
      setStatus("Connected");
      setRos(ros);
    });

    ros.on("close", function () {
      console.log("Connection closed");
      setStatus("Connection closed");
    });
  }

  function disconnect() {
    const rosref = getRos();
    rosref.close();
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
});

import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import ROSLIB from "roslib";

function Example() {
  const [message, setMessage] = useState("Nenhuma mensagem recebida ainda!");

  const ros = new ROSLIB.Ros({ encoding: "ascii" });

  function connect() {
    ros.connect("http://localhost:8001/ros_tornado_bridge/v1");
    ros.on("error", function (error) {
      console.log("Erro:");
      console.log(error);
    });

    ros.on("connection", function () {
      console.log("Connected!");
    });

    ros.on("close", function () {
      console.log("Connection closed");
    });
  }

  function subscribe() {
    console.log("Calling subscriber");
    const listerner = new ROSLIB.Topic({
      ros: ros,
      name: "random_msg",
      messageType: "number",
    });
    listerner.subscribe((msg) => {
      console.log(msg);
    });
    console.log("Subscriber finished");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      <Button title="Enviar" onPress={subscribe} />
      <Button title="Conectar" onPress={connect} />
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
    color: "white",
  },
});

export default Example;

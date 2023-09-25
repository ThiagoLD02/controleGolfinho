import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import ROSLIB from "roslib";

function Example() {
  const [message, setMessage] = useState("Nenhuma mensagem recebida ainda!");
  const [status, setStatus] = useState("Disconected");

  const ros = new ROSLIB.Ros({ encoding: "ascii" });

  function connect() {
    ros.connect("ws://192.168.2.10:8002/ros_tornado_bridge/v1");
    ros.on("error", function (error) {
      console.log("Error:");
      setStatus("Error");
      console.log(error);
    });

    ros.on("connection", function () {
      console.log("Connected!");
      setStatus("Connected");
    });

    ros.on("close", function () {
      console.log("Connection closed");
      setStatus("Connection closed");
    });
  }

  function publish() {
    console.log("Publishing");
    var cmdVel = new ROSLIB.Topic({
      ros: ros,
      name: "/oi", // Change the topic name to where you want to publish
      messageType: "std_msgs/String",
    });

    var message = new ROSLIB.Message({
      data: "Teste",
    });

    cmdVel.publish(message);
  }

  function listener() {
    console.log("Listener ligado");
    var listener = new ROSLIB.Topic({
      ros: ros,
      name: "/random_msg", // Change the topic name to match the publisher
      messageType: "std_msgs/Int8",
    });
    listener.subscribe(function (message) {
      console.log("Received message on " + listener.name + ": " + message.data);
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      <Text style={styles.text}>Status da conexão:{status} </Text>
      <Button title="listener" onPress={listener} />
      <Button title="Conectar" onPress={connect} />
      <Button title="Publish" onPress={publish} />
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

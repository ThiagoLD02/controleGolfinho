import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import ROSLIB from "roslib";

function Example() {
  const [message, setMessage] = useState("Nenhuma mensagem recebida ainda!");
  const [status, setStatus] = useState("Disconected");

  const ros = new ROSLIB.Ros({ encoding: "ascii" });

  function connect() {
    ros.connect("ws://192.168.2.10:8002/ros_tornado_bridge/v1"); // tornado
    // ros.connect("ws://192.168.2.10:9090"); // rosbridge
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
    console.log("oi");
    ros.getTopics(
      (result) => {
        console.log(result.topics);
        console.log(result.types);
      },
      (error) => {
        console.log("deu erro", error);
      }
    );

    var cmdVel = new ROSLIB.Topic({
      ros: ros,
      name: "/cmd_vel",
      messageType: "geometry_msgs/Twist",
    });

    var twist = new ROSLIB.Message({
      linear: {
        x: 0.1,
        y: 0.2,
        z: 0.3,
      },
      angular: {
        x: -0.1,
        y: -0.2,
        z: -0.3,
      },
    });
    cmdVel.publish(twist);
  }

  function listener() {
    console.log("Listener ligado");
    var listener = new ROSLIB.Topic({
      ros: ros,
      name: "/listener", // Change the topic name to match the publisher
      messageType: "std_msgs/String",
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

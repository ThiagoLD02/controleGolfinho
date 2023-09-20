import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import ROSLIB from "roslib";

function ConnectServer() {
  const [message, setMessage] = useState("Nenhuma mensagem recebida ainda!");

  const ros = new ROSLIB.Ros({ encoding: "ascii" });

  function publish() {
    console.log("Calling publisher");
    const cmdVel = new ROSLIB.Topic({
      ros: ros,
      name: "pose_topic",
      messageType: "geometry_msgs/Pose2D",
    });

    const data = new ROSLIB.Message({
      x: 10,
      y: 20,
      theta: 30,
    });

    // publishes to the queue
    console.log("msg", data);
    cmdVel.publish(data);
  }

  function subscribe() {
    console.log("Calling subscriber");
    const listerner = new ROSLIB.Topic({
      ros: ros,
      name: "topic",
      messageType: "String",
    });
    console.log(listerner.name);
    listerner.subscribe((msg) => {
      console.log(msg);
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      <Button title="Enviar" onPress={subscribe} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

export default ConnectServer;

import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import ROSLIB from "roslib";

export function ConnectServer({ navigation }) {
  const [status, setStatus] = useState("Disconected");
  const [response, setResponse] = useState("");
  const [rosRef, setRosRef] = useState(null);

  const ros = new ROSLIB.Ros({ encoding: "ascii" });

  function connect() {
    // ros.connect("ws://192.168.2.10:8002/ros_tornado_bridge/v1"); // tornado
    ros.connect("ws://192.168.2.10:9090"); // rosbridge
    ros.on("error", function (error) {
      console.log("Error:");
      setStatus("Error");
      console.log(error);
    });

    ros.on("connection", function () {
      console.log("Connected!");
      setStatus("Connected");
      setRosRef(ros);
    });

    ros.on("close", function () {
      console.log("Connection closed");
      setStatus("Connection closed");
    });
  }

  function publish() {
    if (!rosRef.isConnected) console.log("ta nao zz");
    const publisher = new ROSLIB.Service({
      ros: rosRef,
      name: "/add_two_ints",
      serviceType: "example_interface/srv/AddTwoInts",
    });

    const msg = new ROSLIB.Message({
      a: 7,
      b: 3,
    });

    publisher.callService(msg, (res) => {
      console.log(res);
      setResponse(res.sum);
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Status da conexão: {status} </Text>
      <Button title="Conectar" onPress={connect} />
      <Button title="Publicar" onPress={publish} />
      <Button
        title="Iniciar controle"
        disabled={status !== "Connected"}
        onPress={() => {
          navigation.navigate("Control");
        }}
      />
      <Text style={styles.text}>Resposta: {response} </Text>
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

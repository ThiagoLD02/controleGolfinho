import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import ROSLIB from "roslib";

function Turtlesim() {
  const [status, setStatus] = useState("Not connected");
  const [linear, setLinear] = useState({ x: 0, y: 0, z: 0 });
  const [angular, setAngular] = useState({ x: 0, y: 0, z: 0 });
  const ros = new ROSLIB.Ros({ encoding: "ascii" });

  function convert(input) {
    if (input.charAt(0) === "-") {
      let x = input.slice(0);
      return parseInt(x);
    } else {
      return parseInt(input);
    }
  }

  function connect() {
    ros.connect("ws://192.168.2.10:8002/ros_tornado_bridge/v1");
    // won't let the user connect more than once
    ros.on("error", function (error) {
      console.log(error);
      setStatus(error);
    });

    // Find out exactly when we made a connection.
    ros.on("connection", function () {
      console.log("Connected!");
      setStatus("Connected!");
    });

    ros.on("close", function () {
      console.log("Connection closed");
      setStatus("Connection closed");
    });
  }

  function publish() {
    if (status !== "Connected!") {
      connect();
    }
    const cmdVel = new ROSLIB.Topic({
      ros: ros,
      name: "turtle1/pose",
      messageType: "geometry_msgs/Pose2D",
    });

    const data = new ROSLIB.Message({
      x: linear.x,
      y: linear.y,
      theta: angular.z,
    });

    // publishes to the queue
    console.log("msg", data);
    cmdVel.publish(data);
  }
  connect();

  return (
    <View>
      <Text>{status}</Text>
      <Text>Send a message to turtle</Text>
      <Text>Linear:</Text>
      <Text>X</Text>
      <TextInput
        name={"linear"}
        keyboardType={"numeric"}
        value={linear.x.toString()}
        onChangeText={(text) => setLinear({ ...linear, x: convert(text) })}
      />
      <Text>Y</Text>
      <TextInput
        name={"linear"}
        keyboardType={"numeric"}
        value={linear.y.toString()}
        onChangeText={(text) => setLinear({ ...linear, y: convert(text) })}
      />
      <Text>Z</Text>
      <TextInput
        name={"linear"}
        keyboardType={"numeric"}
        value={linear.z.toString()}
        onChangeText={(text) => setLinear({ ...linear, z: convert(text) })}
      />
      <Text>Angular:</Text>
      <Text>X</Text>
      <TextInput
        name={"angular"}
        keyboardType={"numeric"}
        value={angular.x.toString()}
        onChangeText={(text) => setAngular({ ...angular, x: convert(text) })}
      />
      <Text>Y</Text>
      <TextInput
        name={"angular"}
        keyboardType={"numeric"}
        value={angular.y.toString()}
        onChangeText={(text) => setAngular({ ...angular, y: convert(text) })}
      />
      <Text>Z</Text>
      <TextInput
        name={"angular"}
        keyboardType={"numeric"}
        value={angular.z.toString()}
        onChangeText={(text) => setAngular({ ...angular, z: convert(text) })}
      />
      <Button title="Publish" onPress={() => publish()} />
    </View>
  );
}

export default Turtlesim;

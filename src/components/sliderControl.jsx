import { View, StyleSheet, Text } from "react-native";
import Slider from "@react-native-community/slider";

export function SliderControl(props) {
  return (
    <View style={styles.slider}>
      <View style={styles.center}>
        <Text style={styles.centerCarret}>|</Text>
      </View>
      <Slider
        style={{
          width: 300,
        }}
        minimumValue={-10}
        maximumValue={10}
        step={1}
        value={0}
        onValueChange={props.callBack}
        minimumTrackTintColor="#0000ff"
        maximumTrackTintColor="#000000"
        thumbTintColor="#ff0000"
      />
      <View style={styles.instructions}>
        <Text>{props.names.leftName}</Text>
        <Text>{props.names.rightName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slider: {
    display: "flex",
  },
  center: {
    display: "flex",
    width: 270,
    marginLeft: 15,
    alignItems: "center",
  },
  centerCarret: { color: "black", fontWeight: "bold" },

  instructions: {
    display: "flex",
    width: 270,
    marginLeft: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

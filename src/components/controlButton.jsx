import { TouchableHighlight } from "react-native";

export function ControlButton(props) {
  return (
    <TouchableHighlight
      onPressIn={props.startAction}
      onPressOut={props.stopAction}
    >
      {props.icon}
    </TouchableHighlight>
  );
}

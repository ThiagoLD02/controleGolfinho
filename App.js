import * as React from "react";
import { ConnectServer } from "./src/connectServer";
import { Control } from "./src/control";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="ConnectServer"
          component={ConnectServer}
          options={{ title: "Conectar ao servidor" }}
        />
        <Stack.Screen
          name="Control"
          component={Control}
          options={{ headerShown: false, orientation: "landscape" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

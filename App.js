import * as React from "react";
import { ConnectServer } from "./connectServer";
import { Control } from "./control";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Teste from "./teste";

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
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Teste"
          component={Teste}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

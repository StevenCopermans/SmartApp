import React, { useEffect, useState } from "react";
import InventoryScreen from "./views/InventoryScreen";
import CheckOutScreen from "./views/CheckOutScreen";
import CheckInScreen from "./views/CheckInScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import InventoryNavigator from "./navigation/InventoryNavigator";
import TabNavigator from "./navigation/TabNavigator";
import CameraScreen from "./views/CameraScreen";
import NewProductScreen from "./views/NewProductScreen";
import { Icon } from "native-base";
import * as Font from 'expo-font';
import AppLoading from "expo-app-loading";

const Stack = createStackNavigator();

const App = () => {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadFonts() {
			await Font.loadAsync({
				Roboto: require("native-base/Fonts/Roboto.ttf"),
				Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
			});
			setIsLoading(false);
		}

		loadFonts();
	}, [])

	if (isLoading) {
		return (<AppLoading></AppLoading>);
	}

	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen name="Inventory" component={TabNavigator} />
				<Stack.Screen name="Camera" component={CameraScreen} />
				<Stack.Screen
					options={{
						headerShown: true,
						headerStyle: {
							backgroundColor: "#0064B0",
						},
						headerTintColor: '#fff',
					}}
					name="NewProduct"
					component={NewProductScreen}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;

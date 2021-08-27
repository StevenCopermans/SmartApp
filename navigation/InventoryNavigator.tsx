import React, { useState } from "react";
import InventoryScreen from "../views/InventoryScreen";
import { createStackNavigator } from "@react-navigation/stack";
import ProductScreen from "../views/ProductScreen";
import { Icon } from "native-base";

const Stack = createStackNavigator();

const InventoryNavigator = ({ navigation }: { navigation: any }) => {
	return (
		<Stack.Navigator initialRouteName="Inventory">
			<Stack.Screen
				options={{
					title: "Products",
					headerStyle: {
						backgroundColor: "#0064B0",
					},
					headerTintColor: '#fff',
				}}
				name="Inventory"
				component={InventoryScreen}
			/>
			<Stack.Screen
				options={{
					title: "Product",
					headerStyle: {
						backgroundColor: "#0064B0",
					},
					headerTintColor: '#fff',
				}}
				name="Product"
				component={ProductScreen}
			/>
		</Stack.Navigator>
	);
};

export default InventoryNavigator;

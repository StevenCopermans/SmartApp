import React from "react";
import InventoryScreen from "../views/InventoryScreen";
import CheckOutScreen from "../views/CheckOutScreen";
import CheckInScreen from "../views/CheckInScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import InventoryNavigator from "../navigation/InventoryNavigator";
import { Icon } from "native-base";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
	return (
		<Tab.Navigator
		>
			<Tab.Screen
				name="Inventory"
				component={InventoryNavigator}
				options={{
					tabBarIcon: ({color}) => (
						<Icon name="cube-outline" style={{ color: color }} />
					),
				}}
			/>
			<Tab.Screen
				name="Checkout"
				component={CheckOutScreen}
				options={{
					tabBarIcon: ({color}) => (
						<Icon
							name="log-out-outline"
							style={{ color: color }}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="Checkin"
				component={CheckInScreen}
				options={{
					tabBarIcon: ({color}) => (
						<Icon name="log-in-outline" style={{ color: color }} />
					),
				}}
			/>
		</Tab.Navigator>
	);
};

export default TabNavigator;

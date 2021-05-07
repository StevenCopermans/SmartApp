import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera } from "expo-camera";
import {
	Text,
	Body,
	Card,
	Header,
	CardItem,
	Container,
	Content,
	Button,
	View,
	Icon,
} from "native-base";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Dimensions } from "react-native";

const CameraScreen = ({
	navigation,
	route,
}: {
	navigation: any;
	route: any;
}) => {
	const [hasPermission, setHasPermission] = useState(false);
	const [scanned, setScanned] = useState(false);
	const [type, setType] = useState(Camera.Constants.Type.back);
	useEffect(() => {
		(async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);

	const handleBarCodeScanned = ({ type, data }: { type: any; data: any }) => {
		setScanned(true);
		route.params.onGoBack(data);
		navigation.goBack();
		// navigation.getParam("onGoBack")(data);
		// alert(`Bar code with type ${type} and data ${data} has been scanned!`);
	};

	if (hasPermission === null) {
		return <Text>Requesting for camera permission</Text>;
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}

	return (
		<Camera
			onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
			style={StyleSheet.absoluteFillObject}
		>
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.button}
					onPress={() => {
						route.params.onGoBack(null);
						navigation.goBack();
					}}
				>
					<Icon
						name="close-outline"
						style={{ fontSize: 40, color: "white" }}
					></Icon>
				</TouchableOpacity>
			</View>
		</Camera>
		// <BarCodeScanner
		// 	onBarCodeScanned={handleBarCodeScanned}
		// 	style={[
		// 		{
		// 			width: Dimensions.get("screen").width,
		// 			height: Dimensions.get("screen").height,
		// 		},
		// 		styles.container,
		// 	]}
		// >
		// 	<View style={styles.layerTop} />
		// 	<View style={styles.layerCenter}>
		// 		<View style={styles.layerLeft} />
		// 		<View style={styles.focused} />
		// 		<View style={styles.layerRight} />
		// 	</View>
		// 	<View style={styles.layerBottom} />
		// </BarCodeScanner>
	);
};

export default CameraScreen;

const opacity = "rgba(0, 0, 0, .6)";
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	camera: {
		flex: 1,
	},
	buttonContainer: {
		flex: 1,
		backgroundColor: "transparent",
		flexDirection: "row",
		margin: 8,
	},
	button: {
		alignSelf: "flex-start",
		alignItems: "center",
	},
	text: {
		fontSize: 18,
		color: "white",
	},
});

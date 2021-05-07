import { BarCodeScanner } from "expo-barcode-scanner";
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
	Title,
	H1,
	H2,
	H3,
	Item,
	Input,
	Image,
	Thumbnail,
	Icon,
} from "native-base";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Group, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

function openDatabase() {
	const db = SQLite.openDatabase("db.db");
	return db;
}

const db = openDatabase();

const NewProductScreen = ({
	navigation,
	route,
}: {
	navigation: any;
	route: any;
}) => {
	const [barcode, setBarcode] = useState<string>();
	const [name, setName] = useState<string>();
	const [quantity, setQuantity] = useState(0);
	const [image, setImage] = useState<string>();
	const [forceUpdate, forceUpdateId] = useForceUpdate();
	const [error, setError] = useState(false);

	const add = (
		name: string,
		quantity: Number,
		image: string,
		barcode: string
	) => {
		db.transaction(
			(tx: any) => {
				tx.executeSql(
					"insert into products (name, quantity, barcode, image) values (?, ?, ?, ?)",
					[name, quantity, barcode, image]
				);
				// tx.executeSql(
				// 	"select * from items",
				// 	[],
				// 	(_: any, { rows }: { rows: any }) =>
				// 		console.log(JSON.stringify(rows))
				// );
			},
			null,
			forceUpdate
		);
	};

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity onPress={() => validateData()}>
					<Icon name="checkmark-outline" />
				</TouchableOpacity>
			),
		});
	}, [navigation]);

	const validateData = async () => {
		console.log(image);

		if (
			name !== "" &&
			name != null &&
			barcode !== "" &&
			barcode != null &&
			image &&
			!isNaN(quantity) &&
			quantity != null
		) {
			setError(false);

			try {
				await FileSystem.makeDirectoryAsync(
					FileSystem.documentDirectory + "images/"
				);
			} catch (evt) {}
			await FileSystem.moveAsync({
				from: image,
				to: FileSystem.documentDirectory + "images/" + barcode + ".png",
			});

			add(
				name,
				quantity,
				FileSystem.documentDirectory + "images/" + barcode + ".png",
				barcode
			);

			route.params.onGoBack({
				name: name,
				quantity: quantity,
				image:
					FileSystem.documentDirectory + "images/" + barcode + ".png",
				barcode: barcode,
			});

			navigation.goBack();
		} else {
			setError(true);
		}
	};

	useEffect(() => {
		(async () => {
			const {
				status,
			} = await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (status !== "granted") {
				alert(
					"Sorry, we need camera roll permissions to make this work!"
				);
			}
		})();
	}, []);

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		console.log(result);
		if (!result.cancelled) {
			setImage(result.uri);
		}
	};

	const pickCamera = async () => {
		let result = await ImagePicker.launchCameraAsync({
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		console.log(result);
		if (!result.cancelled) {
			setImage(result.uri);
		}
	};

	return (
		<ScrollView style={styles.container}>
			<Content style={styles.content}>
				{error && (
					<Text style={{ color: "red" }}>
						All fields have to be filled in.
					</Text>
				)}

				<H3 style={styles.title}>Product name</H3>
				<Item regular style={styles.inputContainer}>
					<Input
						placeholder="Product name"
						onChangeText={(value) => setName(value)}
					/>
				</Item>

				<H3 style={styles.title}>Image</H3>
				<Container style={styles.buttonContainer}>
					<Button onPress={pickCamera}>
						<Icon name="camera" />
					</Button>
					<Button onPress={pickImage}>
						<Icon name="image" />
					</Button>
				</Container>
				{image && (
					<Thumbnail
						source={{ uri: image }}
						style={{ width: 200, height: 200 }}
					/>
				)}

				<H3 style={styles.title}>Available quantity</H3>
				<Item regular style={styles.inputContainer}>
					<Input
						placeholder="Quantity"
						keyboardType="numeric"
						value={quantity.toString()}
						onChangeText={(value) => setQuantity(Number(value))}
					/>
				</Item>

				<H3 style={styles.title}>Barcode</H3>
				<Container style={styles.barcodeContainer}>
					<Button
						onPress={() =>
							navigation.navigate("Camera", {
								onGoBack: (data: string) => {
									if (data !== null) {
										setBarcode(data);
									}
								},
							})
						}
					>
						<Icon name="camera" />
					</Button>
					<Item regular style={styles.inputContainer}>
						<Input
							placeholder="Barcode"
							value={barcode}
							onChangeText={(value) => setBarcode(value)}
						/>
					</Item>
				</Container>
			</Content>
		</ScrollView>
	);
};

function useForceUpdate() {
	const [value, setValue] = useState(0);
	return [() => setValue(value + 1), value];
}

export default NewProductScreen;

const styles = StyleSheet.create({
	backgroundColor: {
		backgroundColor: "#4267B2",
	},
	container: {
		width: "100%",
	},
	content: {
		width: "100%",
		padding: 8,
	},
	title: {
		marginTop: 16,
	},
	buttonContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		width: "35%",
		height: 52,
	},
	barcodeContainer: {
		display: "flex",
		flexDirection: "row",
		height: 46,
	},
	inputContainer: {
		backgroundColor: "#f6f6f6",
		width: "100%",
	},
});

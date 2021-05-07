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
	Left,
	Right,
	H2,
	Thumbnail,
	Icon,
	Item,
	Input,
	H3,
} from "native-base";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import * as SQLite from "expo-sqlite";

function openDatabase() {
	const db = SQLite.openDatabase("db.db");
	return db;
}

const db = openDatabase();

const CheckOutScreen = ({ navigation }: { navigation: any }) => {
	const [barcode, setBarcode] = useState<string | null>(null);
	const [product, setProduct] = useState<Array<Object>>([{}]);
	const [showError, setShowError] = useState(false);
	const [amount, setAmount] = useState(0);

	useEffect(() => {
		if (barcode != null) {
			db.transaction((tx: any) => {
				tx.executeSql(
					`select * from products where barcode = (?);`,
					[barcode],
					(_: any, { rows: { _array } }: any) => setProduct(_array)
				);
			});
			console.log(product);
		}
	}, [barcode]);

	const validate = () => {
		if (amount <= product[0].quantity) {
			setShowError(false);

			db.transaction((tx: any) => {
				tx.executeSql(
					`update products set quantity = (?) where barcode = (?);`,
					[product[0].quantity - amount, barcode],
					(_: any, { rows: { _array } }: any) => setProduct(_array)
				);
			});

			const params = {
				barcode: barcode,
				amount: amount * -1,
			};
			setBarcode(null);

			navigation.navigate("Inventory", {
				screen: "Inventory",
				params: params,
			});
		} else setShowError(true);
	};

	return (
		<Container style={styles.container}>
			<Header style={styles.backgroundColor}>
				<Body style={styles.body}>
					<Title style={styles.title}>Check out</Title>
				</Body>
				<Right>
					<TouchableOpacity
						onPress={() =>
							navigation.navigate("Camera", {
								onGoBack: (data: string) => {
									if (data !== null) setBarcode(data);
								},
							})
						}
					>
						<Text>Scan</Text>
					</TouchableOpacity>
				</Right>
			</Header>
			<Content style={styles.content}>
				{product.length > 0 && (
					<Container
						style={{
							height: "100%",
							alignItems: "center",
							backgroundColor: "#eee",
						}}
					>
						{showError && (
							<Text style={{ color: "red" }}>
								Maximum check out possible:{" "}
								{product[0].quantity}
							</Text>
						)}
						<H2>{product[0].name}</H2>
						<Thumbnail
							source={{ uri: product[0].image }}
							style={{ width: 300, height: 300, margin: "auto" }}
						/>
						<H3 style={[styles.contentTitle]}>
							Current quantity: {product[0].quantity}
						</H3>

						<H3
							style={[
								styles.contentTitle,
								styles.contentTextLeft,
							]}
						>
							Check out:{" "}
						</H3>
						<Container
							style={[
								styles.amountContainer,
								styles.contentTextLeft,
							]}
						>
							<Item regular style={styles.inputContainer}>
								<Input
									placeholder="Amount to check out"
									value={amount.toString()}
									keyboardType="numeric"
									onChangeText={(value) =>
										setAmount(Number(value))
									}
								/>
							</Item>
							<Button onPress={() => validate()}>
								<Icon name="checkmark" />
							</Button>
						</Container>
					</Container>
				)}
			</Content>
		</Container>
	);
};

export default CheckOutScreen;

const styles = StyleSheet.create({
	backgroundColor: {
		backgroundColor: "#4267B2",
	},
	container: {
		height: "100%",
		width: "100%",
		backgroundColor: "#eee",
	},
	content: {
		width: "100%",
		textAlign: "center",
		padding: 8,
		paddingTop: 32,
	},
	body: {
		marginLeft: 8,
	},
	title: {
		color: "black",
		fontSize: 20,
		fontWeight: "600",
	},
	contentTitle: {
		marginTop: 16,
	},
	contentTextLeft: {
		alignSelf: "flex-start",
	},
	amountContainer: {
		display: "flex",
		flexDirection: "row",
		height: 46,
		justifyContent: "space-between",
		width: "100%",
	},
	inputContainer: {
		backgroundColor: "#f6f6f6",
		width: "80%",
		// height: 46,
	},
});

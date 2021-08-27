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
	H1,
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
	const [error, setError] = useState();
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

			setAmount(0);
			setShowError(false);
		}
	}, [barcode]);

	const validate = () => {
		if (amount < 1) {
			setShowError(true);
			setError("Unable to check out less than 1 product");
		}

		if (amount > product[0].quantity) {
			setShowError(true);
			setError("Unable to check out more than the current stock");
		}

		if (amount <= product[0].quantity && amount >= 1) {
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
		};
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
						<Text style={{ color: "#fff", marginRight: 16 }}>Scan</Text>
					</TouchableOpacity>
				</Right>
			</Header>
			<Content style={styles.content}>
				{
					!barcode &&
					<Container style={{
						height: "100%",
						alignItems: "center",
						backgroundColor: "#fefefe",
					}}>
						<H1 style={styles.name}>Product check out</H1>
						<Text>Scan a product to check it out of your storage.</Text>

						<Button style={styles.create} onPress={() =>
							navigation.navigate("Camera", {
								onGoBack: (data: string) => {
									if (data !== null) setBarcode(data);
								},
							})
						}><Text style={styles.createText}>Scan product</Text></Button>
					</Container>
				}
				{barcode && product.length > 0 && (
					<Container
						style={{
							height: "100%",
							alignItems: "center",
							backgroundColor: "#fefefe",
						}}
					>
						{showError && (
							<Text style={{ color: "red" }}>
								{error}
							</Text>
						)}
						<H1 style={styles.name}>{product[0].name}</H1>
						<Thumbnail
							source={{ uri: product[0].image }}
							style={{ width: 250, height: 250, margin: "auto", borderRadius: 0 }}
						/>
						<H3 style={[styles.contentTitle]}>
							Currently in stock: {Number(product[0].quantity)}
						</H3>

						<H3
							style={[
								styles.contentTitle,
								styles.contentTextLeft,
							]}
						>
							Check out:{String(" ")}
						</H3>
						<Container
							style={[
								styles.amountContainer,
								styles.contentTextLeft,
							]}
						>
							<Button style={styles.numberInput} onPress={() => setAmount(Number(amount - 1))}>
								<Text>-</Text>
							</Button>
							<Container style={styles.inputContainer}>
								<Input
									placeholder="Amount to check out"
									value={amount.toString()}
									keyboardType="numeric"
									onChangeText={(value) =>
										setAmount(Number(value))
									}
								/>
							</Container>
							<Button style={styles.numberInput} onPress={() => setAmount(Number(amount + 1))}>
								<Text>+</Text>
							</Button>
						</Container>

						<Button style={styles.create} onPress={() => validate()}><Text style={styles.createText}>Check out</Text></Button>

						<Button style={styles.create} onPress={() =>
							navigation.navigate("Camera", {
								onGoBack: (data: string) => {
									if (data !== null) setBarcode(data);
								},
							})
						}><Text style={styles.createText}>Scan new product</Text></Button>
					</Container>
				)}
			</Content>
		</Container >
	);
};

export default CheckOutScreen;

const styles = StyleSheet.create({
	backgroundColor: {
		backgroundColor: "#0064B0",
	},
	container: {
		height: "100%",
		width: "100%",
		backgroundColor: "#fefefe",
	},
	content: {
		width: "100%",
		textAlign: "center",
		padding: 24,
		paddingTop: 32,
	},
	body: {
		marginLeft: 8,
	},
	title: {
		color: "#fff",
		fontSize: 20,
		fontWeight: "600",
	},
	contentTitle: {
		marginTop: 32,
	},
	contentTextLeft: {
		alignSelf: "flex-start",
	},
	amountContainer: {
		display: "flex",
		flexDirection: "row",
		height: "auto",
		justifyContent: "space-between",
		width: "100%",
		backgroundColor: "#00000000"
	},
	inputContainer: {
		backgroundColor: "#f6f6f6",
		width: "100%",
		height: "auto",
		borderWidth: 1,
		borderColor: "#d7d7d7",
		margin: 0,
		marginLeft: 8,
		marginRight: 8,
	},
	numberInput: {
		height: "100%",
	},
	name: {
		fontWeight: "bold",
		marginBottom: 32
	},
	create: {
		backgroundColor: "#0064B0",
		width: "100%",
		// margin: "5%",
		marginTop: 24,
		marginBottom: 0
	},
	createText: {
		width: "100%",
		textAlign: "center"
	},
});

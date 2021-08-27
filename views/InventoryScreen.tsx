import {
	Text,
	Body,
	Card,
	CardItem,
	Container,
	Header,
	Content,
	Button,
	Thumbnail,
	H3,
	Icon
} from "native-base";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";
import * as SQLite from "expo-sqlite";

function openDatabase() {
	const db = SQLite.openDatabase("db.db");
	return db;
}

const db = openDatabase();

const InventoryScreen = ({
	navigation,
	route,
}: {
	navigation: any;
	route: any;
}) => {
	const [products, setProducts] = useState([{}]);
	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity style={{marginRight: 8}}
					onPress={() =>
						navigation.navigate("NewProduct", {
							onGoBack: (data: Object) => {
								console.log("Adding product callback");
								if (data !== null) addProduct(data);
							},
						})
					}
				>
					<Icon name="add-outline" style={{color: "#fff"}}/>
				</TouchableOpacity>
			),
		});
	}, [navigation]);

	React.useEffect(() => {
		console.log("nav");
		if (route.params && route.params.barcode != null) {
			console.log(route.params.barcode);
			console.log(route.params.amount);

			const index = products.findIndex(
				(e) => e.barcode == route.params.barcode
			);

			const tempProducts = products;
			tempProducts[index].quantity =
				tempProducts[index].quantity + route.params.amount;

			setProducts(tempProducts);

			navigation.setParams({ barcode: null });
		}
	}, [route]);

	React.useEffect(() => {
		// db.transaction((tx: any) => {
		// 	tx.executeSql(
		// 		"drop table if exists products;"
		// 	);
		// });

		db.transaction((tx: any) => {
			tx.executeSql(
				"create table if not exists products (id integer primary key not null, quantity int, name text, barcode text, image string);"
			);
		});

		db.transaction((tx: any) => {
			tx.executeSql(
				`select * from products;`,
				[],
				(_: any, { rows: { _array } }: any) => setProducts(_array)
			);
		});

		console.log(products);
		console.log(products.length);

	}, []);

	let count = 0;

	const addProduct = (product: any) => {
		console.log("Adding product");

		db.transaction((tx: any) => {
			tx.executeSql(
				`select * from products;`,
				[],
				(_: any, { rows: { _array } }: any) => setProducts(_array)
			);
		});
	};

	const removeProduct = (barcode: string) => {
		console.log("Removing product");

		db.transaction((tx: any) => {
			tx.executeSql(
				`select * from products;`,
				[],
				(_: any, { rows: { _array } }: any) => setProducts(_array)
			);
		});
	};

	return (
		<ScrollView style={{ flex: 1, backgroundColor: "#fefefe" }}>
			<Container style={styles.container}>
				{/* <Header /> */}
				{products.length == 0 && <H3 style={styles.noProducts}>No products yet...</H3>}
				{
					products.map(product => (
						<TouchableOpacity
							key="{product.id}"
							onPress={() =>
								navigation.navigate(
									"Product",
									{
										id: product.id,
										name: product.name,
										quantity: product.quantity,
										barcode: product.barcode,
										image: product.image,
										onGoBack: (barcode: string) => {
											if (barcode !== null)
												removeProduct(barcode);
										},
									}
								)
							}
						>
							<Grid style={styles.grid}>
								<Col style={styles.gridImage}>
									<Row>
										<Thumbnail
											source={{
												uri: product.image,
											}}
											style={{
												width: 100,
												height: 100,
												borderRadius: 0
											}}
										/>
									</Row>
								</Col>
								<Col style={styles.gridText}>
									<H3>{String(product.name)}</H3>
									<Text style={styles.barcode}>{product.barcode}</Text>
									<Text style={styles.stock}>Stock: {product.quantity}</Text>

								</Col>
							</Grid>
						</TouchableOpacity>

					))
				}

				<Button style={styles.create} onPress={() =>
					navigation.navigate("NewProduct", {
						onGoBack: (data: Object) => {
							console.log("Adding product callback");
							if (data !== null) addProduct(data);
						},
					})
				}><Text style={styles.createText}>New product</Text></Button>
			</Container>
		</ScrollView>
	);
};

export default InventoryScreen;

const styles = StyleSheet.create({
	grid: {
		flex: 1,
		paddingBottom: 4,
		marginBottom: 4,
		borderBottomColor: "grey",
		borderBottomWidth: 0.5
	},
	gridImage: {
		flex: 0.3
	},
	gridText: {
		flex: 0.7,
		paddingTop: 16,
	},
	container: {
		backgroundColor: "#00000000",
		paddingTop: 8,
		height: "100%",
		padding: 8
	},
	test: {
		height: 230,
	},
	product: {
		width: "90%",
		marginLeft: "5%",
		marginRight: "5%",
		backgroundColor: "#f7f7f7",
		padding: 8,
	},
	barcode: {
		color: "#878787"
	},
	stock: {
		color: "#454545"
	},
	create: {
		backgroundColor: "#0064B0",
		width: "90%",
		margin: "5%",
		marginTop: 48,
	},
	createText: {
		width: "100%",
		textAlign: "center"
	},
	noProducts: {
		marginTop: 32,
		width: "100%",
		textAlign: "center"
	}
});

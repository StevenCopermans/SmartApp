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
	Icon,
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
				<TouchableOpacity
					onPress={() =>
						navigation.navigate("NewProduct", {
							onGoBack: (data: Object) => {
								if (data !== null) addProduct(data);
							},
						})
					}
				>
					<Icon name="add-outline" />
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

		console.log(products.length);
		
	}, []);

	let count = 0;

	const addProduct = (product: any) => {
		console.log(product);
		
		const tempProducts = products;
		tempProducts.push(product);
		setProducts(tempProducts);
	};

	const removeProduct = (barcode: string) => {
		const tempProducts: Array<Object> = products.filter(
			(e) => e.barcode != barcode
		);
		setProducts(tempProducts);
	};

	return (
		<ScrollView style={{ flex: 1 }}>
			<Container style={{ height: "100%", backgroundColor: "#eee" }}>
				{/* <Header /> */}
				<Grid>
					<Col>
						{products === null
							? null
							: // @ts-ignore: Object is possibly 'null'.
							  products.map(
									({
										id,
										name,
										quantity,
										barcode,
										image,
									}) => {
										count += 1;

										return count % 2 == 1 ? (
											<TouchableOpacity
												key={barcode}
												onPress={() =>
													navigation.navigate(
														"Product",
														{
															id: id,
															name: name,
															quantity: quantity,
															barcode: barcode,
															image: image,
															onGoBack: (
																barcode: string
															) => {
																if (
																	barcode !==
																	null
																)
																	removeProduct(
																		barcode
																	);
															},
														}
													)
												}
											>
												<Row style={styles.test}>
													<Card
														style={styles.product}
													>
														<Body>
															<H3>{name}</H3>
															<Thumbnail
																source={{
																	uri: image,
																}}
																style={{
																	width: 150,
																	height: 150,
																}}
															/>
															<Text>
																Quantity:{" "}
																{quantity}
															</Text>
														</Body>
													</Card>
												</Row>
											</TouchableOpacity>
										) : null;
									}
							  )}
					</Col>
					<Col>
						{products === null
							? null
							: // @ts-ignore: Object is possibly 'null'.
							  products.map(
									({
										id,
										name,
										quantity,
										barcode,
										image,
									}) => {
										count += 1;
										// @ts-ignore: Object is possibly 'null'.
										if (count > products.length) count = 1;
										return count % 2 == 0 ? (
											<TouchableOpacity
												key={barcode}
												onPress={() =>
													navigation.navigate(
														"Product",
														{
															id: id,
															name: name,
															quantity: quantity,
															barcode: barcode,
															image: image,
															onGoBack: (
																barcode: string
															) => {
																if (
																	barcode !==
																	null
																)
																	removeProduct(
																		barcode
																	);
															},
														}
													)
												}
											>
												<Row style={styles.test}>
													<Card
														style={styles.product}
													>
														<Body>
															<H3>{name}</H3>
															<Thumbnail
																source={{
																	uri: image,
																}}
																style={{
																	width: 150,
																	height: 150,
																}}
															/>
															<Text>
																Quantity:{" "}
																{quantity}
															</Text>
														</Body>
													</Card>
												</Row>
											</TouchableOpacity>
										) : null;
									}
							  )}
					</Col>
				</Grid>
			</Container>
		</ScrollView>
	);
};

export default InventoryScreen;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#eee",
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
});

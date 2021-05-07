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
	H2,
} from "native-base";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";
import * as SQLite from "expo-sqlite";

function openDatabase() {
	const db = SQLite.openDatabase("db.db");
	return db;
}

const db = openDatabase();

const ProductScreen = ({
	navigation,
	route,
}: {
	navigation: any;
	route: any;
}) => {
	const [forceUpdate, forceUpdateId] = useForceUpdate();

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity onPress={() => {remove()}}>
					<Icon name="trash-outline" />
				</TouchableOpacity>
			),
		});
	}, [navigation]);

	const remove = () => {
		db.transaction(
			(tx: any) => {
				tx.executeSql("delete from products where barcode = (?)", [
					route.params.barcode,
				]);
			},
			null,
			forceUpdate
		);

        route.params.onGoBack(route.params.barcode);
        navigation.goBack();
	};

	return (
		<ScrollView style={{ flex: 1 }}>
			<Container style={styles.container}>
				<H2>{route.params.name}</H2>
				<Thumbnail
					source={{ uri: route.params.image }}
					style={{ width: 300, height: 300, margin: "auto" }}
				/>
				<H3 style={[styles.contentTitle]}>
					Current quantity: {route.params.quantity}
				</H3>

				<H3 style={[styles.contentTitle]}>
					Barcode: {route.params.barcode}
				</H3>
			</Container>
		</ScrollView>
	);
};

function useForceUpdate() {
	const [value, setValue] = useState(0);
	return [() => setValue(value + 1), value];
}

export default ProductScreen;

const styles = StyleSheet.create({
	content: {
		width: "100%",
		textAlign: "center",
		padding: 8,
	},
	contentTitle: {
		marginTop: 16,
	},
	container: {
		backgroundColor: "#eee",
		paddingTop: 32,
		height: "100%",
		alignItems: "center",
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

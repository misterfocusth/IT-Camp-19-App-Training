import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import PocketBase from "pocketbase";

const pb = new PocketBase('http://127.0.0.1:8090');

export default function App() {
  const [inputValue, setInputValue] = React.useState("");
  const [items, setItems] = React.useState([]);

  const handleSubmitButton = async () => {
    await pb.collection("items").create({
      name: inputValue,
    }).catch((error) => console.log(error))
  }

  const ListItems = () => {
    items.map((item) => {
      return (
        <View><Text>{item}</Text></View>
      )
    })
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View>
        <Text style={{ marginTop: 8, marginBottom: 8, fontSize: 24, fontWeight: "bold" }}>My List</Text>
        <TextInput style={styles.textInput} onChange={text => setInputValue(text)} value={inputValue} />
        <Button style={{ marginTop: 8, marginBottom: 8 }} onPress={() => {
          pb.collection("items").create({
            item: inputValue
          })
        }} title="Submit" />
        <View>
          <Text>{items}</Text>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    marginTop: 8,
    marginBottom: 8,
  },
  container: {
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    marginTop: 24,
    padding: 24
  },
});

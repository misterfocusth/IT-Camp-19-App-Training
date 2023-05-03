
import { useState, useEffect } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Dialog from "react-native-dialog"
import Icon from 'react-native-vector-icons/MaterialIcons';
import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090/");

export default function App() {
  const [itemName, setItemName] = useState("");
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(0)
  const [editItemName, setEditItemName] = useState("")
  const [showInputDialog, setShowInputDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllItems = async () => {
    const currentItems = await pb.collection("items").getFullList({
      sort: "-created"
    }).catch((error) => console.error(error))
    console.log(currentItems)
    setItems(currentItems)
    setIsLoading(false);
  }

  useEffect(() => {
    fetchAllItems();
  }, [])

  const getLocalDateString = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
  }

  const handleOnPressSubmitButton = async () => {
    const newItem = await pb.collection("items").create({ name: itemName, createdAt: getLocalDateString(Date.now()) });
    setItems([newItem, ...items])
    setItemName("")
  }

  const handleUpdateItemById = async (id, newValue) => {
    await pb.collection("items").update(id, { name: newValue })
    setShowInputDialog(false)
    await fetchAllItems()
  }

  const handleDeleteItemById = async (id) => {
    await pb.collection("items").delete(id);
    await fetchAllItems();
  }

  const EditItemInputDialog = () => {
    const [name, setName] = useState("");
    let selectedItem = items.filter(item => item.id === selectedItemId)
    console.log(selectedItem)

    if (!selectedItem) {
      selectedItem = [{
        name: "",
        id: "",
        createdAt: 0
      }]
    }

    return (
      <View style={styles.centeredView}>
        <Dialog.Container visible={showInputDialog}>
          <Dialog.Title>Change selected item name</Dialog.Title>
          <Dialog.Description>
            Do you want to update selected item name ? please input new item name to update.
          </Dialog.Description>
          <Dialog.Input placeholder={editItemName} onChangeText={(text) => setName(text)}></Dialog.Input>
          <Dialog.Button label="Cancel" onPress={() => setShowInputDialog(false)} />
          <Dialog.Button label="Confirm" onPress={() => {
            if (editItemName) {
              handleUpdateItemById(selectedItem[0].id, name);
            } else {
              setShowInputDialog(false);
            }
          }} />
        </Dialog.Container>
      </View>
    )
  }

  return (
    <ScrollView style={{ paddingLeft: 30, paddingRight: 30 }}>
      <Text style={styles.appTitle}>MyList</Text>
      <TextInput
        style={{
          marginTop: 8,
          marginBottom: 8,
          padding: 6,
          width: "100%",
          borderWidth: 1,
          borderRadius: 5,
        }}
        onChangeText={text => setItemName(text)}
        value={itemName}
      />
      <Button title='Submit' onPress={handleOnPressSubmitButton} />

      {!isLoading ?
        items.map(item => {
          return (
            <View
              key={item.id}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                padding: 12,
                borderBottomWidth: 0.50,
              }}>
              <View>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.name}</Text>
                <Text style={{ marginTop: 3 }}>{"Created At : " + item.createdAt}</Text>
              </View>

              <View style={{ flex: 1, flexDirection: "row", gap: 12, justifyContent: "flex-end" }}>
                <Icon.Button
                  name="edit"
                  size={16}
                  backgroundColor={"#E67E22"}
                  iconStyle={{
                    marginRight: 0,
                  }}
                  onPress={() => {
                    setEditItemName(item.name)
                    setSelectedItemId(item.id)
                    setShowInputDialog(true)
                  }}
                >
                </Icon.Button>
                <Icon.Button
                  name="delete"
                  size={16}
                  backgroundColor={"#E74C3C"}
                  iconStyle={{
                    marginRight: 0,
                  }}
                  onPress={() => {
                    handleDeleteItemById(item.id)
                  }}
                >
                </Icon.Button>
              </View>
            </View>
          )
        })
        : <View></View>}
      <EditItemInputDialog />
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 42,
  },
});

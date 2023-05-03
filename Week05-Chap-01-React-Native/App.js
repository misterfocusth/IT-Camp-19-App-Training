
import { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Dialog from "react-native-dialog"

export default function App() {
  const [itemName, setItemName] = useState("");
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(0)
  const [editItemName, setEditItemName] = useState("")
  const [showInputDialog, setShowInputDialog] = useState(false);

  const getNewItemId = () => {
    let newItemId = Math.floor(Math.random(1, 9999) * 100)
    while (true) {
      if (items.filter((item) => item.id === newItemId).length > 0) {
        newItemId = Math.floor(Math.random(1, 9999) * 100);
      } else {
        break;
      }
    }
    return newItemId;
  }

  const getLocalDateString = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
  }

  const handleOnPressSubmitButton = () => {
    const newItem = { name: itemName, createdAt: Date.now(), id: getNewItemId() }
    setItems([newItem, ...items])
    setItemName("")
  }

  const handleUpdateItemById = (id, newValue) => {
    const targetIndex = items.findIndex(item => item.id === id)
    let tempItems = [...items]
    let targetItem = { ...tempItems[targetIndex] }
    targetItem.name = newValue;
    tempItems[targetIndex] = targetItem
    setItems(tempItems)
    setShowInputDialog(false)
  }

  const handleDeleteItemById = (id) => {
    const updatedItems = items.filter(item => item.id !== id)
    setItems(updatedItems)
  }

  const EditItemInputDialog = () => {
    const [name, setName] = useState("");
    let selectedItem = items.filter(item => item.id === selectedItemId)

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

      {
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
                <TextInput style={{ fontWeight: "bold", fontSize: 16 }}>{item.name}</TextInput>
                <Text style={{ marginTop: 3 }}>{"Created At : " + getLocalDateString(item.createdAt)}</Text>
              </View>

              <View style={{ flex: 1, flexDirection: "row", gap: 12, justifyContent: "flex-end" }}>
                <Text onPress={() => {
                  setEditItemName(item.name)
                  setSelectedItemId(item.id)
                  setShowInputDialog(true)
                }}>Edit</Text>
                <Text onPress={() => handleDeleteItemById(item.id)}>Delete</Text>
              </View>
            </View>
          )
        })
      }
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

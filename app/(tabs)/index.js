import {
  StyleSheet,
  Text,
  Button,
  FlatList,
  ScrollView,
  TextInput,
} from "react-native";

import { Card } from "react-native-paper";
import { useEffect, useState } from "react";

export default function HomeScreen() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    member: "",
    image: "",
  });
  const api = "https://654ad47d5b38a59f28ee4431.mockapi.io/shop";
  useEffect(() => {
    fetch(api)
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error));
  }, []);

  const handleSubmit = () => {
    if (form.id) {
      handleUpdateItem(form);
      setForm({
        id: null,
        name: "",
        member: "",
        image: "",
      });
    } else {
      handleInsertItem(form);
      setForm({
        id: null,
        name: "",
        member: "",
        image: "",
      });
    }
  };
  const handleSelectItem = (item) => {
    setForm(item);
  };
  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };
  const handleDeleteItem = (id) => {
    fetch(`${api}/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        const newData = data.filter((item) => item.id !== id);
        setData(newData);
      })
      .catch((error) => console.error(error));
  };
  const handleInsertItem = (item) => {
    fetch("https://654ad47d5b38a59f28ee4431.mockapi.io/shop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    })
      .then((response) => response.json())
      .then((newItem) => {
        setData([...data, newItem]);
      })
      .catch((error) => console.error(error));
  };

  const handleUpdateItem = (item) => {
    fetch(`https://654ad47d5b38a59f28ee4431.mockapi.io/shop/${item.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    })
      .then((response) => response.json())
      .then((updatedItem) => {
        const newData = data.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        );
        setData(newData);
      })
      .catch((error) => console.error(error));
  };

  return (
    <ScrollView>
      <TextInput
        value={form.name}
        onChangeText={(value) => handleInputChange("name", value)}
        placeholder="Title"
      />
      <TextInput
        value={form.member}
        onChangeText={(value) => handleInputChange("member", value)}
        placeholder="Description"
      />
      <TextInput
        value={form.image}
        onChangeText={(value) => handleInputChange("image", value)}
        placeholder="Image URL"
      />
      <Button onPress={handleSubmit} title={form.id ? "Update Item" : "Insert Item"}/>

      <FlatList
        contentContainerStyle={styles.container}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={{ width: "300px", height: "300px", margin: 10 }}>
            <Card.Content>
              <Text >{item.name}</Text>
              <Text >{item.member}</Text>
            </Card.Content>
            <Card.Cover source={{ uri: item.image }} />
            <Card.Actions>
              <Button title="edit" onPress={() => handleSelectItem(item)}/>
              <Button
                onPress={() => {
                  handleDeleteItem(item.id);
                }}
                title="delete"
              >
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});

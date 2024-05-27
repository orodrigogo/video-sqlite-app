import { useEffect, useState } from "react"
import { View, Button, Alert, FlatList } from "react-native"
import { router } from "expo-router"

import { Input } from "@/components/Input"
import { Product } from "@/components/Product"

import {
  useProductDatabase,
  ProductDatabase,
} from "@/database/useProductDatabase"

export default function Index() {
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [search, setSearch] = useState("")
  const [products, setProducts] = useState<ProductDatabase[]>([])

  const productDatabase = useProductDatabase()

  async function create() {
    try {
      if (isNaN(Number(quantity))) {
        return Alert.alert("Quantidade", "A quantidade precisa ser um número!")
      }

      const response = await productDatabase.create({
        name,
        quantity: Number(quantity),
      })

      Alert.alert("Produto cadastrado com o ID: " + response.insertedRowId)
    } catch (error) {
      console.log(error)
    }
  }

  async function update() {
    try {
      if (isNaN(Number(quantity))) {
        return Alert.alert("Quantidade", "A quantidade precisa ser um número!")
      }

      const response = await productDatabase.update({
        id: Number(id),
        name,
        quantity: Number(quantity),
      })

      Alert.alert("Produto atualizado!")
    } catch (error) {
      console.log(error)
    }
  }

  async function list() {
    try {
      const response = await productDatabase.searchByName(search)
      setProducts(response)
    } catch (error) {
      console.log(error)
    }
  }

  async function remove(id: number) {
    try {
      await productDatabase.remove(id)
      await list()
    } catch (error) {
      console.log(error)
    }
  }

  function details(item: ProductDatabase) {
    setId(String(item.id))
    setName(item.name)
    setQuantity(String(item.quantity))
  }

  async function handleSave() {
    if (id) {
      update()
    } else {
      create()
    }

    setId("")
    setName("")
    setQuantity("")
    await list()
  }

  useEffect(() => {
    list()
  }, [search])

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 32, gap: 16 }}>
      <Input placeholder="Nome" onChangeText={setName} value={name} />
      <Input
        placeholder="Quantidade"
        onChangeText={setQuantity}
        value={quantity}
      />

      <Button title="Salvar" onPress={handleSave} />

      <Input placeholder="Pesquisar" onChangeText={setSearch} />

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Product
            data={item}
            onPress={() => details(item)}
            onDelete={() => remove(item.id)}
            onOpen={() => router.navigate("/details/" + item.id)}
          />
        )}
        contentContainerStyle={{ gap: 16 }}
      />
    </View>
  )
}

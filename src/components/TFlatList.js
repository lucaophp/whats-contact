import React from 'react';
import { Dimensions, FlatList, Linking, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
let db_ = null;
let data_ = null;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  item2: {
    fontWeight: "bold",
    fontSize: 18,
  }
});
const openWhats = ({ numero }) => {
  const whats = `whatsapp://send?phone=${numero}`
  Linking.canOpenURL(whats).then(supported => {
    if (supported) {
      return Linking.openURL(
        whats
      );
    } else {
      return Linking.openURL(
        "https://api.whatsapp.com/send?phone=${numero}"
      );
    }
  })
}
const deleteWhats = ({ id }, onRemove = (id) => {}) => {
  Alert.alert("Excluir", "Você deseja excluir esse item?", [
    {
      text: "Sim",
      onPress: () => {
        onRemove(id);
      },
    },
    {
      text: "Não",
    },
  ]);
  
}

const TFlatList = ({ data, db, onRemove, onEdit = () => {}, onTransfere = () => {}, keyN = null }) => {
  db_ = db
  data_ = data
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        ListHeaderComponent={() => (
          <View/>
        )}
        ListFooterComponent={() => (
          <View/>
        )}
        renderItem={({item}) => (
          <TouchableOpacity onLongPress={() => onEdit(item)} onPress={()=> openWhats(item)} style={{ backgroundColor:"#e1e1e1", flexDirection: "row", justifyContent: "space-between", minWidth: Dimensions.get('screen').width, padding: 10, marginTop: 5}}>
            <View>
              <Text style={styles.item2}>
                <Text>{item.nome}</Text>
              
              </Text>
              <Text  style={styles.item}>{item.numero}</Text>
            </View>
            <Text>
              <Icon name="delete" size={30} color="#e33057" onPress={() => deleteWhats(item, onRemove)} />
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default TFlatList;
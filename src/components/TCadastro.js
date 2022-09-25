

import { useState, useEffect } from "react";
import {
    Button,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
 
  View,
} from "react-native";

const TCadastro = ({ db, contatos, contato = null, permContato = null, onCadastrar = () => {}, onTransfere = () => {} }) => {
    const [nome, setNome] = useState('')
    const [numero, setNumero] = useState('+55')
    const [id, setID] = useState(null)
    
    useEffect(() => {
        if (contato === null) {
            setNome('')
            setNumero('+55')
            setID(null)
            return
        }
        setNome(contato.nome)
        setNumero(contato.numero)
        setID(contato.id)
        return () => {}
    }, [])
    return (
        <View style={ {margin: 10, paddingBottom: Dimensions.get('screen').height / 3} }>
            {id ? <Text>#{id}</Text> : null}
            <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome do contato"/>
            <TextInput style={styles.input} value={numero} onChangeText={setNumero} placeholder="Número do contato"/>
            <Button style={styles.input} title="Cadastrar" onPress={()=>onCadastrar({nome, numero, id})}></Button>
            { id && permContato && permContato.granted ?
            <View style={{ marginTop: 40}}>
                <Button title="Salvar no Celular" color={'black'} onPress={()=> onTransfere({ nome, numero, id })}></Button>
            </View>:
            <View></View>
            }
        </View>
    )
};
const styles = StyleSheet.create({
    input: {
        padding: 10, borderWidth: 1, margin: 10, borderRadius: 20
    }
    
})
export default TCadastro;
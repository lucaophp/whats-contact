import { useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, View, Text, Alert } from "react-native";
import * as SQLite from "expo-sqlite";
import * as Contacts from 'expo-contacts';
import Constants from "expo-constants";
import TFlatList from "./src/components/TFlatList";
import TCadastro from "./src/components/TCadastro";
const db = SQLite.openDatabase('db.db')

const App = () => {
    const [contatos, setContatos] = useState([]);
    const [cadastro, setCadastro] = useState(false)
    const [contato, setContato] = useState(null)
    const [permContato, setPermContato] = useState(null)
    
    useEffect(() => {
        try {
            db.transaction((tx) => {
                console.log({ tx })
                tx.executeSql('CREATE TABLE IF NOT EXISTS CONTATOS (id integer primary key not null, nome text, numero text);', null);
                tx.executeSql('SELECT * FROM CONTATOS',null, (txObj, { rows: { _array } }) => {
    
                    if (_array && _array.length > 0) setContatos(_array)
                    else setContatos([{ id: 1, nome: "Lucas", numero: "+5531991514759"}, { id: 12, nome: "Lucas", numero: "3199999999"}])
                });
                
                
            }, (err) => console.log({ err }));

        } catch(e) {
            console.log({ e })
        }
        
        return () => {
            
        }

    }, [db])
    useEffect(async () => {
        try {
            await Contacts.requestPermissionsAsync();
            Contacts.getPermissionsAsync().then(r => {
                setPermContato(r)
            })
        } catch (e) {

        }
        return () => {}
    }, [])
    const add = (text) => {
        
        setContato(null)
        setCadastro(!cadastro)
        
    };
    const atualizar = () => {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM CONTATOS',null, (txObj, { rows: { _array } }) => {
        
                if (_array && _array.length > 0) setContatos(_array)
                else setContatos([])
            });
        });
    }
    
    return (
        <View style={ styles.container }>
            <View style={ styles.header }>
                <Text style={ styles.titulo }>Meus Contatos</Text>
                <Text style={ styles.plus } onPress={ add }>{cadastro ? 'X' : '+'}</Text>
            </View>
            <ScrollView vertical={true} horizontal={false} style={ styles.body }>
                {
                    (cadastro) ? <TCadastro contato={contato} permContato={permContato} onTransfere={
                        (item) => {
                            Contacts.addContactAsync({
                                [Contacts.Fields.FirstName]: item.nome,
                                [Contacts.PHONE_NUMBERS]: [
                                    {
                                        number: item.numero
                                    }
                                ]
                            }).then(r => {
                                Alert.alert('Cadastrado com sucesso!')
                            })
                        }
                    } onCadastrar={(item) => {
                        db.transaction((tx) => {
                            if (item && !item.id) tx.executeSql(`INSERT INTO CONTATOS (nome, numero) VALUES ('${ item.nome }', '${ item.numero }')`);
                            else tx.executeSql(`UPDATE CONTATOS SET nome = '${item.nome}', numero= '${item.numero}' WHERE id = ${item.id}`);
                            setCadastro(false);
                            setContato(null);
                            atualizar();
                        })
                    }}></TCadastro>: <View></View>
                }
                <TFlatList db={db} data={contatos}
                onEdit={(item) => {setContato(item);setCadastro(true); }}
                onRemove={(id) => {setContatos(contatos.filter(c => c.id!=id));atualizar()}}
                />
            </ScrollView>
            <View style={{ padding: 10, backgroundColor: 'indigo', opacity: 0.8 }}>
                <Text style={{ fontWeight: 'bold', color: '#ffffff', textAlign: 'center', opacity: 0.5}}>Desenvolvido por: luckys.com.br</Text>
            </View>
        </View>
    )

};

const styles = StyleSheet.create({
    
    container: {
        paddingTop: Constants.statusBarHeight,
        flex: 1
    },
    body: {
        flexWrap: "wrap",
        flex: 1,
        // paddingTop: 16
    },
    header: {
        justifyContent: "space-between",
        textAlign: "center",
        backgroundColor: "indigo",
        padding: 10,
        flexDirection: "row",
        
    },
    titulo: {
        paddingEnd: 30,
        margin: 20,
        fontSize: 20,
        textAlign: "center",
        color: "#ffffff"
    },
    plus: {
        textAlign: "right",
        backgroundColor: "indigo",
        borderWidth: 1,
        borderRadius: 9,
        opacity: 0.7,
        fontSize: 20,
        right: 0,
        height: 48,
        margin: 15,
        padding: 8,
        color: "#ffffff"
    }
})
export default App;
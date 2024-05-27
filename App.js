/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Scan from './components/scan.js'
import * as ScopedStorage from "react-native-scoped-storage"
import { ToastAndroid,View,FlatList } from 'react-native'
import {StatusBar} from 'react-native';
import { Button,Card,TextInput,Text,List } from 'react-native-paper'
import Modal from "react-native-modal";
import axios from 'axios';
function App() {
  const Stack = createNativeStackNavigator();
  const txt = React.useRef()
  const tp = React.useRef()
  function ScUI() {
    const [ld,setld] = React.useState({ld:true,cfg:{}})
    const [mod,setmod] = React.useState(false)
    const [lst,setlst] = React.useState([])
    function openFiles() {
      ScopedStorage.openDocumentTree(true).then(function(r) {
        ScopedStorage.readFile(r.uri.concat("%2Fhints.json")).then(function(f) {
          setConfig(JSON.parse(f))
        }).catch(function(e) {
          ToastAndroid.show('hints.json missing!', ToastAndroid.SHORT);
        })
      })
    }
    function setConfig(loc) {
      setld({ld:false,cfg:loc}) 
    }
    React.useEffect(function() {
      StatusBar.setHidden(true);
    },[])
    if (ld.ld) {
      return (
        <>
        <Modal isVisible={mod} onBackdropPress={function() {
          setmod(false)
        }} useNativeDriver={true}>
            <View>
              <Card>
                  <Text />
                  <Text variant="titleLarge" style={{textAlign:"center"}}>Download Hint</Text>
                  <Text />
                  <TextInput label="Enter URL" onChangeText={function(r) {
                    txt.current = r
                  }}/>
                  <Button onPress={function() {
                    axios.get("http://"+txt.current).then(function(res) {
                      tp.current = txt.current
                      setlst(res.data)
                    }).catch(function() {
                      ToastAndroid.show('Failed to load list of hints!', ToastAndroid.SHORT);
                    })
                  }}>Fetch Hints</Button>
                  <Text />
                  <FlatList data={lst} renderItem={function(it) {
                    console.log(it.item.name)
                    return <List.Item title={it.item.name} onPress={function() {
                      axios.get("http://"+tp.current+"/"+it.item.name).then(function(res) {
                        setConfig(res.data)
                      }).catch(function() {
                        ToastAndroid.show('Failed to load hint!', ToastAndroid.SHORT);
                      })
                    }}/>
                  }}/>
              </Card>
            </View>
          </Modal>
          <Text />
          <Text variant="titleLarge" style={{textAlign:"center"}}>Welcome to the Game! Please hand over the phone to the volunteer for next steps</Text>
          <Text />
          <Button mode="contained" onPress={function() {
            setmod(true)
          }}>Download Hint</Button>
          <Text />
          <Button mode="contained" onPress={openFiles}>Use Stored Hint</Button>
          <Text />
        </>
      )
    } else {
      return <Scan cf={ld.cfg} /> 
    }
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Scan" component={ScUI} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;
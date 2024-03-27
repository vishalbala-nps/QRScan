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
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScopedStorage from "react-native-scoped-storage"
import { ToastAndroid,Text } from 'react-native'
function App() {
  const Stack = createNativeStackNavigator();
  function ScUI() {
    const [ld,setld] = React.useState({ld:true,cfg:{}})
    
    React.useEffect(function() {
      function openFiles() {
        ScopedStorage.openDocumentTree(true).then(function(r) {
          console.log(r.uri)
          ScopedStorage.readFile(r.uri.concat("%2Fhints.json")).then(function(f) {
            AsyncStorage.setItem("@config",r.uri.concat("%2Fhints.json")).then(function() {
              setConfig(JSON.parse(f))
            })
          }).catch(function(e) {
            console.log(e)
            ToastAndroid.show('hints.json missing!', ToastAndroid.SHORT);
            openFiles()
          })
        })
      }
      function setConfig(loc) {
        setld({ld:false,cfg:loc}) 
      }
      AsyncStorage.getItem("@config").then(function(res) {
        if (res === null) {
          openFiles()
        } else {
          console.log("Asynckey")
          ScopedStorage.readFile(res).then(function(f) {
            setConfig(JSON.parse(f))
          }).catch(function(e) {
            ToastAndroid.show('hints.json missing!', ToastAndroid.SHORT);
            openFiles()
          })
        }
      })
    },[])
    if (ld.ld) {
      return <Text>Loading please wait</Text>
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
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
import { ToastAndroid,Text,Alert } from 'react-native'
import { IconButton } from 'react-native-paper';
import RNBiometrics from "react-native-simple-biometrics";
import {Linking,StatusBar} from 'react-native';
import RNExitApp from 'react-native-exit-app';

function App() {
  const Stack = createNativeStackNavigator();
  function ScUI() {
    const [ld,setld] = React.useState({ld:true,cfg:{}})
    
    React.useEffect(function() {
      StatusBar.setHidden(true);
      function openFiles() {
        ScopedStorage.openDocumentTree(true).then(function(r) {
          ScopedStorage.readFile(r.uri.concat("%2Fhints.json")).then(function(f) {
            AsyncStorage.setItem("@config",r.uri.concat("%2Fhints.json")).then(function() {
              setConfig(JSON.parse(f))
            })
          }).catch(function(e) {
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
        <Stack.Screen name="Scan" component={ScUI} options={{
          headerRight: function() {
            return (
              <IconButton
                icon="cog"
                size={20}
                onPress={() => RNBiometrics.requestBioAuth("Enter Device Pin", "Enter Device Pin to access settings").then(function() {
                  Alert.alert('Settings', 'Please select a setting',[
                    {
                      "text":"Open AppInfo",
                      onPress:function() {
                        Linking.openSettings()
                      }
                    },
                    {
                      "text":"Close App",
                      onPress: function() {
                        RNExitApp.exitApp();
                      }
                    },
                    {
                      "text":"Clear Hints and close",
                      onPress: function() {
                        AsyncStorage.clear().then(function() {
                          RNExitApp.exitApp();
                        })
                      }
                    }
                  ])
                }).catch(function(e) {
                  ToastAndroid.show('Device either has no lock code or Auth cancel', ToastAndroid.SHORT);
                })}
              />
            )
          }
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;
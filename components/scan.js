/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Camera, CameraType } from 'react-native-camera-kit';
import {StyleSheet,View} from 'react-native'
import Modal from "react-native-modal";
import {Button, Card,List,Text} from 'react-native-paper'

function Scan({ navigation }) {
  const [mod,setmod] = React.useState({visible:false,title:"",description:""})
  return (
    <>
    <Modal isVisible={mod.visible} onBackdropPress={function() {
      setmod({visible:false,title:"",description:""})
    }} useNativeDriver={true}>
        <View>
          <Card>
              <Text />
              <Text variant="titleLarge" style={{textAlign:"center"}}>  {mod.title}</Text>
              <Text />
              <Text variant="bodyLarge" style={{textAlign:"center"}}>  {mod.description}</Text>
              <Text />
          </Card>
        </View>
      </Modal>
      <Text style={{textAlign:"center",fontSize:30}}>Scan a Clue by holding the phone near the QR Code</Text>
      <Camera
        cameraType={CameraType.Back}
        style={{height:"100%"}}
        flashMode='auto'
        scanBarcode={true}
        onReadCode={function(event) {
          if (mod.visible == false) {
            setmod({visible:true,title:"abc",description:event.nativeEvent.codeStringValue})
          }
        }}
      />
    </>
  )
}

export default Scan;
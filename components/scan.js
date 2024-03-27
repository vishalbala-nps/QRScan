/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Camera, CameraType } from 'react-native-camera-kit';
import {View,ToastAndroid} from 'react-native'
import Modal from "react-native-modal";
import {Card,Text} from 'react-native-paper'

function Scan(props) {
  const [mod,setmod] = React.useState({visible:false,title:"",description:"",valid:true})
  return (
    <>
    <Modal isVisible={mod.visible} onBackdropPress={function() {
      setmod({visible:false,title:"",description:"",valid:true})
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
            let k = props.cf.find(function(i) {
              return i["id"] == event.nativeEvent.codeStringValue
            })
            if (k !== undefined) {
              setmod({visible:true,title:k["title"],description:k["description"],valid:true})
            } else {
              setmod({visible:true,title:"Invalid QR Code!",description:"This QR Code is Invalid!",valid:false})
            }
          }
        }}
      />
    </>
  )
}

export default Scan;
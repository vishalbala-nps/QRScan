/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Camera, CameraType } from 'react-native-camera-kit';
import {View,Vibration} from 'react-native'
import Modal from "react-native-modal";
import {Card,Text} from 'react-native-paper'
import Sound from 'react-native-sound';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Icon from 'react-native-vector-icons/MaterialIcons'
function Scan(props) {
  const [mod,setmod] = React.useState({visible:false,title:"",description:"",valid:true})
  const [grant,setgrant] = React.useState(false)
  React.useEffect(function() {
    Sound.setCategory("Playback")
    check(PERMISSIONS.ANDROID.CAMERA).then(function(res) {
      if (res === RESULTS.UNAVAILABLE || res === RESULTS.DENIED || res === RESULTS.BLOCKED) {
        request(PERMISSIONS.ANDROID.CAMERA).then(function(r) {
          if (r === RESULTS.GRANTED) {
            setgrant(true)
          } else {
            setgrant(false)
          }
        })
      } else if (res === RESULTS.GRANTED) {
        setgrant(true)
      }
    })
  },[])
  function HintIcon(props) {
    if (props.ic) {
      return <Icon name="lightbulb" size={40} color="orange" />
    } else {
      return <Icon name="close" size={40} color="red" />
    }
  }
  if (grant) {
    return (
      <>
        <Modal isVisible={mod.visible} onBackdropPress={function() {
          setmod({visible:false,title:"",description:"",valid:true})
        }} useNativeDriver={true}>
            <View>
              <Card>
                  <Text />
                  <View style={{alignItems:"center"}}>
                    <HintIcon ic={mod.valid} />
                  </View>
                  <Text variant="titleLarge" style={{textAlign:"center"}}>{mod.title}</Text>
                  <Text />
                  <Text variant="bodyLarge" style={{textAlign:"center"}}>{mod.description}</Text>
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
                Vibration.vibrate()
                if (k !== undefined) {
                  if (k["valid"]) {
                    let right = new Sound("right.mp3",Sound.MAIN_BUNDLE,function() {
                      right.play()
                    })
                  } else {
                    let wrong = new Sound("wrong.mp3",Sound.MAIN_BUNDLE,function() {
                      wrong.play()
                    })
                  }
                  setmod({visible:true,title:k["title"],description:k["description"],valid:k["valid"]})
                } else {
                  let wrong = new Sound("wrong.mp3",Sound.MAIN_BUNDLE,function() {
                    wrong.play()
                  })
                  setmod({visible:true,title:"Invalid QR Code!",description:"This QR Code is Invalid!",valid:false})
                }
              }
            }}
          />
      </>
    )
  } else {
    return <Text variant="titleLarge" style={{textAlign:"center"}}>Please Grant Camera Permission</Text>
  }
}

export default Scan;
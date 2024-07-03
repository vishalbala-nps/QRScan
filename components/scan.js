/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Camera, CameraType } from 'react-native-camera-kit';
import {View,Vibration,ToastAndroid} from 'react-native'
import Modal from "react-native-modal";
import {Button, Card,Text} from 'react-native-paper'
import Sound from 'react-native-sound';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Icon from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios';
function Scan(props) {
  const [data,setdata] = React.useReducer(function(state,action) {
    let cstate = {...state}
    if (action.type === "grant") {
      cstate.permission = true
      cstate.showcam = false
    } else if (action.type === "deny") {
      cstate.permission = false
    } else if (action.type === "showcam") {
      cstate.showcam = true
    } else if (action.type === "hidecam") {
      cstate.showcam = false
    } else if (action.type === "showdialog") {
      cstate.dialog.visible = true
      cstate.dialog.title = action.title
      cstate.dialog.description = action.description
      cstate.dialog.valid = action.valid
    } else if (action.type === "hidedialog") {
      cstate.dialog.visible = false
      cstate.dialog.title = ""
      cstate.dialog.description = ""
      cstate.dialog.valid = true
      cstate.showcam = false
    }
    return cstate
  },{permission:false,showcam:false,dialog:{visible:false,title:"",description:"",valid:true}})
  const scanned = React.useRef([])
  React.useEffect(function() {
    Sound.setCategory("Playback")
    check(PERMISSIONS.ANDROID.CAMERA).then(function(res) {
      if (res === RESULTS.UNAVAILABLE || res === RESULTS.DENIED || res === RESULTS.BLOCKED) {
        request(PERMISSIONS.ANDROID.CAMERA).then(function(r) {
          if (r === RESULTS.GRANTED) {
            setdata({type:"grant"})
          } else {
            setdata({type:"deny"})
          }
        })
      } else if (res === RESULTS.GRANTED) {
        setdata({type:"grant"})
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
  if (data.permission && data.showcam) {
    return (
      <>
        <Modal isVisible={data.dialog.visible} onBackdropPress={function() {
          setdata({type:"hidedialog"})
        }} useNativeDriver={true}>
            <View>
              <Card>
                  <Text />
                  <View style={{alignItems:"center"}}>
                    <HintIcon ic={data.dialog.valid} />
                  </View>
                  <Text variant="titleLarge" style={{textAlign:"center"}}>{data.dialog.title}</Text>
                  <Text />
                  <Text variant="bodyLarge" style={{textAlign:"center"}}>{data.dialog.description}</Text>
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
              if (data.dialog.visible == false) {
                let k = props.cf.find(function(i) {
                  return i["id"] == event.nativeEvent.codeStringValue
                })
                if (k !== undefined) {
                  if (scanned.current.includes(k.id) !== true) {
                    console.log("call api")
                    axios.post("http://"+props.url+"/inventory/addhint",{},{params:{room:props.room,title:k["title"],hint:k["description"]}}).then(function() {
                      Vibration.vibrate()
                      ToastAndroid.show('Added to inventory!', ToastAndroid.SHORT);
                      scanned.current.push(k.id)
                    }).catch(function(e) {
                      if (e.response.status === 404) {
                        alert("The game is yet to start! Please start the game and scan again")
                      } else {
                        alert("Failed to add to inventory! Please try scanning again")
                        console.log(e)
                        console.log(e.response.status)
                      }
                    })
                  }
                  if (k["valid"]) {
                    let right = new Sound("right.mp3",Sound.MAIN_BUNDLE,function() {
                      right.play()
                    })
                  } else {
                    let wrong = new Sound("wrong.mp3",Sound.MAIN_BUNDLE,function() {
                      wrong.play()
                    })
                  }
                  setdata({type:"showdialog",title:k["title"],description:k["description"],valid:k["valid"]})
                }
              }
            }}
          />
      </>
    )
  } else if (data.permission && data.showcam === false) {
    return <Button onPress={function() {
      setdata({type:"showcam"})
    }}>Show Scanner</Button>
  } else {
    return <Text variant="titleLarge" style={{textAlign:"center"}}>Please Grant Camera Permission</Text>
  }
}

export default Scan;
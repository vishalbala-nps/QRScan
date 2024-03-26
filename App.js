/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Camera, CameraType } from 'react-native-camera-kit';
import {StyleSheet,Alert} from 'react-native'
function App() {
  return (
    <Camera
      cameraType={CameraType.Back} // front/back(default)
      style={StyleSheet.absoluteFill}
      flashMode='auto'
      scanBarcode={true}
      onReadCode={(event) => console.log(event.nativeEvent.codeStringValue)}
    />
  )
}

export default App;
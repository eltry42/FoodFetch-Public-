import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, SafeAreaView, ScrollView, Platform, Dimensions, PlatformColor, TouchableOpacity} from 'react-native';
import React, { useState } from "react";
import * as Font from 'expo-font'; 
import { store } from './src/app/store';
const {height,width} = Dimensions.get('window') //or can get individually const width = Dimensions.get('screen').width
import {Canvas, Patch, vec} from "@shopify/react-native-skia";
import RootNavigator from './src/navigation/RootNavigator';
import { Provider } from 'react-redux';
import StateProvider from './src/states/StateProvider';


//web 306825712414-uof4bnv49pq6jfstjrb04s9sq7m0875o.apps.googleusercontent.com
//ios 306825712414-ej9qnc1vo92ref1ho3povivo7s0di9kh.apps.googleusercontent.com
//andriod 306825712414-ge3vc0bni8jdme5e2e5jlbaofokf4hgt.apps.googleusercontent.com

export default function App() {
  return (
    <Provider store={store}>
      <StateProvider>
        <RootNavigator />
      </StateProvider>
    </Provider>
  );
}
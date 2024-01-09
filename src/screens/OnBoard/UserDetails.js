import React from 'react';
import { ScrollView, View, Text, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { UserDetailsBtn } from '../../components/Btn/UserDetailsBtn.js';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors.js';
import UserDetailsInput from '../../components/Inputs/UserDetails.js';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { signIn } from '../../features/authentication/auth.js';

export default function UserDetails() {
  const navigation = useNavigation();
  const [token, setToken] = useState('');
  const dispatch = useDispatch();

  async function save(value) {
    try {
      await AsyncStorage.setItem("@token", value);
      dispatch(signIn(value));
      console.log("data saved");
    } catch (e) {
      console.log(e);
    }
  }

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Welcome to FoodFetch!</Text>
        </View>
        <UserDetailsInput label={'Username'} value={token} onChangeText={setToken} autoCapitalize="none" />
        <UserDetailsInput label={'Password'} secureTextEntry autoCapitalize="none" />
        <UserDetailsBtn title={"Continue"} navigation={navigation} onPress={() => save(token)} />
      </View>
    </TouchableWithoutFeedback>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textContainer: {
    flex: 0.23,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

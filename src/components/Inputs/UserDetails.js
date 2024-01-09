import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';

export default function UserDetailsInput({
  label,
  value,
  onChangeText,
  secureTextEntry,
}) {
  const textInputRef = React.useRef(null);

  const handleLabelPress = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  return (
    <TouchableOpacity onPress={handleLabelPress}>
      <View style={styles.container}>
        <TextInput
          ref={textInputRef}
          placeholder={label}
          style={styles.text}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
    height: 45,
    paddingLeft: 10,
    borderRadius: 30,
    margin: 10,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    flexDirection: 'row', // Use flexDirection to align label and input horizontally
    alignItems: 'center', // Vertically center the label and input
  },
  text: {
    flex: 2,
    fontSize: 15,
    marginLeft: 10
  },
});

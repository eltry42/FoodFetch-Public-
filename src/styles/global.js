import {StyleSheet} from 'react-native'
import {Colors} from '../constants/colors.js'

export const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: Colors.white,
      alignItems : 'center',
      justifyContent: 'center',

    },
    text:{
      fontSize: 40,
      fontWeight: 'bold',
      textAlign: 'center'
    }
  })
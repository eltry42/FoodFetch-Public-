
import { View, Text, StyleSheet } from 'react-native'
import { Wave, Wander, Pulse, Flow } from 'react-native-animated-spinkit'

//https://github.com/phamfoo/react-native-animated-spinkit

export default function CustomLoading() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>FoodFetch</Text>
      <Wave size={48} color="black" style={{width:100}}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    alignItems : 'center',
    justifyContent: 'center',
    zIndex: 10000000
  },
  text:{
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center'
  }
})


import {View, Text, Button} from 'react-native'
import {styles} from '../styles/global.js'
import { signOut } from '../features/authentication/auth.js'
import { useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Profile () {
    const dispatch = useDispatch()

    return (
        <View style={styles.container}>
          <Text style={styles.text}>
            Profile
          </Text>
          <Button 
            title="Sign Out" 
            onPress={async ()=>{
              await AsyncStorage.removeItem('@token')
              dispatch(signOut())
            }
          }/>
        </View>
      )
}

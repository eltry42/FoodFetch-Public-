import {View, Text} from 'react-native'
import {Btn} from '../../components/Btn/AppleBtn.js'
import {styles} from '../../styles/global.js'
import { useNavigation } from '@react-navigation/native';

export default function SignUp () {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
          <Text style={styles.text}>
            FoodFetch
          </Text>
          <Btn title={"Continue with Apple"} navigation={navigation} />
          <Btn title={"Continue with Google"} navigation={navigation} />
        </View>
      )
}


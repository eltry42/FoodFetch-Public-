import {Animated, Text, TouchableHighlight, StyleSheet, PlatformColor} from 'react-native';
import * as Haptics from 'expo-haptics';
import {Colors} from '../../constants/colors.js'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@gorhom/bottom-sheet';

export const Btn = ({title, onPress}) => {
    
    const animatedvalue = new Animated.Value(1);

    function PressIn(){
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        Animated.spring(animatedvalue, {
            toValue: 0.95,
            useNativeDriver: true,
            speed: 800
        }).start()
    }

    function PressOut(){
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        Animated.spring(animatedvalue, {
            toValue: 1,
            useNativeDriver: true,
            speed: 800
        }).start()
    }

    const animatedStyle={
        transform : [{scale: animatedvalue}]
    }
    
    return (
        <Animated.View style={[styles.container, animatedStyle]}>
        <TouchableHighlight 
        style={styles.btn}  
        onPressIn={PressIn}
        onPressOut={PressOut}
        onPress={onPress}
        underlayColor='lightgray'>
            <Text style={styles.text}>
            {title}
            </Text>
        </TouchableHighlight>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn:{
        backgroundColor: Colors.black,
        position: 'absolute',
        padding: 10,
        borderRadius: 30,
        margin: 10,
        width: 0.9 * SCREEN_WIDTH,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 0.013 * SCREEN_HEIGHT
    },
    text:{
        color: Colors.white,
        fontSize: 15,
        fontWeight : 'bold',
        textAlign : 'center',
    }
})
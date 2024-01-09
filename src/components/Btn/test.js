// import * as React from 'react';
// import { View, Text, StyleSheet, Animated, TouchableHighlight } from 'react-native';
// import { auth } from "../../FirebaseConfigs"; // Make sure this is the correct import
// import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
// import * as Haptics from 'expo-haptics';
// import { Colors } from '../../constants/colors.js';
// import * as WebBrowser from 'expo-web-browser';

// WebBrowser.maybeCompleteAuthSession();

// GoogleSignin.configure({
//   webClientId: '306825712414-uof4bnv49pq6jfstjrb04s9sq7m0875o.apps.googleusercontent.com', // Replace with your actual web client ID
// });

// const Test = ({ title, navigation }) => {
//   const animatedvalue = new Animated.Value(1);

//   function PressIn() {
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//     Animated.spring(animatedvalue, {
//       toValue: 0.95,
//       useNativeDriver: true,
//       speed: 800,
//     }).start();
//   }

//   function PressOut() {
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//     Animated.spring(animatedvalue, {
//       toValue: 1,
//       useNativeDriver: true,
//       speed: 800,
//     }).start();
//   }

//   const animatedStyle = {
//     transform: [{ scale: animatedvalue }],
//   };

//   const googleLogin = async () => {
//     try {
//       await GoogleSignin.hasPlayServices();
//       const userInfo = await GoogleSignin.signIn();
//       const googleCredential = GoogleAuthProvider.credential(userInfo.idToken, userInfo.accessToken);
//       await signInWithCredential(auth, googleCredential);
//       console.log("Google Sign-In success");
//       // Redirect to your desired screen after successful login.
//       navigation.navigate('Where you want to go');
//     } catch (error) {
//       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//         console.log("Google Sign-In canceled");
//       } else if (error.code === statusCodes.IN_PROGRESS) {
//         console.log("Google Sign-In in progress");
//       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//         console.log("Google Play Services not available");
//       } else {
//         console.error("Google Sign-In error:", error);
//       }
//     }
//   };

//   return (
//     <Animated.View style={[styles.container, animatedStyle]}>
//       <TouchableHighlight
//         style={styles.btn}
//         onPressIn={PressIn}
//         onPressOut={PressOut}
//         onPress={googleLogin}
//         underlayColor="lightgray"
//       >
//         <Text style={styles.text}>{title}</Text>
//       </TouchableHighlight>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: '80%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   btn: {
//     backgroundColor: Colors.black,
//     padding: 10,
//     borderRadius: 30,
//     margin: 10,
//     width: '100%',
//     height: 50,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   text: {
//     color: Colors.white,
//     fontSize: 15,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });

// export default Test;

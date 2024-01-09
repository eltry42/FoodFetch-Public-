import { createStackNavigator} from "@react-navigation/stack";
import SignUp from "../screens/OnBoard/SignUp";
import TabNavigator from "./TabNavigator";
import UserDetails from "../screens/OnBoard/UserDetails"

const HomeStack = createStackNavigator()

export default function Stack (){
    return(
        <HomeStack.Navigator
            screenOptions={{
                headerShown: false,
                presentation: 'card',
            }}
        >
            {/* <HomeStack.Screen name='SignUp' component={SignUp}/> */}
            <HomeStack.Screen name='UserDetails' component={UserDetails}/>
            <HomeStack.Screen 
            name='Tabs' 
            component={TabNavigator} 
            options={{headerShown: true, gestureEnabled: false}}
            />
        </HomeStack.Navigator>
    )
}
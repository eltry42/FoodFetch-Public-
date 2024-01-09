import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Main from '../screens/MainScreen/Main.js'
import Profile from '../screens/Profile';
import Match from '../screens/Match';
import { Ionicons } from '@expo/vector-icons'; import { FontAwesome } from '@expo/vector-icons'; import { MaterialIcons } from '@expo/vector-icons'; import { Foundation } from '@expo/vector-icons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
const Tab = createBottomTabNavigator();

export default function TabNavigator (){
    return(
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.white, 
                tabBarLabel: () =>null,
                tabBarStyle :{
                    backgroundColor: 'black', 
                    borderTopWidth: 0,  //remove the top line 
                }
            }}
            initialRouteName='Main'
        >
            <Tab.Screen 
                name='Match' 
                component={Match} //if for example u want to show a stack inside this page, u can change the component to the stack name 
                options={{headerShown: false, gestureEnabled: true, tabBarIcon:({color})=><Foundation name="heart" size={28} color={color} />}}
            />
            <Tab.Screen 
                name="Main" 
                component={Main} //change to FilDrawer if need to show drawer
                options={{
                    tabBarIcon:({color}) => <MaterialIcons name="fastfood" size={24} color={color} />
                }}
            />
            <Tab.Screen 
                name="Profile" 
                component={Profile}
                options ={{
                    tabBarIcon: ({color})=> <FontAwesome name="user" size={24} color={color} />
                }}
            />
        </Tab.Navigator>
    )
}
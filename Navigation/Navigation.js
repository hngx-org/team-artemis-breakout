import { NavigationContainer } from '@react-navigation/native'
import { React } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import Home2 from '../screens/HomeScreen';
import GameOver from '../screens/GameOver';
import LeaderBoard from '../screens/LeaderBoard';
import BestGameEver from '../screens/Game';
import Login from '../screens/Login';


const Stack = createStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home"
                    component={Home}
                    options={{
                        headerShown: false,
                        gestureEnabled: false,
                        // headerBackTitle: false,
                        headerBackTitleVisible: true,
                        // headerTitle: true,
                        headerTransparent: true,
                        headerTintColor: "black",
                    }} />
                <Stack.Screen name="GameOver"
                    component={GameOver}
                    options={{
                        headerShown: false,
                        gestureEnabled: false,
                        // headerBackTitle: false,
                        headerBackTitleVisible: true,
                        // headerTitle: true,
                        headerTransparent: true,
                        headerTintColor: "black",
                    }} />
                <Stack.Screen name="Game"
                    component={Home2}
                    options={{
                        headerShown: false,
                        gestureEnabled: false,
                        // headerBackTitle: false,
                        headerBackTitleVisible: true,
                        // headerTitle: true,
                        headerTransparent: true,
                        headerTintColor: "black",
                    }} />
                    <Stack.Screen name="Login"
                    component={Login}
                    options={{
                        headerShown: false,
                        gestureEnabled: true,
                        // headerBackTitle: false,
                        headerBackTitleVisible: true,
                        // headerTitle: true,
                        headerTransparent: true,
                        headerTintColor: "black",
                    }} />
                <Stack.Screen name="LeaderBoard"
                    component={LeaderBoard}
                    options={{
                        headerShown: true,
                        gestureEnabled: true,
                        // headerBackTitle: true,
                        headerBackTitleVisible: true,
                        // headerTitle: true,
                        headerTransparent: true,
                        headerTintColor: "white",
                        title:''
                    }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation
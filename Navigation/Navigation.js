import { NavigationContainer } from '@react-navigation/native'
import { React } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import GameOver from '../screens/GameOver';
import LeaderBoard from '../screens/LeaderBoard';
import BestGameEver from '../screens/Game';


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
                 component={BestGameEver}
                options={{
                    headerShown: false,
                    gestureEnabled: false,
                    // headerBackTitle: false,
                    headerBackTitleVisible: true,
                    // headerTitle: true,
                    headerTransparent: true,
                    headerTintColor: "black",
                  }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation
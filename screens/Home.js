import {React} from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

const Home = ({navigation}) =>{
    
    return(
        <View style={{flex: 1, justifyContent:'center', alignItems:'center', backgroundColor:'black'}}>
            <Text style={{color:'white', fontSize: 35}}>Welcome to</Text>
            <Text style={{color:'white', fontWeight:'bold', fontSize: 55}}>BREAKOUT</Text>
            <TouchableOpacity onPress={()=> navigation.navigate('Game')} style={{borderWidth: 1, borderColor:'white', borderRadius: 5, marginTop: 20, paddingVertical: 5, paddingHorizontal: 10}}>
                <Text style={{color:'white', fontSize: 25}}>Start game</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate('LeaderBoard')} style={{borderWidth: 1, borderColor:'white', borderRadius: 5, marginTop: 20, paddingVertical: 5, paddingHorizontal: 10}}>
                <Text style={{color:'white', fontSize: 25}}>Leader Board</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Home
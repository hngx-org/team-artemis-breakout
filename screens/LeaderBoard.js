import {React} from 'react'
import { Text, View } from 'react-native'

const LeaderBoard = () =>{
    return(
        <View style={{flex: 1, justifyContent:'center', alignItems:'center', backgroundColor:'black'}}>
            <Text style={{color:'white', fontSize: 45, fontWeight:'bold'}}>Leader Board</Text>
            <Text style={{marginTop: 60, color:'white', fontSize: 30}}>TEAM ARTEMIS</Text>
            <Text style={{color:'white', fontSize: 40, fontWeight:'bold'}}>3574</Text>
        </View>
    )
}

export default LeaderBoard
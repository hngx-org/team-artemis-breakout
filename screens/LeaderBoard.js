import { React } from 'react'
import { Text, View, FlatList, StyleSheet, SafeAreaView } from 'react-native'
// import data from '../data/BoardData'
import BoardItems from '../components1/BoardItems'
import { useState } from 'react';
import { useEffect } from 'react';
import { supabase } from '../utils/supabase';

const LeaderBoard = () => {
    
    const [info, setInfo] = useState([])
    const sortedData = info?.slice().sort((a, b) => b.score - a.score);

    for (let i = 0; i < sortedData?.length; i++) {
        sortedData[i].rank = i + 1;
    }

    useEffect(()=>{
        const getUsers = async() =>{
            const {data} = await supabase.from('users').select('*')
            console.log(data)
            setInfo(data)
        }
        getUsers()
    },[])

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Leader Board</Text>
            <FlatList
                data={sortedData}
                renderItem={({ item }) => <BoardItems player={item} />}
            />
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'black',
    },
    title: {
        color: 'white',
        fontSize: 28,
        fontWeight: '400',
        marginVertical: 20
    }
})

export default LeaderBoard
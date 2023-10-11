import { React } from 'react'
import { Text, View, FlatList, StyleSheet, SafeAreaView } from 'react-native'
import data from '../data/BoardData'
import BoardItems from '../components/BoardItems'

const LeaderBoard = () => {
    const sortedData = data.slice().sort((a, b) => b.score - a.score);

    for (let i = 0; i < sortedData.length; i++) {
        sortedData[i].rank = i + 1;
    }

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
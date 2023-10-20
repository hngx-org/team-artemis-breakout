import { View, Text, StyleSheet, Dimensions } from 'react-native'


const BoardItems = (props) => {
    const { name, score, rank } = props.player
    return (
        <View style={{width: Dimensions.get('window').width, paddingVertical: 10, paddingHorizontal: 20 }}>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.circle} />
                    <View>
                        <Text style={styles.player}>{name}</Text>
                        <Text style={styles.marks}>{`${score} marks`}</Text>
                    </View>
                </View>
                <Text style={styles.position}>{rank}</Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        height: 71,
        backgroundColor: "white",
        borderRadius: 4,
        paddingHorizontal: 20,
    },
    circle: {
        width: 44,
        height: 44,
        borderRadius: 100,
        backgroundColor: "#333333",
        marginRight: 15
    },
    player: {
        color: "#0D0D0E",
        fontSize: 16,
        fontWeight: '500'
    },
    marks: {
        fontSize: 14,
        fontWeight: '400',
        color: '#333333'
    },
    position: {
        fontSize: 24,
        color: '#0D0D0E',
        fontWeight: "400"
    }
})

export default BoardItems;
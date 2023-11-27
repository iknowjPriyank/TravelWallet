import { View, Text, Image, Dimensions, Modal, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const Navigation = useNavigation()

    useEffect(() => {

        setModalVisible(true);

        const timeout = setTimeout(() => {
            setModalVisible(false);
        }, 5000);

        return () => clearTimeout(timeout);
    }, []);

    useEffect(()=>{
        setTimeout(() => {
            Navigation.replace('Home')
        }, 3000)
    }, [])
    const { width, height } = Dimensions.get('window')
    return (
        <View style={styles.container}>
            <View className="bg-neutral-100 flex-1">
                <Image source={require('../assets/images/welcome-24.png')}
                    style={{ width: width, height: height * 0.7, alignSelf: 'center' }}
                />
            </View>
            <Modal animationType="fade" transparent visible={modalVisible}>
                    <View className="items-center" style={{marginTop : height *0.65}}>
                        <Text className="text-5xl text-neutral-600 font-bold">Travel Expense</Text>
                    </View>
            </Modal>
        </View>


    )
}

export default WelcomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //   backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        padding: 20,
        borderRadius: 10,
    },
});
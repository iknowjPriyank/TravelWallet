import { View, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useState } from 'react'
import BackButton from '../components/backButton'
import { useNavigation } from '@react-navigation/native'
import { colors, categoryBG } from '../theme'
import Snackbar from 'react-native-snackbar';
import Loading from '../components/loading'
import { SafeAreaView } from 'react-native-safe-area-context'
import { categories } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddTripScreen({ route }) {

    const { id, place, country } = route.params;

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    // Fetching Current Data when saving the data
    const getCurrentDate = () => {
        const currentDate = new Date();
        return currentDate.toDateString();
      };
 
      // current time
      const getCurrentTime = () => {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return currentTime;
      };

    const handleAddExpense = async () => {
        try {
            if (title && amount && category) {
                setLoading(true);

                // Retrieve existing trips from AsyncStorage
                const existingTrips = await AsyncStorage.getItem('trips');
                const parsedTrips = existingTrips ? JSON.parse(existingTrips) : [];

                // Find the trip with the matching id
                const updatedTrips = parsedTrips.map((trip) => {
                    if (trip.id === id) {
                        // Ensure Expenses is defined and is an array
                        const updatedExpenses = Array.isArray(trip.Expenses)
                            ? [
                                ...trip.Expenses,
                                {
                                    id: new Date().getTime(),
                                    title,
                                    amount: parseFloat(amount),
                                    category,
                                    date : getCurrentDate(),    
                                    time : getCurrentTime(),                           },
                            ]
                            : [
                                {
                                    id: new Date().getTime(),
                                    title,
                                    amount: parseFloat(amount),
                                    category,
                                    date: getCurrentDate(),
                                    time : getCurrentTime(),    
                                },
                            ];

                        return { ...trip, Expenses: updatedExpenses };
                    }
                    return trip;
                });

                // Save the updated trips back to AsyncStorage
                await AsyncStorage.setItem('trips', JSON.stringify(updatedTrips));

                setLoading(false);


                navigation.goBack();
            } else {
                Snackbar.show({
                    text: 'Please fill all the fields!',
                    backgroundColor: 'red',
                });
            }
        } catch (error) {
            console.error('Error adding expense:', error);
            setLoading(false);

        }
    };



    return (
        <SafeAreaView>
            <KeyboardAvoidingView>
                <ScrollView>

                    <View className="flex justify-between h-full mx-4">
                        <View>
                            <View className="relative mt-5">
                                <View className="absolute top-0 left-0 z-10">
                                    <BackButton />
                                </View>

                                <Text className={`${colors.heading} text-2xl font-bold text-center`}>Add Expense</Text>
                            </View>
                            <View className="flex-row items-center justify-center">
                                <Text className={`${colors.heading} text-lg font-semibold text-center`}>{place}, {country}</Text>
                            </View>

                            <View className="flex-row justify-center my-3 mt-5">
                                <Image className="h-60 w-60" source={require('../assets/images/expenseBanner.png')} />
                            </View>
                            <View className="space-y-2 mx-2">
                                <Text className={`${colors.heading} text-lg font-bold`}>Reason ?</Text>
                                <TextInput value={title} onChangeText={value => setTitle(value)} className="p-4 bg-white rounded-full mb-3 text-xl" />
                                <Text className={`${colors.heading} text-lg font-bold`}>How Much did you spend?</Text>
                                <TextInput value={amount} onChangeText={value => setAmount(value)}  keyboardType="numeric" className="p-4 bg-white rounded-full mb-3" />
                            </View>
                            <View className="mx-2 space-x-2">
                                <Text className="text-lg font-bold">Category</Text>
                                <View className="flex-row flex-wrap items-center">
                                    {
                                        categories.map(cat => {
                                            let bgColor = 'bg-white';
                                            if (cat.value == category) bgColor = 'bg-green-200'
                                            return (
                                                <TouchableOpacity onPress={() => setCategory(cat.value)} key={cat.value}
                                                    className={`rounded-full ${bgColor} px-4 p-3 mb-2 mr-2`}>
                                                    <Text>{cat.title}</Text>
                                                </TouchableOpacity>
                                            )
                                        })

                                    }
                                </View>
                            </View>
                        </View>


                        <View>
                            {
                                loading ? (
                                    <Loading />
                                ) : (
                                    <TouchableOpacity onPress={handleAddExpense} style={{ backgroundColor: colors.button }} className="my-6 rounded-full p-3 shadow-sm mx-2">
                                        <Text className="text-center text-white text-lg font-bold">Add Expense</Text>
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    </View>

                </ScrollView>

            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
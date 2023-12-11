import { View, Text, TouchableOpacity, Image, TouchableWithoutFeedback, Dimensions, } from 'react-native'
import React, { useEffect, useState } from 'react'
import {categoryBG } from '../theme'
import EmptyList from '../components/emptyList';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import BackButton from '../components/backButton';
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CalendarIcon, ClockIcon, TrashIcon } from 'react-native-heroicons/outline';
import { FlashList } from '@shopify/flash-list';



export default function TripExpensesScreen({ route }) {
  const { id, place, country } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [expenses, setExpenses] = useState([]);

  // Total Amount
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        // Retrieve the trips data from AsyncStorage
        const tripsData = await AsyncStorage.getItem('trips');
        const parsedTrips = tripsData ? JSON.parse(tripsData) : [];

        // Find the trip with the matching id
        const currentTrip = parsedTrips.find((trip) => trip.id === id);

        // Set the expenses for the current trip in state
        setExpenses(currentTrip?.Expenses || []);

        // Calculating the total amount and update the state
        const calculatedTotalAmount = (currentTrip?.Expenses || []).reduce((sum, expense) => sum + expense.amount, 0);
        setTotalAmount(calculatedTotalAmount);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, [isFocused, id]);

  const handleDelete = async (expenseId) => {
    try {
      // Retrieving the trips data from AsyncStorage
      const tripsData = await AsyncStorage.getItem('trips');
      const parsedTrips = tripsData ? JSON.parse(tripsData) : [];

      // Finding the trip with the matching id
      const currentTrip = parsedTrips.find((trip) => trip.id === id);

      // Filtering out the expense with the specified id
      const updatedExpenses = currentTrip?.Expenses.filter((expense) => expense.id !== expenseId) || [];

      // Update the expenses for the current trip
      currentTrip.Expenses = updatedExpenses;

      // Updating the total amount after deleting the expense
      const calculatedTotalAmount = updatedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      setTotalAmount(calculatedTotalAmount);

      // Updating the trips data in AsyncStorage
      await AsyncStorage.setItem('trips', JSON.stringify(parsedTrips));

      // Updating the state to re-render the component
      setExpenses(updatedExpenses);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };


  return (
    <SafeAreaView className="flex-1">
      <View className="px-4">
        <View className="relative mt-5">
          <View className="absolute top-2 left-0 z-10">
            <BackButton />
          </View>
          <View>
            <Text className={`text-neutral-600 text-xl font-bold text-center`}>{place}</Text>
            <Text className={`text-neutral-600 text-xs text-center`}>{country}</Text>
          </View>

        </View>
        <View className="flex-row justify-center items-center rounded-xl mb-4">
          <Image source={require('../assets/images/7.png')} className="w-60 h-60" />
        </View>
        <View className=" space-y-3">
          <View className="flex-row justify-between items-center">
            <Text className={` text-neutral-600 font-bold text-xl`}>Expenses</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Expense', { id, place, country })}
              className="p-2 px-3 bg-white border border-gray-200 rounded-full">
              <Text className={` text-neutral-600 text-lg font-semibold`}>Add Expense</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 420 }}>
            <FlashList
              data={expenses}
              estimatedItemSize={2000}
              ListEmptyComponent={<EmptyList message={"You haven't recorded any expenses yet"} />}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              className="mx-1"
              renderItem={({ item }) => {

                return (
                  <TouchableOpacity
                    style={{ backgroundColor: categoryBG[item.category], }}
                    className="flex-row justify-between items-center p-3 px-5 mb-3 rounded-2xl"
                  >

                    <View>
                      <View className="flex-row">
                        <View className="flex-row items-center">
                          <CalendarIcon size={20} color="black" strokeWidth={2} />
                          <Text className="text-base font-semibold text-neutral-600 ml-1">{item.date}</Text>
                        </View>
                        <View className="flex-row items-center ml-3">
                          <ClockIcon size={20} color="black" strokeWidth={2} />
                          <Text className="text-base font-semibold text-neutral-600 ml-1">{item.time}</Text>
                        </View>
                      </View>
                      <View>

                        <Text className={`text-black text-lg font-bold`}>{item.title}</Text>

                        <Text className="text-lg font-semibold text-gray-600">Amount: {item.amount}</Text>
                        
                        <Text className={`text-yellow-700 text-base font-semibold`}>Category: {item.category}</Text>
                      </View>
                    </View>
                    <View>
                      <TouchableWithoutFeedback onPress={() => handleDelete(item.id)}>
                        <View className="items-center bg-slate-400 flex h-10 w-10 rounded-full justify-center absolute z-50" style={{ top: 0, right: 0 }}>
                          <TrashIcon size={25} color="white" strokeWidth={2} />
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableOpacity>


                )
              }}
            />
            {
              totalAmount != 0 ? (
                <View className="bg-blue-500 h-14 items-start justify-center mb-4 mt-2 rounded-xl" >
                  <Text className="text-xl font-bold text-neutral-200 pl-3">Total Amount: {totalAmount} </Text>
                </View>
              ) : (<View className="mt-2 mb-2" />)
            }

          </View>
        </View>
      </View>

    </SafeAreaView>
  )
}
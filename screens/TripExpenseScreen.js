import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, categoryBG } from '../theme'
import EmptyList from '../components/emptyList';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import BackButton from '../components/backButton';
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function TripExpensesScreen({route}) {
    const { id, place, country } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [expenses, setExpenses] = useState([]);

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
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, [isFocused, id]);


  return (
    <SafeAreaView className="flex-1">
      <View className="px-4">
        <View className="relative mt-5">
          <View className="absolute top-2 left-0 z-10">
            <BackButton />
          </View>
          <View>
            <Text className={`${colors.heading} text-xl font-bold text-center`}>{place}</Text>
            <Text className={`${colors.heading} text-xs text-center`}>{country}</Text>
          </View>

        </View>
        <View className="flex-row justify-center items-center rounded-xl mb-4">
          <Image source={require('../assets/images/7.png')} className="w-60 h-60" />
        </View>
        <View className=" space-y-3">
          <View className="flex-row justify-between items-center">
            <Text className={`${colors.heading} font-bold text-xl`}>Expenses</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Expense',  {id, place, country})}
              className="p-2 px-3 bg-white border border-gray-200 rounded-full">
              <Text className={colors.heading}>Add Expense</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 430 }}>
            <FlatList
              data={expenses}
              ListEmptyComponent={<EmptyList message={"You haven't recorded any expenses yet"} />}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              className="mx-1"
              renderItem={({ item }) => {
                return (
                  <View style={{ backgroundColor: categoryBG[item.category] }} className="flex-row justify-between items-center p-3 px-5 mb-3 rounded-2xl">
                    <View>
                      <Text className={`${colors.heading} font-bold`}>{item.title}</Text>
                      <Text className={`${colors.heading} text-xs`}>{item.category}</Text>
                    </View>
                    <View>
                      <Text>Rs.{item.amount}</Text>
                    </View>
                  </View>
                )
              }}
            />
          </View>
        </View>
      </View>

    </SafeAreaView>
  )
}
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { colors } from '../theme';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import randomImage from '../assets/images/randomImage';
import EmptyList from '../components/emptyList';

const HomeScreen = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [trips, setTrips] = useState([]);

  const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error getting data:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const storedTrips = await getData('trips');
        setTrips(storedTrips);
      } catch (error) {
        console.error('Error loading trips:', error);
      }
    };

    loadTrips();
  }, [isFocused]);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row justify-center items-center p-4">
        <Text className={`${colors.heading} font-bold text-3xl shadow-sm`} style={{ alignSelf: 'center' }}>
          Travel Diary
        </Text>
      </View>
      <View className="flex-row justify-center items-center bg-blue-200 rounded-xl mx-4 mb-4">
        <Image source={require('../assets/images/banner.png')} className="w-60 h-60" />
      </View>
      <View className="px-4 space-y-3">
        <View className="flex-row justify-between items-center">
          <Text className={`${colors.heading} font-bold text-xl`}>Recent Trips</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddTrip')}
            className="p-2 px-3 bg-white border border-gray-200 rounded-full"
          >
            <Text className={`${colors.heading} font-semibold text-lg`}>Add Trip</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 430 }}>
          <FlatList
            data={trips}
            numColumns={2}
            ListEmptyComponent={<EmptyList message={"You haven't recorded any trips yet"} />}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{
              justifyContent: 'space-evenly',
            }}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity 
                key={index}
                className="bg-white p-3 rounded-2xl mb-3 shadow-sm"
                onPress={() => navigation.navigate('Trip', {id : item.id, place : item.place, country : item.country})}
                >
                  <View>
                    <Image source={randomImage()} className="w-36 h-36 mb-2" />
                    <Text className={`${colors.heading} font-bold`}>{item.place}</Text>
                    <Text className={`${colors.heading} text-xs`}>{item.country}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

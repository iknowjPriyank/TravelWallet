import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import randomImage from '../assets/images/randomImage';
import EmptyList from '../components/emptyList';
import { XMarkIcon } from 'react-native-heroicons/outline';
import Snackbar from 'react-native-snackbar';
import { FlashList } from '@shopify/flash-list';


const {width, height} = Dimensions.get('window')

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

  const handleDelete = async (id) => {
    try {
      // Remove the trip with the specified id
      const updatedTrips = trips.filter((trip) => trip.id !== id);
  
      // Show Snackbar confirmation message
      Snackbar.show({
        text: 'Are you sure you want to delete this item?',
        duration: Snackbar.LENGTH_LONG,
        position: Snackbar.POSITION_MIDDLE,
        action: {
          text: 'DELETE',
          textColor: 'red',
          onPress: async () => {
            try {
              // Perform the actual deletion based on updatedTrips
              await AsyncStorage.setItem('trips', JSON.stringify(updatedTrips));
  
              setTrips(updatedTrips);
  
              // Show success message
              Snackbar.show({
                text: 'Item deleted successfully!',
                duration: Snackbar.LENGTH_SHORT,
                textColor: 'yellow',
              });
            } catch (error) {
              console.error('Error updating trips:', error);
            }
          },
        },
      });
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };
  


  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row justify-center items-center p-4">
        <Text className={`text-neutral-600 font-bold text-3xl shadow-sm`} style={{ alignSelf: 'center' }}>
          Travel Expense
        </Text>
      </View>
      <View className="flex-row justify-center items-center bg-blue-200 rounded-xl mx-4 mb-4">
        <Image source={require('../assets/images/banner.png')} className="w-60 h-60" />
      </View>
      <View className="px-4 space-y-3">
        <View className="flex-row justify-between items-center">
          <Text className={`text-neutral-600 font-bold text-xl`}>Recent Trips</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddTrip')}
            className="p-2 px-3 bg-white border border-gray-200 rounded-full"
          >
            <Text className={`text-neutral-600 font-semibold text-lg`}>Add Trip</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 430, }}>
          <FlashList
            data={trips}
            numColumns={2}
            estimatedItemSize={2000}
            ListEmptyComponent={<EmptyList message={"You haven't recorded any trips yet"} />}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom : 20,
            }}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  key={index}
                  className="bg-white p-3 rounded-2xl mb-4 shadow-sm relative justify-evenly items-center flex-1 m-2"
                  onPress={() => navigation.navigate('Trip', { id: item.id, place: item.place, country: item.country })}
                >
                  <TouchableWithoutFeedback onPress={() => handleDelete(item.id)} >
                    <View className="items-center bg-slate-600 flex h-10 w-10 rounded-full justify-center absolute z-50 mt-2 mr-2" style={{top : 0, right : 0,}}>
                      <XMarkIcon size={25} color={'white'} strokeWidth={3} />
                    </View>
                  </TouchableWithoutFeedback>

                  <View>
                    <Image source={randomImage()} className="" style={{width : width *0.4, height : height * 0.2, resizeMode : 'contain' }} />
                    <Text className={`text-neutral-600 text-base font-bold`}>{item.place}</Text>
                    <Text className={`text-neutral-600 text-lg`}>{item.country}</Text>
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

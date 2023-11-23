import { View, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../theme'
import BackButton from '../components/backButton'
import { useNavigation } from '@react-navigation/native'
import Loading from '../components/loading'
import Snackbar from 'react-native-snackbar';
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddTripScreen() {
  const [place, setPlace] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const saveData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleAddTrip = async () => {
    if (!place || !country) {
      Snackbar.show({
        text: 'Please fill in both place and country.',
        duration: Snackbar.LENGTH_SHORT,
      });
      return;
    }

    const newTrip = {
      id: new Date().getTime(),
      place,
      country,
      expenses: [],
    };

    try {
      setLoading(true);

      const existingTrips = await AsyncStorage.getItem('trips');
      const parsedTrips = existingTrips ? JSON.parse(existingTrips) : [];

      const updatedTrips = [...parsedTrips, newTrip];

      await saveData('trips', updatedTrips);

      setLoading(false);
      navigation.goBack();
    } catch (error) {
      console.error('Error adding trip:', error);
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

                <Text className={`${colors.heading} text-xl font-bold text-center`}>Add Trip</Text>
              </View>

              <View className="flex-row justify-center my-3 mt-5">
                <Image className="h-72 w-72" source={require('../assets/images/4.png')} />
              </View>
              <View className="space-y-2 mx-2">
                <Text className={`${colors.heading} text-lg font-bold`}>Where On The Earth?</Text>
                <TextInput value={place} onChangeText={value => setPlace(value)} className="p-4 bg-white rounded-full mb-3 text-xl" />
                <Text className={`${colors.heading} text-lg font-bold`}>In which State or Country ?</Text>
                <TextInput value={country} onChangeText={value => setCountry(value)} className="p-4 bg-white rounded-full mb-3 text-xl" />
              </View>
            </View>

            <View>
              {
                loading ? (
                  <Loading />
                ) : (
                  <TouchableOpacity onPress={handleAddTrip} style={{ backgroundColor: colors.button }} className="my-6 rounded-full p-3 shadow-sm mx-2">
                    <Text className="text-center text-white text-lg font-bold">Add Trip</Text>
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
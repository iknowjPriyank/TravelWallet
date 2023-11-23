import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import {ChevronLeftIcon} from 'react-native-heroicons/outline'
import { colors } from '../theme'
import { useNavigation } from '@react-navigation/native'
export default function BackButton() {
    const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={()=> navigation.goBack()} className="bg-white rounded-full h-auto w-auto justify-center items-center">
      <ChevronLeftIcon size="40" color={colors.button} />
    </TouchableOpacity>
  )
}
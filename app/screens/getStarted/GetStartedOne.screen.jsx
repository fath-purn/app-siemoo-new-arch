import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GetOne() {
  GetOne.displayName = 'GetOne';
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={{
        // Paddings to handle safe area
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className="flex-[1] items-center bg-[#EDF1D6] h-screen">
      <View className=" w-[95%]">
        <View className="">
          <View className="flex items-center mt-[20%]">
            <Image
              source={{
                uri: 'https://ik.imagekit.io/purnomo/Asset%202.png?updatedAt=1706361743876',
              }}
              // source={require('../../assets/Logo.png')}
              // style={{width: 300, height: 300}}
              className="w-[85%] h-[222px] right-[10px]"
            />
            <View className="flex-row gap-3 mt-[10%]">
              <View className="w-2 h-2 bg-green-800 rounded-full"></View>
              <View className="w-2 h-2 bg-gray-300 rounded-full"></View>
              <View className="w-2 h-2 bg-gray-300 rounded-full"></View>
              <View className="w-2 h-2 bg-gray-300 rounded-full"></View>
            </View>
            <Text className="mt-[10%] text-lg font-semibold text-[#40513B] text-center">Selamat Datang di Aplikasi Si-Emoo </Text>
            <Text className="mt-3 text-[#40513B] text-center">Sahabat peternak sapi perah</Text>
          </View>

          <TouchableOpacity
            className="flex items-center mt-[70%] bg-green-800 w-full rounded-lg p-3"
            onPress={() => navigation.navigate('GetStartedTwoScreen-screen')}>
            <Text className="text-[#EDF1D6] ">Lanjutkan</Text>
          </TouchableOpacity>
          
        </View>
      </View>
    </SafeAreaView>
  );
};

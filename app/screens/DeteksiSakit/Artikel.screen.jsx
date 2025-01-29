import React, { useState } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  Image,
  Text,
  Linking,
  ActivityIndicator,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopTitleMenu from "../../components/TopTitleMenu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "react-query";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import { styles, extractUrlFromIntent } from "../../utils/global.utils";
import clsx from "clsx";
import AntDesign from "@expo/vector-icons/AntDesign";
import SakitKlinikLengkap from "../../components/SakitKlinikLengkap";
import { WebView } from "react-native-webview";
import SakitBanner from "../../components/SakitBanner";
import SakitUpload from "../../components/SakitUpload";

const fetchData = async (value) => {
  const headers = {
    Authorization: `Bearer ${value}`,
  };

  const response = await axios.get(
    "https://siemoo.vercel.app/api/v1/pengujian/me",
    { headers }
  );

  return response.data.data;
};

export default Artikel = () => {
  const insets = useSafeAreaInsets();

  //   const {data, isLoading, isError, error} = useQuery(
  //     'pengujianData',
  //     async () => {
  //       const value = await AsyncStorage.getItem('@data/user');
  //       const responseData = await fetchData(value);

  //       return responseData;
  //     },
  //   );

  //   if (isLoading) {
  //     return (
  //       <View className="flex items-center justify-center w-screen h-screen bg-[#EDF1D6]">
  //         <ActivityIndicator size={80} color="#609966" />
  //       </View>
  //     );
  //   }

  //   if (isError) {
  //     return (
  //       <View className="flex items-center justify-center w-screen h-screen bg-[#EDF1D6]">
  //         <Text>Error: {error.message}</Text>
  //       </View>
  //     );
  //   }

  const data = [
    {
      id: 1,
      penyakit: "Demam",
      saran: "Senenge rewel berisik, tapi cantik ",
      akurasi: 92,
      created: "12 Juli 2024",
    },
    {
      id: 1,
      penyakit: "Demam",
      saran: "Senenge rewel berisik, tapi cantik ",
      akurasi: 92,
      created: "12 Juli 2024",
    },
    {
      id: 1,
      penyakit: "Demam",
      saran: "Senenge rewel berisik, tapi cantik ",
      akurasi: 92,
      created: "12 Juli 2024",
    },
    {
      id: 1,
      penyakit: "Demam",
      saran: "Senenge rewel berisik, tapi cantik ",
      akurasi: 92,
      created: "12 Juli 2024",
    },
  ];

  return (
    <SafeAreaView
      style={{
        // Paddings to handle safe area
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className="flex-[1] items-center bg-[#EDF1D6] h-screen"
    >
      <View className="w-[95%] mt-10">
        <TopTitleMenu title={"Penyakit"} />

        {/* Upload Gambar */}
        <SakitUpload />

        <ScrollView className="flex-auto h-[80%]">
          <Text>Haii</Text>
        <View className="pb-[100px]"></View>
        </ScrollView>

      </View>
    </SafeAreaView>
  );
};

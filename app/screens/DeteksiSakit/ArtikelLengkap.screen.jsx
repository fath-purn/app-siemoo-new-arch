import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import React from "react";
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, View, } from "react-native";
import Markdown from "react-native-markdown-display";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import TopTitleMenu from "../../components/TopTitleMenu";

const fetchData = async (value, id) => {
  const headers = {
    Authorization: `Bearer ${value}`,
  };
  const response = await axios.get(
    `https://siemoo.vercel.app/api/v1/cocoblog/${id}`,
    {
      headers,
    }
  );

  return response.data.data;
};

export default function ArtikelLengkap() {
  ArtikelLengkap.displayName = "ArtikelLengkap";
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { id } = route.params;

  const { data, isLoading, isError, error } = useQuery(
      `ArtikelListDeskripsi${id}`,
      async () => {
        const value = await AsyncStorage.getItem("@data/user");
        const responseData = await fetchData(value, id);
  
        return responseData;
      }
    );

  if (isLoading) {
      return (
        <View className="flex items-center justify-center w-screen h-screen bg-[#EDF1D6]">
          <ActivityIndicator size={80} color="#609966" />
        </View>
      );
    }
  
    if (isError) {
      return (
        <View className="flex items-center justify-center w-screen h-screen bg-[#EDF1D6]">
          <Text>Error: {error.message}</Text>
        </View>
      );
    }

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
        <TopTitleMenu title={data.judul} />

        <ScrollView className="flex-auto h-[80%]">
          <Image source={{ uri: data.gambar }}
              className="w-full aspect-square rounded-lg"
          />
          <Markdown style={styles} >{data.isi}</Markdown>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  heading1: {
    fontSize: 32,
    backgroundColor: '#000000',
    color: '#FFFFFF',
  },
  heading2: {
    fontSize: 24,
  },
  heading3: {
    fontSize: 18,
  },
  heading4: {
    fontSize: 16,
  },
  heading5: {
    fontSize: 13,
  },
  heading6: {
    fontSize: 11,
  },
});
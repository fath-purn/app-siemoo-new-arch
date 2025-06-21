import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import ErrorHandler from "../components/ErrorHandler";
import TopTitleMenu from "../components/TopTitleMenu";
import { styles } from "../utils/global.utils";

const fetchData = async (value) => {
  const headers = {
    Authorization: `Bearer ${value}`,
  };

  const response = await axios.get(
    "https://siemoo.vercel.app/api/v1/user/dashboard",
    { headers }
  );

  return response.data.data;
};

export default function BeriPakan() {
  BeriPakan.displayName = 'BeriPakan';
  const insets = useSafeAreaInsets();

  const { data, isLoading, isError, error } = useQuery(
    "dashboardData",
    async () => {
      const value = await AsyncStorage.getItem("@data/user");
      const responseData = await fetchData(value);

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
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className="flex-[1] items-center bg-[#EDF1D6] h-screen"
    >
      <View className="w-[95%] mt-10">
        <TopTitleMenu title={"Beri Pakan"} />

        {data && data.pengujian.created !== null ? (
          <ScrollView className="h-[80%]">
            <Text className="text-right text-[#40513B] mb-5">
              Tgl: {data.pengujian.created}
            </Text>
            <View
              className="bg-white p-5 rounded-lg mb-5"
              style={[styles.shadow]}
            >
              <Text className="text-lg font-semibold text-[#40513B] mb-2">
                Detail Pengujian:
              </Text>
              <View className="flex-row ">
                <View className="w-[50%]">
                  <Text className="text-base text-[#40513B] mb-1">
                    fat: {data.pengujian.fat}%
                  </Text>
                  <Text className="text-base text-[#40513B]">
                    snf: {data.pengujian.snf}%
                  </Text>
                </View>
                <View className="w-[50%]">
                  <Text className="text-base text-[#40513B] mb-1">
                    protein: {data.pengujian.protein}%
                  </Text>
                  <Text className="text-base text-[#40513B]">
                    ph: {data.pengujian.ph}%
                  </Text>
                </View>
              </View>
            </View>
            <View
              className="bg-white p-5 rounded-lg mb-5"
              style={[styles.shadow]}
            >
              <Text className="text-lg font-semibold text-[#40513B]">
                Hasil:{" "}
                <Text className="font-bold">
                  {data.pengujian.hasil
                    ? data.pengujian.hasil.startsWith("Sangat")
                      ? data.pengujian.hasil.replace("Sangat", "Sangat ")
                      : data.pengujian.hasil
                    : "-"}
                </Text>
              </Text>
            </View>
            <View
              className="bg-white p-5 rounded-lg mb-5"
              style={[styles.shadow]}
            >
              <Text className="text-lg font-semibold text-[#40513B]">
                Rekomendasi Pakan:
              </Text>
              <Text className="text-base text-[#40513B]">
                {data.pengujian.message}
              </Text>
            </View>
          </ScrollView>
        ) : (
          <ErrorHandler />
        )}
      </View>
    </SafeAreaView>
  );
};
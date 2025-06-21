import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import SakitBanner from "../../components/SakitBanner";
import SakitUpload from "../../components/SakitUpload";
import TopTitleMenu from "../../components/TopTitleMenu";

const fetchData = async (value) => {
  const headers = {
    Authorization: `Bearer ${value}`,
  };

  const response = await axios.get("https://siemoo.vercel.app/api/v1/deteksi", {
    headers,
  });

  return response.data.data;
};

export default function Riwayat() {
  Riwayat.displayName = "Riwayat";
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery(
    "riwayatSakit",
    async () => {
      const value = await AsyncStorage.getItem("@data/user");
      const responseData = await fetchData(value);

      return responseData;
    }
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

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
        <TopTitleMenu title={"Riwayat"} />

        {/* Upload Gambar */}
        <SakitUpload />

        <ScrollView
          className="h-[80%] flex-auto"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#609966"]}
              tintColor="#609966"
            />
          }
        >
          {isLoading ? (
            // Loading state
            <View className="w-full rounded-xl bg-white px-8 py-6 mb-4">
              <ActivityIndicator size={80} color="#609966" />
              <Text className="text-center mt-2 text-[#40513B]">
                Memuat data...
              </Text>
            </View>
          ) : data && data.length > 0 ? (
            // Data exists - render list
            data.map((item, index) => (
              <SakitBanner
                key={`${item.id || index}`}
                sakit={item}
                index={index}
              />
            ))
          ) : (
            // Empty state
            <View className="w-full rounded-xl bg-white px-8 py-6 mb-4">
              <Text className="text-xl font-semibold leading-7 tracking-wide text-[#40513B] text-center">
                Silahkan unggah foto untuk menampilkan hasil deteksi penyakit.
              </Text>
            </View>
          )}
          <View className="pb-[100px]"></View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

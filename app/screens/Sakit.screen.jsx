import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import SakitBanner from "../components/SakitBanner";
import SakitUpload from "../components/SakitUpload";
import TopTitleMenu from "../components/TopTitleMenu";
import { styles } from "../utils/global.utils";

const fetchData = async (value) => {
  try {
    const headers = {
      Authorization: `Bearer ${value}`,
    };

    const response = await axios.get(
      "https://siemoo.vercel.app/api/v1/deteksi/last",
      {
        headers,
      }
    );

    return response.data.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw error;
  }
};

export default function DeteksiSakit() {
  DeteksiSakit.displayName = "DeteksiSakit";
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const handlerNavigate = (tujuan) => {
    navigation.navigate(tujuan);
  };

  const { data, isLoading, isError, error, refetch } = useQuery(
    "deteksiLast",
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
        <TopTitleMenu title={"Deteksi Sakit"} />

        <SakitUpload />

        <ScrollView
          className="h-[80%]"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#609966"]}
              tintColor="#609966"
            />
          }
        >
          <View className="flex items-center justify-center mt-[10%]">
            {/* penyakit */}
            {isLoading ? (
              // Full screen loading indicator
              <View className="w-full rounded-xl bg-white px-8 py-6 mb-4">
                <ActivityIndicator size={80} color="#609966" />
              </View>
            ) : data?.penyakit ? (
              // Show data when available
              <SakitBanner sakit={data} />
            ) : (
              // Show empty state when no data
              <View className="w-full rounded-xl bg-white px-8 py-6 mb-4">
                <Text className="text-xl font-semibold leading-7 tracking-wide text-[#40513B]">
                  Silahkan unggah foto untuk menampilkan hasil deteksi penyakit.
                </Text>
              </View>
            )}
            {/* banner sakit */}
            {/* Menu bawah */}
            <View className="flex flex-row justify-between w-[100%]">
              {/* Klinik */}
              <View className="min-w-[45%] max-w-[48%] mr-2">
                <TouchableOpacity
                  className="bg-white rounded-xl w-full aspect-square flex items-center justify-center"
                  style={[styles.shadow]}
                  onPress={() => handlerNavigate("KlinikList-screen")}
                >
                  <MaterialCommunityIcons
                    name={"medical-bag"}
                    size={60}
                    color="#166534"
                  />
                  <Text className="text-2xl font-semibold leading-7 tracking-widest text-[#40513B]">
                    Klinik
                  </Text>
                </TouchableOpacity>
              </View>
              {/* Riwayat */}
              <View className="min-w-[45%] max-w-[48%] ml-2">
                <TouchableOpacity
                  className="bg-white rounded-xl w-full aspect-square flex items-center justify-center"
                  style={[styles.shadow]}
                  onPress={() => handlerNavigate("Riwayat-screen")}
                >
                  <MaterialCommunityIcons
                    name={"clock-outline"}
                    size={60}
                    color="#166534"
                  />
                  <Text className="text-2xl font-semibold leading-7 tracking-widest text-[#40513B]">
                    Riwayat
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex flex-row justify-between w-[100%] mt-4">
              {/* Penyakit */}
              <View className="min-w-[45%] max-w-[48%] mr-2">
                <TouchableOpacity
                  className="bg-white rounded-xl w-full aspect-square flex items-center justify-center"
                  style={[styles.shadow]}
                  onPress={() => handlerNavigate("Artikel-screen")}
                >
                  <MaterialCommunityIcons
                    name={"needle"}
                    size={60}
                    color="#166534"
                  />
                  <Text className="text-2xl font-semibold leading-7 tracking-widest text-[#40513B]">
                    Penyakit
                  </Text>
                </TouchableOpacity>
              </View>
              {/* Riwayat */}
              {/* <View className="min-w-[45%] max-w-[48%] ml-2">
                <TouchableOpacity
                  className="bg-white rounded-xl w-full aspect-square flex items-center justify-center"
                  style={[styles.shadow]}
                  onPress={() => handlerNavigate("sd")}
                >
                  <MaterialCommunityIcons
                    name={"clock-outline"}
                    size={60}
                    color="#166534"
                  />
                  <Text className="text-2xl font-semibold leading-7 tracking-widest text-[#40513B]">Riwayat</Text>
                </TouchableOpacity>
              </View> */}
            </View>
          </View>
          <View className="pb-[100px]"></View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

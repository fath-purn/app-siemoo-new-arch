import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import SakitUpload from "../../components/SakitUpload";
import TopTitleMenu from "../../components/TopTitleMenu";

const fetchData = async (value) => {
  const headers = {
    Authorization: `Bearer ${value}`,
  };
  const response = await axios.get(
    `https://siemoo.vercel.app/api/v1/cocoblog`,
    {
      headers,
    }
  );

  return response.data.data.cocoblog;
};

export default function Artikel() {
  Artikel.displayName = "Artikel";

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery(
    `ArtikelList`,
    async () => {
      const value = await AsyncStorage.getItem("@data/user");
      const responseData = await fetchData(value);

      return responseData;
    }
  );

  const handlerNavigate = (id) => {
    navigation.navigate("ArtikelLengkap-screen", { id: id });
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

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
        <TopTitleMenu title={"Penyakit"} />

        {/* Upload Gambar */}
        <SakitUpload />

        <ScrollView
          className="flex-auto h-[80%]"
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
            <View className="flex items-center justify-center w-full h-full bg-[#EDF1D6]">
              <ActivityIndicator size={80} color="#609966" />
            </View>
          ) : data && data.length > 0 ? (
            data.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handlerNavigate(item.id)}
                className="flex mb-3 flex-row justify-between p-4 bg-white rounded-lg shadow-md"
              >
                <View className="flex justify-center w-[70%]">
                  <Text className="font-semibold mb-2 text-xl" numberOfLines={2}>
                    {item.judul}
                  </Text>
                  {/* <Text>{item.description}</Text> */}
                </View>
                <Image
                  source={{ uri: item.gambar }}
                  className="h-[100px] w-[100px] aspect-square rounded-lg"
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text>Tidak ada data</Text>
          )}
          <View className="pb-[100px]"></View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

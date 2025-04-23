import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { useQuery } from "react-query";
import TopTitleMenu from "../../components/TopTitleMenu";
import { extractUrlFromIntent, styles } from "../../utils/global.utils";

const fetchData = async (value, id) => {
  const headers = {
    Authorization: `Bearer ${value}`,
  };

  const response = await axios.get(
    `https://siemoo.vercel.app/api/v1/klinik/${id}`,
    { headers }
  );

  return response.data.data;
};

export default function KlinikDeskripsi() {
  KlinikDeskripsi.displayName = 'KlinikDeskripsi';
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const [webViewKey, setWebViewKey] = useState(0);
  const route = useRoute();
  const { id } = route.params;

  const {data, isLoading, isError, error, refetch} = useQuery(
    `klinikDeskripsi`,
    async () => {
      const value = await AsyncStorage.getItem('@data/user');
      const responseData = await fetchData(value, id);

      return responseData;
    },
  );

  const openRute = (err) => {
    const url = extractUrlFromIntent(err.nativeEvent.url);
    setWebViewKey(webViewKey + 1);
    Linking.openURL(url);
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
        <TopTitleMenu title={data.nama} />

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
          <View
            style={[styles.shadow]}
            className="w-full aspect-square rounded-lg"
          >
            <Image
              source={{ uri: data.media }}
              // style={{ width: 300, height: 300 }}
              className="w-full aspect-square rounded-lg"
              style={[styles.shadow]}
            />
          </View>

          <View className="mt-5">
            <Text className="text-2xl font-semibold leading-7 tracking-wide text-[#40513B] mb-1">
              Alamat
            </Text>
            <View
              className="rounded-lg w-full h-[300px] mb-5 bg-black"
              style={[styles.shadow]}
            >
              <WebView
                key={webViewKey}
                originWhitelist={["*"]}
                source={{
                  uri: data.maps,
                }}
                onError={openRute}
                onHttpError={({ nativeEvent }) => {
                  openRute(nativeEvent);
                }}
              />
            </View>

            <View className="flex-row mt-5 w-full">
              <MaterialCommunityIcons
                name={"map-marker-outline"}
                size={35}
                color="#166534"
              />
              <Text className="ml-1 text-base font-medium leading-7 tracking-widest text-[#40513B] mb-1 w-[90%]">
                {data.alamat}
              </Text>
            </View>
            <View className="flex-row mt-3 items-center">
              <MaterialCommunityIcons
                name={"phone"}
                size={35}
                color="#166534"
              />
              <Text className="ml-1 text-base font-medium leading-7 tracking-widest text-[#40513B] mb-1 w-full">
                {data.telepon}
              </Text>
            </View>
            <View className="flex-row mt-3 w-full">
              <MaterialCommunityIcons
                name={"clock-outline"}
                size={35}
                color="#166534"
              />
              <View className="ml-1">
                <Text className="ml-1 text-base font-medium leading-7 tracking-widest text-[#40513B]">
                  Senin - Sabtu {data.jadwal.seninSabtu} WIB
                </Text>
                <Text className="ml-1 text-base font-medium leading-7 tracking-widest text-[#40513B] mb-1">
                  Minggu {data.jadwal.seninSabtu} WIB
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

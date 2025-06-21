import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import * as Location from "expo-location";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Bar } from "react-native-progress";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { useQuery } from "react-query";
import SakitKlinikLengkap from "../../components/SakitKlinikLengkap";
import TopTitleMenu from "../../components/TopTitleMenu";
import {
  extractUrlFromIntent,
  getDangerColor,
  styles,
} from "../../utils/global.utils";

const fetchData = async (value, id) => {
  const headers = {
    Authorization: `Bearer ${value}`,
  };
  const response = await axios.get(`https://siemoo.vercel.app/api/v1/deteksi/${id}`, {
    headers,
  });

  return response.data.data;
};

const HasilDeteksiSakit = (props) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  const screenWidth = Dimensions.get("window").width;
  const [dangerLevel, setDangerLevel] = useState(2);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery(
    `hasilDeteksiSakit${id}`,
    async () => {
      const value = await AsyncStorage.getItem('@data/user');
      const responseData = await fetchData(value, id);
      return responseData;
    },
    {
      onSuccess: async (data) => {
        setDangerLevel(Number(data.bahaya));
        // Request location permission and get current location
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          let location = await Location.getCurrentPositionAsync({});
          setLatitude(location.coords.latitude);
          setLongitude(location.coords.longitude);
        } else {
          console.error("Permission to access location was denied");
        }
      },
      onError: (error) => {
        console.error("Error fetching data:", error);
      },
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

  const openRute = (err) => {
    const url = extractUrlFromIntent(err.nativeEvent.url);
    Linking.openURL(url);
  };

  const handlerNavigate = () => {
    navigation.navigate("KlinikList-screen");
  };

  return (
    <SafeAreaView
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className="flex-1 items-center bg-[#EDF1D6] h-screen"
    >
      <View className="w-[95%] mt-10">
        <TopTitleMenu title={data.penyakit} />

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
              source={{ uri: data.link }}
              className="w-full aspect-square rounded-lg"
            />
          </View>
          <View className="flex-1 mt-5 justify-center">
            <Text className="ml-1 text-lg font-semibold leading-7 tracking-widest text-[#40513B] mb-1">
              Akurasi: {data?.akurasi}%
            </Text>
            <Bar
              width={screenWidth * 0.95}
              color="#166534"
              unfilledColor="#fff"
              height={8}
              useNativeDriver={true}
              progress={data?.akurasi / 100}
              borderRadius={5}
            />
            <Text className="ml-1 text-lg font-semibold leading-7 tracking-widest text-[#40513B] mt-5 mb-1">
              Tingkat Bahaya: {dangerLevel}
            </Text>
            <Bar
              width={screenWidth * 0.95}
              color={getDangerColor(dangerLevel)}
              unfilledColor="#fff"
              height={8}
              borderRadius={5}
              progress={dangerLevel / 3}
            />
          </View>

          {/* Saran */}
          <View className="mt-5">
            <Text className="text-2xl font-semibold leading-7 tracking-wide text-[#40513B] mb-1">
              Saran
            </Text>
            <Text className="text-sm font-medium leading-5 tracking-wide text-[#333333]">
              {data.deskripsi}
            </Text>
          </View>

          {/* Klinik Terdekat */}
          <View className="mt-5">
            <Text className="text-2xl font-semibold leading-7 tracking-wide text-[#40513B] mb-1">
              Klinik Terdekat
            </Text>
            <View
              className="rounded-lg w-full h-[300px] mb-5 bg-black"
              style={[styles.shadow]}
            >
              <WebView
                originWhitelist={["*"]}
                source={{
                  uri: `https://www.google.com/maps/search/klinik+hewan/@${latitude},${longitude},14z/data=!3m1!4b1?entry=ttu`,
                }}
                onError={openRute}
                onHttpError={({ nativeEvent }) => {
                  openRute(nativeEvent);
                }}
              />
            </View>

            {/* Tombol untuk masuk ke google maps langsung */}
            {/* <TouchableHighlight
              onPress={openGoogleMaps}
              className="text-black bg-white border border-[#40513B] p-3 rounded-lg"
              style={[styles.shadow]}
            >
              <Text className="text-sm font-medium leading-5 tracking-wide text-[#333333] text-center">
                Buka dengan Google Maps
              </Text>
            </TouchableHighlight> */}
          </View>

          {/* Klinik  */}
          <View className="mt-5">
            <Text className="text-2xl font-semibold leading-7 tracking-wide text-[#40513B] mb-1">
              Klinik Terdekat
            </Text>
            {data.klinik && data.klinik.map((data, index) => {
              return <SakitKlinikLengkap key={data.id || `klinik-${index}`} data={data} index={index} />;
            })}

            <TouchableWithoutFeedback className="w-full" onPress={handlerNavigate}>
              <Text className="text-base text-[#333333] leading-5 text-center mt-4 underline">
                Lihat Selengkapnya
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HasilDeteksiSakit;
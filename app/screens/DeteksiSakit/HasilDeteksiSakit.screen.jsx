import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  Text,
  Dimensions,
  Image,
  Linking,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopTitleMenu from "../../components/TopTitleMenu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "react-query";
import axios from "axios";
import * as Location from "expo-location";
import ErrorHandler from "../../components/ErrorHandler";
// import { Line } from 'react-native-svg';
import Svg, { Circle, Rect } from "react-native-svg";
import { Line } from "react-native-svg/src";
import { Bar } from "react-native-progress";
import { WebView } from "react-native-webview";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  extractUrlFromIntent,
  getDangerColor,
  styles,
} from "../../utils/global.utils";
import SakitKlinikLengkap from "../../components/SakitKlinikLengkap";
import { useNavigation, useRoute } from "@react-navigation/native";

const fetchData = async (value, id) => {
  const headers = {
    Authorization: `Bearer ${value}`,
  };

  const response = await axios.get(`https://siemoo.vercel.app/api/v1/deteksi/${id}`, {
    headers,
  });

  return response.data.data;
};

export default HasilDeteksiSakit = (props) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  const [progress, setProgress] = useState(0); // Start progress from 0
  const [targetProgress, setTargetProgress] = useState(100); // Target progress value
  const screenWidth = Dimensions.get("window").width;
  const [dangerLevel, setDangerLevel] = useState(2);
  const [photo, setPhoto] = useState("https://reactjs.org/logo-og.png");
  const [latitude, setLatitude] = useState(-7.5824467);
  const [longitude, setLongtitude] = useState(109.2537889);
  const [webViewKey, setWebViewKey] = useState(0);
  const [displayedAccuracy, setDisplayedAccuracy] = useState(0);

  const handlerNavigate = () => {
    navigation.navigate("KlinikList-screen");
  };

  const { data, isLoading, isError, error } = useQuery(
    `hasilDeteksiSakit${id}`,
    async () => {
      const value = await AsyncStorage.getItem('@data/user');
      const responseData = await fetchData(value, id);
  
      // Meminta izin lokasi
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Permission to access location was denied");
      }
  
      // Mendapatkan lokasi saat ini
      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongtitude(location.coords.longitude);
  
      return responseData;
    },
    {
      // Menambahkan onSuccess callback untuk menangani state setelah data berhasil diambil
      onSuccess: (data) => {
        const targetAccuracy = data.akurasi; // Get accuracy from data
        const duration = 1000; // 1 second
        const intervalTime = 50; // Update every 50 milliseconds
        const targetProgress = 1; // Target progress (1 = 100%)
  
        const step = targetProgress / (duration / intervalTime); // Progress step
        const accuracyStep = targetAccuracy / (duration / intervalTime); // Accuracy step
  
        let currentAccuracy = 0;
        let currentProgress = 0;
        const interval = setInterval(() => {
          currentAccuracy += accuracyStep;
          currentProgress += step;
          setProgress(data.akurasi / 100); // Ensure progress does not exceed the target
          setDisplayedAccuracy(data.akurasi);
          setDangerLevel(Number(data.bahaya));
          if (currentProgress >= targetProgress) {
            clearInterval(interval);
          }
        }, intervalTime);
  
        return () => clearInterval(interval); // Cleanup interval on component unmount
      }
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
    
//   useEffect(() => {
//   if (data) { // Ensure data is defined before proceeding
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         setErrorMsg("Permission to access location was denied");
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       setLatitude(location.coords.latitude);
//       setLongtitude(location.coords.longitude);
//     })();

//     const duration = 1000; // 1 second
//     const intervalTime = 50; // Update every 50 milliseconds
//     const targetProgress = 1; // Target progress (1 = 100%)
//     const targetAccuracy = data.akurasi; // Get accuracy from data

//     const step = targetProgress / (duration / intervalTime); // Progress step
//     const accuracyStep = targetAccuracy / (duration / intervalTime); // Accuracy step

//     let currentAccuracy = 0;
//     let currentProgress = 0;
//     const interval = setInterval(() => {
//       currentAccuracy += accuracyStep;
//       currentProgress += step;
//       setProgress(data.akurasi / 100); // Ensure progress does not exceed the target
//       setDisplayedAccuracy(data.akurasi);
//       setDangerLevel(Number(data.bahaya));
//       if (currentProgress >= targetProgress) {
//         clearInterval(interval);
//       }
//     }, intervalTime);

//     return () => clearInterval(interval);
//   }
// }, [data]); // Add data as a dependency

  // Function to open Google Maps
  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/klinik+hewan/@${latitude},${longitude},14z/data=!3m1!4b1?entry=ttu`;
    setWebViewKey(webViewKey + 1); // Change key to force reload
    Linking.openURL(url);
  };

  const openRute = (err) => {
    const url = extractUrlFromIntent(err.nativeEvent.url);
    setWebViewKey(webViewKey + 1);
    Linking.openURL(url);
  };

  return (
    <SafeAreaView
      style={{
        // Paddings to handle safe area
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className="flex-1 items-center bg-[#EDF1D6] h-screen"
    >
      <View className="w-[95%] mt-10">
        <TopTitleMenu title={data.penyakit} />

        <ScrollView className="h-[80%]">
          <View
            style={[styles.shadow]}
            className="w-full aspect-square rounded-lg"
          >
            <Image
              source={{ uri: photo }}
              className="w-full aspect-square rounded-lg"
            />
          </View>
          <View className="flex-1 mt-5 justify-center">
            <Text className="ml-1 text-lg font-semibold leading-7 tracking-widest text-[#40513B] mb-1">
              Akurasi: {displayedAccuracy}%
            </Text>
            <Bar
              width={screenWidth * 0.95}
              color="#166534"
              unfilledColor="#fff"
              height={8}
              useNativeDriver={true}
              progress={progress}
              borderRadius={5}
            />
            <Text className="ml-1 text-lg font-semibold leading-7 tracking-widest text-[#40513B] mt-5 mb-1">
              Tingkat Bahaya: {dangerLevel}
            </Text>
            <Bar
              width={screenWidth * 0.95}
              color={getDangerColor(dangerLevel)}
              // color={"green"}
              unfilledColor="#fff"
              height={8}
              borderRadius={5}
              progress={dangerLevel/3} // Normalize the progress for danger level (1-3)
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
                key={webViewKey}
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
              return <SakitKlinikLengkap data={data} index={index} />;
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

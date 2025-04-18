import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  SafeAreaView,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopTitleMenu from "../../components/TopTitleMenu";
import { styles } from "../../utils/global.utils";

// Constants
const API_URL = "https://siemoo.vercel.app/api/v1/deteksi";
const IMAGE_OPTIONS = {
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [3, 3],
  quality: 0.9,
};

const AmbilGambar = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [photo, setPhoto] = useState("");
  const [location, setLocation] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Request permissions for media library and camera
  const requestPermissions = useCallback(async (type) => {
    let permissionResult;
    if (type === "camera") {
      permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    } else {
      permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
    }
    if (!permissionResult.granted) {
      alert(`Permission to access ${type} is required!`);
      return false;
    }
    return true;
  }, []);

  // Pick image from gallery
  const pickImage = useCallback(async () => {
    const hasPermission = await requestPermissions("media");
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync(IMAGE_OPTIONS);
      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  }, [requestPermissions]);

  // Take photo using camera
  const handleTakePhoto = useCallback(async () => {
    const hasPermission = await requestPermissions("camera");
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync(IMAGE_OPTIONS);
      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  }, [requestPermissions]);

  const [lastKnownLocation, setLastKnownLocation] = useState(null);

  useEffect(() => {
    (async () => {
      // Coba dapatkan lokasi terakhir dari cache
      const cachedLocation = await AsyncStorage.getItem("@last_location");
      if (cachedLocation) setLastKnownLocation(JSON.parse(cachedLocation));

      // Ambil lokasi baru
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      try {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        // Simpan ke cache
        await AsyncStorage.setItem(
          "@last_location",
          JSON.stringify(location)
        );
      } catch (error) {
        console.error("Gagal mendapatkan lokasi:", error);
      }
    })();
  }, []);

  // Handle image upload
  const handleImageUpload = useCallback(async () => {
    if (!photo) {
      alert("Silakan pilih gambar terlebih dahulu!");
      return;
    }

    setIsUploading(true);
    try {
      const token = await AsyncStorage.getItem("@data/user");
      const formData = new FormData();

      const imageData = {
        uri: Platform.OS === "ios" ? photo.replace("file://", "") : photo,
        type: "image/jpeg",
        name: "photo.jpg",
      };
      formData.append("image", imageData);

      if (!location) {
        alert("Sedang mengambil lokasi... Tunggu sebentar atau coba lagi.");
        return; // Berhenti jika lokasi belum siap
      }

      if (location) {
        formData.append("latitude", String(location.coords.latitude || lastKnownLocation?.coords.latitude));
        formData.append("longtitude", String(location?.coords.longitude || lastKnownLocation?.coords.longitude));
      }

      const response = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      if (response.data.status) {
        navigation.replace("HasilDeteksiSakit-screen", {
          id: response.data.data.id,
        });
      } else {
        alert(response.data.message || "Gagal mengupload gambar");
      }
    } catch (error) {
      // Log detail request yang gagal
      console.log("Request yang gagal:", {
        errorDetails: {
          name: error.name,
          message: error.message,
          code: error.code,
          status: error.response?.status,
          responseData: error.response?.data,
        },
      });

      // Handle error selanjutnya...
      if (error.code === "ECONNABORTED") {
        alert("Request timeout, silakan coba lagi.");
      } else if (error.response?.status === 504) {
        alert("Server sedang sibuk. Coba beberapa saat lagi.");
      } else {
        alert(
          "Terjadi kesalahan saat mengupload gambar. Silakan coba upload lagi."
        );
      }
    } finally {
      setIsUploading(false);
    }
  }, [photo, location, navigation, lastKnownLocation?.coords.latitude, lastKnownLocation?.coords.longitude]);

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
        <TopTitleMenu title={"Ambil Gambar"} />
        <View className="h-[80%] mt-4 items-center">
          {photo ? (
            <View
              style={[styles.shadow]}
              className="w-full aspect-square rounded-lg"
            >
              <Image
                source={{ uri: photo }}
                className="w-full aspect-square rounded-lg"
              />
            </View>
          ) : (
            <View
              className="w-full aspect-square rounded-lg bg-white justify-center items-center"
              style={[styles.shadow]}
            >
              <Text className="text-xl font-semibold leading-7 tracking-widest text-[#40513B] text-center w-[85%] mb-3 mt-14">
                Silakan ambil gambar dengan kamera atau galeri!
              </Text>
              <MaterialCommunityIcons
                name={"arrow-down"}
                size={80}
                color="#166534"
              />
            </View>
          )}
          <View className="mt-5 flex flex-row justify-between w-full">
            <View className="w-[48%]">
              <TouchableHighlight
                className="h-[68px] bg-white rounded-lg"
                onPress={handleTakePhoto}
                style={[styles.shadow]}
              >
                <View className="flex-row h-full items-center justify-center">
                  <MaterialCommunityIcons
                    name={"camera-outline"}
                    size={30}
                    color="#166534"
                  />
                  <Text className="ml-1 text-xl font-semibold leading-7 tracking-widest text-[#40513B]">
                    Kamera
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
            <View className="w-[48%]">
              <TouchableHighlight
                className="h-[68px] bg-white justify-center rounded-lg"
                onPress={pickImage}
                style={[styles.shadow]}
              >
                <View className="flex-row h-full items-center justify-center">
                  <MaterialCommunityIcons
                    name={"image-outline"}
                    size={30}
                    color="#166534"
                  />
                  <Text className="ml-1 text-xl font-semibold leading-7 tracking-widest text-[#40513B] text-center">
                    Galeri
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
          {photo && (
            <TouchableHighlight
              className={`w-full h-[68px] ${
                isUploading ? "bg-gray-400" : "bg-[#166534]"
              } justify-center rounded-lg mt-5`}
              onPress={handleImageUpload}
              disabled={isUploading}
              style={[styles.shadow]}
            >
              <View className="flex-row h-full items-center justify-center">
                {isUploading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name={"upload-outline"}
                      size={30}
                      color="#fff"
                    />
                    <Text className="ml-1 text-xl font-semibold leading-7 tracking-widest text-white text-center">
                      {isUploading ? "Uploading..." : "Upload"}
                    </Text>
                  </>
                )}
              </View>
            </TouchableHighlight>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AmbilGambar;

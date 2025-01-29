import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Image,
  Button,
  Text,
  TouchableHighlight,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import TopTitleMenu from "../../components/TopTitleMenu";
import { styles } from "../../utils/global.utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";

const AmbilGambar = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [photo, setPhoto] = useState("");
  const [location, setLocation] = useState(null);

  // Ambil gambar dari galeri
  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permission to access media library is required!");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 0.9,
      });

      console.log(result.assets[0].uri);

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  // Ambil gambar dari kamera
  const handleTakePhoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permission to access camera is required!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 0.9,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  // Maps
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(JSON.stringify(location));
    })();
  }, []);

  const handleImage = () => {
    console.log("Upload Image. . .");
    console.log(location, "location");
    const hasilId = 2;
    navigation.navigate("HasilDeteksiSakit-screen", {id: hasilId});
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
        <TopTitleMenu title={"Ambil Gambar"} />
        <View className="h-[80%] mt-4 items-center">
          {photo ? (
            <View
              style={[styles.shadow]}
              className="w-full aspect-square rounded-lg"
            >
              <Image
                source={{ uri: photo }}
                // style={{ width: 300, height: 300 }}
                className="w-full aspect-square rounded-lg"
                style={[styles.shadow]}
              />
            </View>
          ) : (
            <View
              className="w-full aspect-square rounded-lg bg-white justify-center items-center"
              style={[styles.shadow]}
            >
              <Text className="text-xl font-semibold leading-7 tracking-widest text-[#40513B] text-center w-[85%] mb-3 mt-14">
                Tekan tombol dibawah untuk memilih foto penyakit sapi yang ingin
                di deteksi!
              </Text>
              <MaterialCommunityIcons
                name={"arrow-down"}
                size={80}
                color="#166534"
                onPress={() => handlerNavigate("sd")}
              />
            </View>
          )}

          {/* Button */}
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
          {!photo && (
            <TouchableHighlight
              className="w-full h-[68px] bg-[#166534] justify-center rounded-lg mt-5"
              onPress={handleImage}
              style={[styles.shadow]}
            >
              <View className="flex-row h-full items-center justify-center">
                <MaterialCommunityIcons
                  name={"upload-outline"}
                  size={30}
                  color="#fff"
                />
                <Text className="ml-1 text-xl font-semibold leading-7 tracking-widest text-white text-center">
                  Upload
                </Text>
              </View>
            </TouchableHighlight>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AmbilGambar;

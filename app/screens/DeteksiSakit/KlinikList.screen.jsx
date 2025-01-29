import { MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import SakitKlinikLengkap from "../../components/SakitKlinikLengkap";
import TopTitleMenu from "../../components/TopTitleMenu";
import { styles } from "../../utils/global.utils";

// Function to fetch data from the API
const fetchData = async (value, search, kota) => {
  const headers = {
    Authorization: `Bearer ${value}`,
  };

  try {
    if (kota !== "Hapus") {
      const response = await axios.get(
        `https://siemoo.vercel.app/api/v1/klinik?search=${search}&kota=${
          kota !== "Hapus"
        }`,
        { headers }
      );
      console.log(
        `https://siemoo.vercel.app/api/v1/klinik?search=${search}&kota=${kota}`
      );
      return response.data.data;
    }


  } catch (error) {
    console.error("Error fetching data:", error);
    return undefined;
  }
};

// Function to fetch city data
const fetchDataKota = async (value) => {
  const headers = {
    Authorization: `Bearer ${value}`,
  };

  const response = await axios.get(
    "https://siemoo.vercel.app/api/v1/klinik/kota",
    { headers }
  );

  return response.data.data;
};

// Main component
export default KlinikList = () => {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState(""); // To store the user input
  const [kota, setKota] = useState("");
  const [kotaSelect, setKotaSelect] = useState("");
  const [role, setRole] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [searchText, setSearchText] = useState("");

  const { data, isLoading, isError, error } = useQuery(
    ["klinikList", searchText, kotaSelect],
    async () => {
      const value = await AsyncStorage.getItem("@data/user");
      return fetchData(value, searchText, kotaSelect);
    }
  );

  // Fetch city data on component mount
  useEffect(async () => {
    const value = await AsyncStorage.getItem("@data/user");
    const responseDataKota = await fetchDataKota(value);

    const dropdownData = [{ label: "Hapus", value: 0 }, ...responseDataKota];
    setKota(dropdownData);
    console.log(responseDataKota, "resp");
    console.log(dropdownData, "drop");
  }, []);

  // Handler for performing the search when the search button is clicked
  const handleSearch = () => {
    setSearchText(text); // Set the text entered by the user as the search text
  };

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

  const renderLabelRole = () => {
    if (role || isFocus) {
      return (
        <Text
          className={clsx(
            "absolute",
            "left-[22px]",
            "top-[-10px]",
            "z-50",
            "px-2",
            "text-sm",
            "bg-[#EDF1D6]",
            "text-[#40513B]",
            {
              "#166534": isFocus,
            }
          )}
        >
          Kota
        </Text>
      );
    }
    return null;
  };

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
        <TopTitleMenu title={"Klinik Hewan"} />

        <ScrollView className="flex-auto h-[80%]">
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View className="border border-gray-600 flex-row justify-between rounded-full items-center">
                <TextInput
                  placeholder="Search"
                  onChangeText={setText} // Update text immediately on change
                  value={text} // Controlled input for user input
                  className="w-[70%] py-4 ml-8"
                  enterKeyHint="search"
                  onSubmitEditing={handleSearch}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                />
                <View className="w-[3px] h-8 bg-gray-400 rounded-xl"></View>
                <TouchableOpacity
                  className="w-[15%] items-center py-4 mr-1 hover:bg-white"
                  onPress={handleSearch}
                >
                  <MaterialCommunityIcons
                    name={"magnify"}
                    size={30}
                    color="#166534"
                    className="rotate-3"
                  />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
          <View className="mt-3 mb-5">
            {renderLabelRole()}
            <Dropdown
              className={clsx(
                "h-[50px] border-[#9DC08B] border-[0.5px] rounded-lg px-2",
                {
                  "border-[#166534]": isFocus,
                }
              )}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={kota}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? "Filter kota" : "..."}
              searchPlaceholder="Search..."
              value={role}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setKotaSelect(item.label);
                setIsFocus(false);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color={isFocus ? "#166534" : "#40513B"}
                  name="Safety"
                  size={20}
                />
              )}
            />
          </View>
          {data ? (
            data.map((data, index) => {
              return <SakitKlinikLengkap data={data} index={index} />;
            })
          ) : (
            <Text>Data tidak ditemukan</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

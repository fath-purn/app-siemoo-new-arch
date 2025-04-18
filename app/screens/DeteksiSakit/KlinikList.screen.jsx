import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import SakitKlinikLengkap from "../../components/SakitKlinikLengkap";
import TopTitleMenu from "../../components/TopTitleMenu";

// Function to fetch data from the API
const fetchData = async (value, search) => {
  const headers = {
    Authorization: `Bearer ${value}`,
  };

  try {
    const response = await axios.get(
      `https://siemoo.vercel.app/api/v1/klinik?search=${search}`,
      { headers }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return undefined;
  }
};

// Main component
export default function KlinikList() {
  KlinikList.displayName = "KlinikList";
  const insets = useSafeAreaInsets();
  const [text, setText] = useState(""); // To store the user input
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery(
    ["klinikList", searchText],
    async () => {
      const value = await AsyncStorage.getItem("@data/user");
      return fetchData(value, searchText);
    }
  );

  const handleSearch = () => {
    setSearchText(text);
  };

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
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className="flex-[1] items-center bg-[#EDF1D6] h-screen"
    >
      <View className="w-[95%] mt-10">
        <TopTitleMenu title={"Klinik Hewan"} />

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
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View className="border border-gray-600 flex-row justify-between rounded-full items-center mb-5">
                <TextInput
                  placeholder="Search"
                  onChangeText={setText} // Update text immediately on change
                  value={text} // Controlled input for user input
                  className="w-[70%] py-4 ml-8"
                  enterKeyHint="search"
                  onSubmitEditing={handleSearch}
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
          {isLoading ? (
            <View className="flex items-center justify-center w-full h-full bg-[#EDF1D6]">
              <ActivityIndicator size={80} color="#609966" />
            </View>
          ) : data && data.length > 0 ? (
            data.map((item) => (
              <SakitKlinikLengkap key={item.id} data={item} index={item.id} />
            ))
          ) : (
            <View className="flex items-center justify-center w-full h-full bg-[#EDF1D6]">
              <Text className="text-lg font-semibold text-gray-500">
                Klinik tidak ditemukan
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

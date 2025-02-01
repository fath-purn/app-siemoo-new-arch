import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SakitUpload from "../../components/SakitUpload";
import TopTitleMenu from "../../components/TopTitleMenu";

export default function Artikel() {
  const insets = useSafeAreaInsets();

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

        <ScrollView className="flex-auto h-[80%]">
          <Text>Haii</Text>
        <View className="pb-[100px]"></View>
        </ScrollView>

      </View>
    </SafeAreaView>
  );
};

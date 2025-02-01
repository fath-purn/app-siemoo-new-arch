import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { styles } from "../utils/global.utils";

export default function SakitBanner({ sakit, index }) {
  SakitBanner.displayName = 'SakitBanner';
  const navigation = useNavigation();

  const handlerNavigate = (id) => {
    navigation.navigate("HasilDeteksiSakit-screen", { id: id });
  };


  return (
    <TouchableOpacity
      className="w-full rounded-xl bg-white px-8 py-6 mb-4"
      style={[styles.shadow]}
      key={sakit.id}
      onPress={() => handlerNavigate(sakit.id)}
    >
      <View className="flex flex-row justify-between">
        <View className="w-[70%]">
          <Text className="text-2xl font-semibold leading-7 tracking-wide text-[#40513B] mb-1">
            {sakit.penyakit}
          </Text>
          <Text
            className="text-sm font-medium leading-5 tracking-wide text-[#333333]"
            numberOfLines={2}
          >
            {sakit.saran}
          </Text>
        </View>
        <View className="flex items-center bottom-4 left-5 w-[30%]">
          <AnimatedCircularProgress
            size={80}
            width={6}
            fill={sakit.akurasi}
            tintColor="#166534"
            padding={10}
            rotation={0}
            lineCap="round"
          >
            {(fill) => (
              <Text className="text-base font-semibold leading-6 tracking-wide text-[#333333]">
                {Math.round((100 * sakit.akurasi) / 100)}%
              </Text>
            )}
          </AnimatedCircularProgress>
          <Text className="text-base font-medium leading-6 tracking-wide text-[#333333] bottom-2">
            Akurasi
          </Text>
        </View>
      </View>
      <Text className="text-base font-semibold leading-6 tracking-wide text-[#333333] text-right mt-0">
        {sakit.created}
      </Text>
    </TouchableOpacity>
  );
};

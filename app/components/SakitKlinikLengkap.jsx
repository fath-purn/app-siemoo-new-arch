import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableHighlight, View } from "react-native";
import { styles } from "../utils/global.utils";

export default function SakitKlinikLengkap({data, index}) {
  SakitKlinikLengkap.displayName = 'SakitKlinikLengkap';
  const navigation = useNavigation();

  const handlerNavigate = (id) => {
    navigation.navigate("KlinikDeskripsi-screen", {id: id});
  };

  return (
    <View
      className="flex-row justify-between rounded-lg p-6 mb-4 bg-white"
      style={[styles.shadow]}
      key={data.id}
    >
      {/* Keterangan */}
      <View className="w-[80%]">
        <Text className="text-base font-semibold leading-7 tracking-wide text-[#40513B] mb-1">
          {data.nama}
        </Text>
        <Text className="text-sm font-medium leading-5 tracking-wide text-[#333333]" numberOfLines={3}>{data.alamat}</Text>
        <Text className="text-sm font-medium leading-5 tracking-wide text-[#333333]">{data.telepon}</Text>
      </View>
      {/* Icon */}
      <View className="w-[20%] flex items-end justify-center">
        <TouchableHighlight
          className="p-1 bg-[#40513B] rounded-full"
          onPress={() => handlerNavigate(data.id)}
          style={[styles.shadow]}
        >
          <MaterialCommunityIcons
            name={"menu-right"}
            size={30}
            color="#EDF1D6"
          />
        </TouchableHighlight>
      </View>
    </View>
  );
};

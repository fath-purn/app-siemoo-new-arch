import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../utils/global.utils";

export default function SakitUpload(props) {
  SakitUpload.displayName = 'SakitUpload';
  const navigation = useNavigation();

  const handlerNavigate = (tujuan) => {
    navigation.navigate(tujuan);
  };
  return (
    <View className="w-full absolute bottom-0 z-50">
      <TouchableOpacity
        className="rounded-xl w-full flex flex-row items-center justify-center h-[80px] bg-[#166534]"
        style={[styles.shadow]}
        onPress={() => handlerNavigate("AmbilGambar-screen")}
      >
        <Text className="text-2xl font-semibold leading-7 tracking-widest text-white mr-10">
          Unggah Foto
        </Text>
        <MaterialCommunityIcons
          name={"upload"}
          size={50}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
};
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../utils/global.utils";

export default function TopTitleMenu({ title }) {
  TopTitleMenu.displayName = 'TopTitleMenu';
  const navigation = useNavigation();
  return (
    <>
      <View className="ml-5 h-[10%]">
        <View className="flex items-start">
          <TouchableOpacity
            className="mb-5 p-1 bg-[#40513B] rounded-full"
            onPress={() => navigation.goBack()}
            style={[styles.shadow]}
          >
            <MaterialCommunityIcons
              name={"menu-left"}
              size={30}
              color="#EDF1D6"
            />
          </TouchableOpacity>
        </View>
      </View>
      <Text className="mb-5 text-center font-bold text-2xl">{title}</Text>
    </>
  );
};

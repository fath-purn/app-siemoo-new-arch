import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../utils/global.utils';

export default function MenuHome({menuKanan, menuKiri}) {
  MenuHome.displayName = 'MenuHome';
  const navigation = useNavigation();

  const handlerNavigate = tujuan => {
    navigation.navigate(tujuan);
  };

  return (
    <View className="my-5 flex-row justify-center w-full gap-3">
      <View className="max-w-[50%] min-w-[48%] min gap-2">
        {menuKiri.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="rounded-lg mb-1 bg-white flex items-center"
            style={[styles.shadow]}
            onPress={() => handlerNavigate(item.navigate)}>
            <View className="w-[90%] my-5 flex-row items-center gap-2">
              <MaterialCommunityIcons
                name={item.icon}
                size={30}
                color="#40513B"
              />
              <Text className="w-[80%] font-semibold">{item.nama}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View className="max-w-[50%] min-w-[48%] gap-2">
        {menuKanan.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="rounded-lg mb-1 bg-white flex items-center"
            style={[styles.shadow]}
            onPress={() => handlerNavigate(item.navigate)}>
            <View className="w-[90%] my-5 flex-row items-center gap-2">
              <MaterialCommunityIcons
                name={item.icon}
                size={30}
                color="#40513B"
              />
              <Text className="w-[80%] font-semibold">{item.nama}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

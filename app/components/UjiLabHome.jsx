import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../utils/global.utils';

export default function UjiLabHome({data, home, index}) {
  UjiLabHome.displayName = 'UjiLabHome';
  const navigation = useNavigation();

  const handlerNavigate = () => {
    navigation.navigate('Lab-screen');
  };

  return (
    <View>
      {home ? (
        <TouchableOpacity
          className="bg-green-800 rounded-lg"
          style={[styles.shadow]}
          onPress={() => handlerNavigate()}
          key={data.id}>
          <View className="my-5 items-center flex">
            <View className="w-[80%] flex">
              <View className="flex-row items-start gap-3">
                <View
                  className="mt-2 p-2 rounded-full bg-[#EDF1D6]"
                  style={[styles.shadow]}>
                  <MaterialCommunityIcons
                    name={'cow'}
                    size={30}
                    color="#166534"
                  />
                </View>
                <View className="w-[78%]">
                  <Text className="text-lg font-semibold text-[#40513B]">
                    <Text className="text-[rgb(237,241,214)] text-lg font-semibold">
                      {data.hasil
                        ? data.hasil.startsWith('Sangat')
                          ? data.hasil.replace('Sangat', 'Sangat ')
                          : data.hasil
                        : 'Data pengujian tidak ditemukan'}
                    </Text>
                  </Text>
                  <Text className="text-[#EDF1D6]">{data.message}</Text>
                </View>
              </View>
              <View className="flex items-end w-full mt-3">
                <Text className="text-[#EDF1D6]">{data.created}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ) : ( 
        <View
          className="bg-green-800 rounded-lg mb-3"
          style={[styles.shadow]}
          key={index}>
          <View className="my-5 items-center flex">
            <View className="w-[80%] flex">
              <View className="flex-row items-center gap-3">
                <View
                  className="mt-2 p-2 rounded-full bg-[#EDF1D6]"
                  style={[styles.shadow]}>
                  <MaterialCommunityIcons
                    name={'cow'}
                    size={30}
                    color="#166534"
                  />
                </View>
                <View className="w-[78%] flex-row justify-between items-center">
                  <Text className="text-[#EDF1D6] text-lg font-semibold">
                    {data.hasil
                      ? data.hasil.startsWith('Sangat')
                        ? data.hasil.replace('Sangat', 'Sangat ')
                        : data.hasil
                      : 'Data pengujian tidak ditemukan'}
                  </Text>
                  {/* <Text className="text-[#EDF1D6]">{data.message}</Text> */}
                  <Text className="text-[#EDF1D6]">{data.created}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
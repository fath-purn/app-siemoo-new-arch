import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';

export default function ErrorHandler() {
  ErrorHandler.displayName = 'ErrorHandler';
  return (
    <ScrollView className="h-[80%] ">
      <View className="flex items-center justify-center mt-[10%]">
        <View className="border-[5px] border-red-500 rounded-full p-2">
          <MaterialCommunityIcons name={'close-thick'} size={60} color="red" />
        </View>
        <Text className="text-lg font-semibold text-[#40513B] text-center mt-5">
          No data available
        </Text>
      </View>
    </ScrollView>
  );
};

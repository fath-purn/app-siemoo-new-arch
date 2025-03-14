import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import { useContext, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from "../../Authorize/AuthProvider";

import HomeLogo from "../../assets/HomeLogo.png";
import IconEmail from "../../assets/IconEmail.png";
import IconPassword from "../../assets/IconPassword.png";
import ErrorNotification from "../components/ErrorNotification";

function Home() {
  const { registerLoginAuth } = useContext(AuthContext);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securePassword, setSecurePassword] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [messageError, setMessageError] = useState("Register Anda Gagal");
  const [isLoading, setIsLoading] = useState(false);

  // Handler Login
  const handlerLogin = async () => {
    if (email === "" || password === "") {
      setModalVisible(true);
    } else {
      try {
        setIsLoading(true);
        setModalVisible(false);
        
        // handle untuk api sekalian token
        const response = await axios.post('https://siemoo.vercel.app/api/v1/user/login', {
          email: email,
          password: password,
        });

        registerLoginAuth(response.data.data.token);
        setIsLoading(false);
      } catch (error) {
        setModalVisible(true);
        setMessageError('Error: ' + JSON.stringify(error.response.data.err, null, 2));
        setIsLoading(false);
      }
    }
  };

  const handlerNavigate = (tujuan) => {
    navigation.navigate(tujuan);
  };

  return (

    <SafeAreaView
      style={{
        // Paddings to handle safe area
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className="flex-[1]"
    >
      {/* Notification error login */}
      {modalVisible && <ErrorNotification messageError={messageError} />}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Menghapus behavior pada Android
        // keyboardVerticalOffset={Platform.OS === "ios" ? 100 : -130} // Mengatur offset berdasarkan platform
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="bg-[#EDF1D6] w-screen h-screen flex justify-center items-center" style={{ flex: 1 }}>
            {/* Image Login Screen */}
            <Image source={HomeLogo} className="h-[70px] w-[90%] bottom-[10%]" />
            <View className="w-[73%] ">
              <Text className="text-[#40513B] text-[36px] my-3 leading-[45px] ">
                Login
              </Text>

              {/* Input Email dan Password */}
              <View className="flex flex-row items-center gap-3 ">
                <Image source={IconEmail} className="bottom-[5px]" />
                <TextInput
                  placeholder="Email ID"
                  className={
                    modalVisible
                      ? "mb-4 divide-y-4 w-[85%] divide-slate-400/25 border-b-[1px] h-12 border-[#C62525]"
                      : "mb-4 divide-y-4 w-[85%] divide-slate-400/25 border-b-[1px] h-12 border-[#9DC08B]"
                  } // Mengubah warna placeholder
                  onChangeText={(text) => setEmail(text)}
                  value={email}
                  editable={!isLoading}
                />
              </View>
              <View className="flex flex-row items-center gap-3 ">
                <Image source={IconPassword} className="bottom-[5px]" />
                <View
                  className={
                    modalVisible
                      ? "flex flex-row justify-between items-center mb-4  w-[85%] border-b-[1px] h-12 border-[#C62525]"
                      : "flex flex-row justify-between items-center mb-4 w-[85%] border-b-[1px] h-12 border-[#9DC08B]"
                  }
                >
                  <TextInput
                    placeholder="Password"
                    className="w-[88%]"
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry={securePassword}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    className="border-none"
                    onPress={() => setSecurePassword(!securePassword)}
                  >
                    <MaterialCommunityIcons
                      name={securePassword ? "eye-off" : "eye"}
                      size={30}
                      color="#9DC08B"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Tombol Login pengguna */}
            <View className="w-[80%] mt-10">
              <View className="flex flex-row justify-end">
                {/* <Text className="text-[#40513B] text-[10px] mb-4 leading-[12.5px] ">
                  <Link to="/HomeScreen">Forgot Password?</Link>
                </Text> */}
              </View>
              <TouchableOpacity
                className="flex items-center justify-center h-[50px] rounded-full bg-[#40513B]"
                onPress={() => handlerLogin()}
                disabled={isLoading}
              >
                <Text className="text-[#EDF1D6] text-[18px] leading-[22.5px] ">
                  {isLoading ? "Loading..." : "Login"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tombol Daftar */}
            <View className="w-[80%] mt-4">
              <View className="flex flex-row justify-center gap-1">
                <Text className="text-[#609966] text-[16px] leading-[15.5px] ">
                  Belum punya akun?
                </Text>
                <TouchableOpacity onPress={() => handlerNavigate("Register-screen")}>
                  <Text className="text-[#40513B] text-[16px] leading-[15.5px]  ml-2">
                    Daftar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default Home;
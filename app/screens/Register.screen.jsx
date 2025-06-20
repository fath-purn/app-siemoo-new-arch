import { MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import clsx from "clsx";
import { useState } from "react";
import {
  ActivityIndicator,
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
import { Dropdown } from "react-native-element-dropdown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import { styles } from "../utils/global.utils";

// image
import HomeLogo from "../../assets/HomeLogo.png";
import IconEmail from "../../assets/IconEmail.png";
import IconPassword from "../../assets/IconPassword.png";
import ErrorNotification from "../components/ErrorNotification";

const fetchData = async (value) => {
  const headers = {
    Authorization: `Bearer ${value}`,
  };

  const response = await axios.get(
    "https://siemoo.vercel.app/api/v1/kelompok",
    { headers }
  );

  return response.data.data;
};

export default function Register() {
  Register.displayName = "Register";
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [sapi, setSapi] = useState();
  const [no_wa, setNo_wa] = useState("");
  const [RT, setRT] = useState("");
  const [RW, setRW] = useState("");
  const [id_kelompok, setId_kelompok] = useState();
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [securePassword1, setSecurePassword1] = useState(true);
  const [securePassword2, setSecurePassword2] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [messageError, setMessageError] = useState("Register Anda Gagal");
  const [loading, setLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const navigation = useNavigation();

  // panggil data kelompok tani dari API
  const { data, isLoading, isError, error } = useQuery(
    "dataKelompok",
    async () => {
      const value = await AsyncStorage.getItem("@data/user");
      const responseData = await fetchData(value);

      const parsedData = responseData.map((item) => ({
        label: item.nama,
        value: String(item.id),
      }));

      return parsedData;
    }
  );

  if (isLoading) {
    return (
      <View className="flex items-center justify-center w-screen h-screen bg-[#EDF1D6]">
        <ActivityIndicator size={80} color="#609966" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex items-center justify-center w-screen h-screen bg-[#EDF1D6]">
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  // panggil data kelompok tani dari API
  const roleUser = [
    { label: "Pembeli", value: "pembeli" },
    { label: "Peternak", value: "peternak" },
  ];

  const renderLabel = () => {
    if (id_kelompok || isFocus) {
      return (
        <Text
          className={clsx(
            "absolute",
            "left-[22px]",
            "top-[-10px]",
            "z-50",
            "px-2",
            "text-sm",
            "bg-[#EDF1D6]",
            "text-[#40513B]",
            {
              "text-blue-500": isFocus,
            }
          )}
        >
          Kelompok tani
        </Text>
      );
    }
    return null;
  };

  const renderLabelRole = () => {
    if (role || isFocus) {
      return (
        <Text
          className={clsx(
            "absolute",
            "left-[22px]",
            "top-[-10px]",
            "z-50",
            "px-2",
            "text-sm",
            "bg-[#EDF1D6]",
            "text-[#40513B]",
            {
              "text-blue-500": isFocus,
            }
          )}
        >
          Tipe pengguna
        </Text>
      );
    }
    return null;
  };

  const handlerRegister = async () => {
    if (email === "" || password === "") {
      setModalVisible(true);
    } else {
      if (password !== password2) {
        setMessageError("Password tidak sama");
        setModalVisible(true);
      } else {
        try {
          setLoading(true);
          setModalVisible(false);

          // handle untuk api sekalian token
          await axios.post(
            "https://siemoo.vercel.app/api/v1/user/register",
            {
              email: email,
              password: password,
              fullname: fullname,
              sapi: Number(sapi),
              no_wa: no_wa,
              rt: RT,
              rw: RW,
              id_kelompok: Number(id_kelompok),
              role: role,
            }
          );
          navigation.navigate("Login-screen");
          setLoading(false);
        } catch (error) {
          setModalVisible(true);

          if (error.response) {
            // Server memberikan respons error (misalnya status 400, 401, dll.)
            alert("Error: " + JSON.stringify(error.response.data, null, 2));
            setLoading(false);
            // setMessageError('Error: ' + JSON.stringify(error.response.data.err, null, 2))
          } else if (error.request) {
            // Tidak ada respons dari server (mungkin server tidak mengembalikan response)
            alert("Tidak ada respons dari server");
            setLoading(false);
          } else {
            // Kesalahan lain (misalnya error di kode JavaScript)
            alert("Terjadi kesalahan: " + error.message);
            setLoading(false);
          }
        }
      }
    }
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
      className="flex-[1] w-screen bg-[#EDF1D6]"
    >
      <KeyboardAwareScrollView>
        {/* Notification error login */}
        {modalVisible && <ErrorNotification messageError={messageError} />}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "position"} // Menghapus behavior pada Android
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : -300} // Mengatur offset berdasarkan platform
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              className=" pt-10 pb-3 flex justify-center items-center"
              style={{ flex: 1 }}
            >
              {/* Image Login Screen */}
              <Image source={HomeLogo} className="h-[70px] w-[90%]" />
              <View className="w-[73%]">
                <Text className="text-[#40513B] text-[36px] my-3 leading-[45px] ">
                  Daftar
                </Text>

                {/* Input Email */}
                <View className="flex flex-row items-center gap-3 ">
                  <Image source={IconEmail} className="bottom-[5px]" />
                  <TextInput
                    placeholder="Email ID"
                    className="mb-4 divide-y-4 w-[85%] divide-slate-400/25 border-b-[1px] h-12 border-[#9DC08B]"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    editable={!loading}
                  />
                </View>

                {/* Input Fullname */}
                <View className="flex flex-row items-center gap-3 ">
                  <MaterialCommunityIcons
                    name={"account"}
                    size={25}
                    color="#9DC08B"
                    className="bottom-[5px]"
                  />
                  <TextInput
                    placeholder="Fullname"
                    className="mb-4 divide-y-4 w-[85%] divide-slate-400/25 border-b-[1px] h-12 border-[#9DC08B]"
                    onChangeText={(text) => setFullname(text)}
                    value={fullname}
                    editable={!loading}
                  />
                </View>
                {/* Input sapi */}
                <View className="flex flex-row items-center gap-3 ">
                  <MaterialCommunityIcons
                    name={"cow"}
                    size={25}
                    color="#9DC08B"
                    className="bottom-[5px]"
                  />
                  <TextInput
                    placeholder="Jumlah sapi"
                    className="mb-4 divide-y-4 w-[85%] divide-slate-400/25 border-b-[1px] h-12 border-[#9DC08B]"
                    onChangeText={(text) => setSapi(Number(text))}
                    value={sapi}
                    editable={!loading}
                    keyboardType="number-pad"
                  />
                </View>

                {/* Input no_wa */}
                <View className="flex flex-row items-center gap-3 ">
                  <MaterialCommunityIcons
                    name={"phone"}
                    size={25}
                    color="#9DC08B"
                    className="bottom-[5px]"
                  />
                  <TextInput
                    placeholder="No whatsApps"
                    className="mb-4 divide-y-4 w-[85%] divide-slate-400/25 border-b-[1px] h-12 border-[#9DC08B]"
                    onChangeText={(text) => setNo_wa(text)}
                    value={no_wa}
                    editable={!loading}
                    keyboardType="number-pad"
                  />
                </View>

                {/* Input Rt */}
                <View className="flex flex-row items-center gap-3 ">
                  <MaterialCommunityIcons
                    name={"map-marker-outline"}
                    size={25}
                    color="#9DC08B"
                    className="bottom-[5px]"
                  />
                  <TextInput
                    placeholder="RT"
                    className="mb-4 divide-y-4 w-[85%] divide-slate-400/25 border-b-[1px] h-12 border-[#9DC08B]"
                    onChangeText={(text) => setRT(text)}
                    value={RT}
                    editable={!loading}
                    keyboardType="number-pad"
                  />
                </View>

                {/* Input RW */}
                <View className="flex flex-row items-center gap-3 ">
                  <MaterialCommunityIcons
                    name={"map-marker-outline"}
                    size={25}
                    color="#9DC08B"
                    className="bottom-[5px]"
                  />
                  <TextInput
                    placeholder="RW"
                    className="mb-4 divide-y-4 w-[85%] divide-slate-400/25 border-b-[1px] h-12 border-[#9DC08B]"
                    onChangeText={(text) => setRW(text)}
                    value={RW}
                    editable={!loading}
                    keyboardType="number-pad"
                  />
                </View>

                {/* Input Id Kelompok */}
                <View className="my-1">
                  {renderLabel()}
                  <Dropdown
                    className={clsx(
                      "h-[50px] border-[#9DC08B] border-[0.5px] rounded-lg px-2",
                      {
                        "border-blue-500": isFocus,
                      }
                    )}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={data}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? "Select item" : "..."}
                    searchPlaceholder="Search..."
                    value={id_kelompok}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={(item) => {
                      setId_kelompok(Number(item.value));
                      setIsFocus(false);
                    }}
                    renderLeftIcon={() => (
                      <AntDesign
                        style={styles.icon}
                        color={isFocus ? "blue" : "#40513B"}
                        name="Safety"
                        size={20}
                      />
                    )}
                  />
                </View>

                {/* Input Role */}
                <View className="mb-1 mt-4">
                  {renderLabelRole()}
                  <Dropdown
                    className={clsx(
                      "h-[50px] border-[#9DC08B] border-[0.5px] rounded-lg px-2",
                      {
                        "border-blue-500": isFocus,
                      }
                    )}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={roleUser}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? "Select item" : "..."}
                    searchPlaceholder="Search..."
                    value={role}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={(item) => {
                      setRole(item.value);
                      setIsFocus(false);
                    }}
                    renderLeftIcon={() => (
                      <AntDesign
                        style={styles.icon}
                        color={isFocus ? "blue" : "#40513B"}
                        name="Safety"
                        size={20}
                      />
                    )}
                  />
                </View>

                {/* Password 1 */}
                <View className="flex flex-row items-center gap-3 ">
                  <Image source={IconPassword} className="bottom-[5px]" />
                  <View className="flex flex-row justify-between items-center mb-4 w-[85%] border-b-[1px] h-12 border-[#9DC08B]">
                    <TextInput
                      placeholder="Password"
                      className="w-[88%]"
                      onChangeText={(text) => setPassword(text)}
                      value={password}
                      secureTextEntry={securePassword1}
                      editable={!loading}
                    />
                    <TouchableOpacity
                      className="border-none"
                      onPress={() => setSecurePassword1(!securePassword1)}
                    >
                      <MaterialCommunityIcons
                        name={securePassword1 ? "eye-off" : "eye"}
                        size={30}
                        color="#9DC08B"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                {/* Password 2 */}
                <View className="flex flex-row items-center gap-3 ">
                  <Image source={IconPassword} className="bottom-[5px]" />
                  <View className="flex flex-row justify-between items-center mb-4 w-[85%] border-b-[1px] h-12 border-[#9DC08B]">
                    <TextInput
                      placeholder="Password"
                      className="w-[88%]"
                      onChangeText={(text) => setPassword2(text)}
                      value={password2}
                      secureTextEntry={securePassword2}
                      editable={!loading}
                    />
                    <TouchableOpacity
                      className="border-none"
                      onPress={() => setSecurePassword2(!securePassword2)}
                    >
                      <MaterialCommunityIcons
                        name={securePassword2 ? "eye-off" : "eye"}
                        size={30}
                        color="#9DC08B"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Tombol Register pengguna */}
              <View className="w-[80%]">
                <TouchableOpacity
                  className="flex items-center justify-center h-[50px] rounded-full bg-[#40513B]"
                  onPress={() => handlerRegister()}
                  disabled={loading}
                >
                  <Text className="text-[#EDF1D6] text-[18px] leading-[22.5px] ">
                    {loading ? "Loading..." : "Daftar"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Tombol Daftar */}
              <View className="w-[80%] mt-4">
                <View className="flex flex-row justify-center gap-1">
                  <Text className="text-[#609966] text-[16px] leading-[15.5px] ">
                    Sudah punya akun?
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Login-screen")}
                  >
                    <Text className="text-[#40513B] text-[16px] leading-[15.5px]  ml-2">
                      Masuk
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

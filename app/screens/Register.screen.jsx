import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useState, useContext} from 'react';
import {Link} from '@react-navigation/native';
import clsx from 'clsx';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { AuthContext } from '../../Authorize/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useQuery} from 'react-query';
import axios from 'axios';
import { styles } from '../utils/global.utils';

// image
import HomeLogo from '../../assets/HomeLogo.png';
import IconEmail from '../../assets/IconEmail.png';
import IconPassword from '../../assets/IconPassword.png';
import ErrorNotification from '../components/ErrorNotification';

const fetchData = async value => {
  const headers = {
    Authorization: `Bearer ${value}`,
  };

  const response = await axios.get(
    'https://siemoo.vercel.app/api/v1/kelompok',
    {headers},
  );

  return response.data.data;
};

export default RegisterInputScreen = ({navigation}) => {
  const { registerLoginAuth } = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [sapi, setSapi] = useState();
  const [no_wa, setNo_wa] = useState('');
  const [RT, setRT] = useState('');
  const [RW, setRW] = useState('');
  const [id_kelompok, setId_kelompok] = useState();
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [securePassword1, setSecurePassword1] = useState(true);
  const [securePassword2, setSecurePassword2] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [messageError, setMessageError] = useState('Register Anda Gagal');
  const [loading, setLoading] = useState(false);

  const [isFocus, setIsFocus] = useState(false);

  // panggil data kelompok tani dari API
  const {data, isLoading, isError, error} = useQuery(
    'dataKelompok',
    async () => {
      const value = await AsyncStorage.getItem('@data/user');
      const responseData  = await fetchData(value);

      const parsedData = responseData.map(item => ({
        label: item.nama,
        value: String(item.id)
      }));

      return parsedData;
    },
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
    {label: 'Pembeli', value: 'pembeli'},
    {label: 'Peternak', value: 'peternak'},
  ];

  const renderLabel = () => {
    if (id_kelompok || isFocus) {
      return (
        <Text
          className={clsx(
            'absolute',
            'left-[22px]',
            'top-[-10px]',
            'z-50',
            'px-2',
            'text-sm',
            'bg-[#EDF1D6]',
            'text-[#40513B]',
            {
              'text-blue-500': isFocus,
            },
          )}>
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
            'absolute',
            'left-[22px]',
            'top-[-10px]',
            'z-50',
            'px-2',
            'text-sm',
            'bg-[#EDF1D6]',
            'text-[#40513B]',
            {
              'text-blue-500': isFocus,
            },
          )}>
          Tipe pengguna
        </Text>
      );
    }
    return null;
  };

  // Handler Login
  const handlerRegister = async () => {
    if (email === '' || password === '') {
      setModalVisible(true);
    } else {
      if (password !== password2) {
        setMessageError('Password tidak sama');
        setModalVisible(true);
      } else {
        let response = null;
        try {
          setLoading(true);
          setModalVisible(false);

          // handle untuk api sekalian token
        response = await axios.post('https://siemoo.vercel.app/api/v1/user/register', {
          email: email,
          password: password,
          fullname: fullname,
          sapi: Number(sapi),
          no_wa: no_wa,
          rt: RT,
          rw: RW,
          id_kelompok: Number(id_kelompok),
          role: role,
        });

        // console.log(response, 'atas')

        navigation.navigate('Login-screen');
        setLoading(false);
        } catch (error) {
          setModalVisible(true);
          console.log({email: email,
            password: password,
            fullname: fullname,
            sapi: Number(sapi),
            no_wa: no_wa,
            rt: RT,
            rw: RW,
            id_kelompok: Number(id_kelompok),
            role: role,}, 'bawah')
          console.log(error.message, 'bedalagi')
          setMessageError(response.data.err);
          setLoading(false);
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
      className="flex-[1] w-screen bg-[#EDF1D6]">
      <KeyboardAwareScrollView>
        {/* Notification error login */}
        {modalVisible && <ErrorNotification messageError={messageError} />}
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'position'} // Menghapus behavior pada Android
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : -300} // Mengatur offset berdasarkan platform
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className=" pt-10 pb-3 flex justify-center items-center" style={{ flex: 1 }}>
              {/* Image Login Screen */}
              <Image source={HomeLogo} className="h-[70px] w-[90%]" />
              <View className="w-[73%]">
                <Text className="text-[#40513B] text-[36px] my-3 leading-[45px] ">
                  Register
                </Text>

                {/* Input Email */}
                <View className="flex flex-row items-center gap-3 ">
                  <Image source={IconEmail} className="bottom-[5px]" />
                  <TextInput
                    placeholder="Email ID"
                    className={
                      modalVisible
                        ? 'mb-4 divide-y-4 w-[85%] divide-slate-400/25 border-b-[1px] h-12 border-[#C62525]'
                        : 'mb-4 divide-y-4 w-[85%] divide-slate-400/25 border-b-[1px] h-12 border-[#9DC08B]'
                    } // Mengubah warna placeholder
                    onChangeText={text => setEmail(text)}
                    value={email}
                    editable={!loading}
                  />
                </View>

                {/* Input Fullname */}
                <View className="flex flex-row items-center gap-3 ">
                  <MaterialCommunityIcons
                    name={'account'}
                    size={25}
                    color="#9DC08B"
                    className="bottom-[5px]"
                  />
                  <TextInput
                    placeholder="Fullname"
                    className={
                      modalVisible
                        ? 'mb-4 divide-y-4 w-[85%] divide-slate-400/25 border-b-[1px] h-12 border-[#C62525]'
                        : 'mb-4 divide-y-4 w-[85%] divide-slate-400/25 border-b-[1px] h-12 border-[#9DC08B]'
                    } // Mengubah warna placeholder
                    onChangeText={text => setFullname(text)}
                    value={fullname}
                    editable={!loading}
                  />
                </View>
                {/* Input sapi */}
                <View className="flex flex-row items-center gap-3 ">
                  <MaterialCommunityIcons
                    name={'cow'}
                    size={25}
                    color="#9DC08B"
                    className="bottom-[5px]"
                  />
                  <TextInput
                    placeholder="Jumlah sapi"
                    className={
                      modalVisible
                        ? 'mb-4 divide-y-4 w-[85%] divide-slate-400/25 border-b-[1px] h-12 border-[#C62525]'
                        : 'mb-4 divide-y-4 w-[85%] divide-slate-400/25 border-b-[1px] h-12 border-[#9DC08B]'
                    } // Mengubah warna placeholder
                    onChangeText={text => setSapi(Number(text))}
                    value={sapi}
                    editable={!loading}
                    keyboardType='number-pad'
                  />
                </View>

                {/* Input no_wa */}
                <View className="flex flex-row items-center gap-3 ">
                  <MaterialCommunityIcons
                    name={'phone'}
                    size={25}
                    color="#9DC08B"
                    className="bottom-[5px]"
                  />
                  <TextInput
                    placeholder="No whatsApps"
                    className={
                      modalVisible
                        ? 'mb-4 divide-y-4 w-[85%] divide-slate-400/25 border-b-[1px] h-12 border-[#C62525]'
                        : 'mb-4 divide-y-4 w-[85%] divide-slate-400/25 border-b-[1px] h-12 border-[#9DC08B]'
                    } // Mengubah warna placeholder
                    onChangeText={text => setNo_wa(text)}
                    value={no_wa}
                    editable={!loading}
                    keyboardType='number-pad'
                  />
                </View>

                {/* Input Rt */}
                <View className="flex flex-row items-center gap-3 ">
                  <MaterialCommunityIcons
                    name={'map-marker-outline'}
                    size={25}
                    color="#9DC08B"
                    className="bottom-[5px]"
                  />
                  <TextInput
                    placeholder="RT"
                    className={
                      modalVisible
                        ? 'mb-4 divide-y-4 w-[85%] divide-slate-400/25 border-b-[1px] h-12 border-[#C62525]'
                        : 'mb-4 divide-y-4 w-[85%] divide-slate-400/25 border-b-[1px] h-12 border-[#9DC08B]'
                    } // Mengubah warna placeholder
                    onChangeText={text => setRT(text)}
                    value={RT}
                    editable={!loading}
                    keyboardType='number-pad'
                  />
                </View>

                {/* Input RW */}
                <View className="flex flex-row items-center gap-3 ">
                  <MaterialCommunityIcons
                    name={'map-marker-outline'}
                    size={25}
                    color="#9DC08B"
                    className="bottom-[5px]"
                  />
                  <TextInput
                    placeholder="RW"
                    className={
                      modalVisible
                        ? 'mb-4 divide-y-4 w-[85%] divide-slate-400/25 border-b-[1px] h-12 border-[#C62525]'
                        : 'mb-4 divide-y-4 w-[85%] divide-slate-400/25 border-b-[1px] h-12 border-[#9DC08B]'
                    } // Mengubah warna placeholder
                    onChangeText={text => setRW(text)}
                    value={RW}
                    editable={!loading}
                    keyboardType='number-pad'
                  />
                </View>

                {/* Input Id Kelompok */}
                <View className="my-1">
                  {renderLabel()}
                  <Dropdown
                    className={clsx('h-[50px] border-[#9DC08B] border-[0.5px] rounded-lg px-2', {
                      'border-blue-500': isFocus
                    })}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={data}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? 'Select item' : '...'}
                    searchPlaceholder="Search..."
                    value={id_kelompok}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                      setId_kelompok(Number(item.value));
                      setIsFocus(false);
                    }}
                    renderLeftIcon={() => (
                      <AntDesign
                      style={styles.icon}
                        color={isFocus ? 'blue' : '#40513B'}
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
                    className={clsx('h-[50px] border-[#9DC08B] border-[0.5px] rounded-lg px-2', {
                      'border-blue-500': isFocus
                    })}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={roleUser}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? 'Select item' : '...'}
                    searchPlaceholder="Search..."
                    value={role}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                      setRole(item.value);
                      setIsFocus(false);
                    }}
                    renderLeftIcon={() => (
                      <AntDesign
                      style={styles.icon}
                        color={isFocus ? 'blue' : '#40513B'}
                        name="Safety"
                        size={20}
                      />
                    )}
                  />
                </View>

                {/* Password 1 */}
                <View className="flex flex-row items-center gap-3 ">
                  <Image source={IconPassword} className="bottom-[5px]" />
                  <View
                    className={
                      modalVisible
                        ? 'flex flex-row justify-between items-center mb-4  w-[85%] border-b-[1px] h-12 border-[#C62525]'
                        : 'flex flex-row justify-between items-center mb-4 w-[85%] border-b-[1px] h-12 border-[#9DC08B]'
                    }>
                    <TextInput
                      placeholder="Password"
                      className="w-[88%]"
                      onChangeText={text => setPassword(text)}
                      value={password}
                      secureTextEntry={securePassword1}
                      editable={!loading}
                    />
                    <TouchableOpacity
                      className="border-none"
                      onPress={() => setSecurePassword1(!securePassword1)}>
                      <MaterialCommunityIcons
                        name={securePassword1 ? 'eye-off' : 'eye'}
                        size={30}
                        color="#9DC08B"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                {/* Password 2 */}
                <View className="flex flex-row items-center gap-3 ">
                  <Image source={IconPassword} className="bottom-[5px]" />
                  <View
                    className={
                      modalVisible
                        ? 'flex flex-row justify-between items-center mb-4  w-[85%] border-b-[1px] h-12 border-[#C62525]'
                        : 'flex flex-row justify-between items-center mb-4 w-[85%] border-b-[1px] h-12 border-[#9DC08B]'
                    }>
                    <TextInput
                      placeholder="Password"
                      className="w-[88%]"
                      onChangeText={text => setPassword2(text)}
                      value={password2}
                      secureTextEntry={securePassword2}
                      editable={!loading}
                    />
                    <TouchableOpacity
                      className="border-none"
                      onPress={() => setSecurePassword2(!securePassword2)}>
                      <MaterialCommunityIcons
                        name={securePassword2 ? 'eye-off' : 'eye'}
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
                  disabled={loading}>
                  <Text className="text-[#EDF1D6] text-[18px] leading-[22.5px] ">
                    {loading ? 'Loading...' : 'Register'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Tombol Daftar */}
              <View className="w-[80%] mt-4">
                <View className="flex flex-row justify-center gap-1">
                  <Text className="text-[#609966] text-[16px] leading-[15.5px] ">
                    Sudah punya akun?
                  </Text>
                  <Link to="/Login-screen">
                    <Text className="text-[#40513B] text-[16px] leading-[15.5px]  ml-2">
                      Login
                    </Text>
                  </Link>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
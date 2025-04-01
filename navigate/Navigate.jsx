// Third party imports
import { useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';

// Screen imports
import AmbilGambar from "../app/screens/DeteksiSakit/AmbilGambar.screen";
import HasilDeteksiSakit from "../app/screens/DeteksiSakit/HasilDeteksiSakit.screen";
import KlinikList from "../app/screens/DeteksiSakit/KlinikList.screen";
import Login from "../app/screens/Login.screen";
import Register from "../app/screens/Register.screen";

// auth
import { AuthContext } from '../Authorize/AuthProvider';

// screen
import BeriPakanScreen from '../app/screens/BeriPakan.screen';
import Dashboard from '../app/screens/Dashboard.screen';
import ArtikelScreen from '../app/screens/DeteksiSakit/Artikel.screen';
import ArtikelLengkapScreen from '../app/screens/DeteksiSakit/ArtikelLengkap.screen';
import KlinikDeskripsiScreen from '../app/screens/DeteksiSakit/KlinikDeskripsi.screen';
import RiwayatScreen from '../app/screens/DeteksiSakit/Riwayat.screen';
import EdukasiScreen from '../app/screens/Edukasi.screen';
import Lab from '../app/screens/Lab.screen';
import Lapak from '../app/screens/Lapak.screen';
import OlahPanganScreen from '../app/screens/OlahPangan.screen';
import DeteksiSaKitScreen from '../app/screens/Sakit.screen';
import SulapScreen from '../app/screens/Sulap.screen';

const Stack = createNativeStackNavigator();

export default function Navigate() {
  Navigate.displayName = 'Navigate';
  const {userToken, isLoading} = useContext(AuthContext);
  const isFocused = useIsFocused();

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  // akan digunakan setelah menggunakan authcontext dan terkoneksi dengan API
  function Root() {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Dashboard-screen" component={Dashboard} />
        <Stack.Screen
          name="Lab-screen"
          component={Lab}
        />
        <Stack.Screen
          name="Lapak-screen"
          component={Lapak}
        />
        <Stack.Screen
          name="Edukasi-screen"
          component={EdukasiScreen}
        />
        <Stack.Screen
          name="Sulap-screen"
          component={SulapScreen}
        />
        <Stack.Screen
          name="Olah-Pangan-screen"
          component={OlahPanganScreen}
        />
        <Stack.Screen
          name="Beri-Pakan-screen"
          component={BeriPakanScreen}
        />
        <Stack.Screen
          name="Sakit-screen"
          component={DeteksiSaKitScreen}
        />
        <Stack.Screen
          name="AmbilGambar-screen"
          component={AmbilGambar}
        />
        <Stack.Screen
          name="HasilDeteksiSakit-screen"
          component={HasilDeteksiSakit}
        />
        <Stack.Screen
          name="KlinikList-screen"
          component={KlinikList}
        />
        <Stack.Screen
          name="KlinikDeskripsi-screen"
          component={KlinikDeskripsiScreen}
        />
        <Stack.Screen
          name="Riwayat-screen"
          component={RiwayatScreen}
        />
        <Stack.Screen
          name="Artikel-screen"
          component={ArtikelScreen}
        />
        <Stack.Screen
          name="ArtikelLengkap-screen"
          component={ArtikelLengkapScreen}
        />
      </Stack.Navigator>
    );
  }

  // StatusBar.setHidden(true);

  return (
    <>
      {/* akan digunakan setelah menggunakan authcontext dan terkoneksi dengan API */}
      {userToken && isFocused ? (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen
            name="Root"
            component={Root}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      ) : (
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Login-screen">
        {/* <Stack.Screen
          name="GetStartedOneScreen-screen"
          component={GetStartedOneScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="GetStartedTwoScreen-screen"
          component={GetStartedTwoScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="GetStartedThreeScreen-screen"
          component={GetStartedThreeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="GetStartedFourScreen-screen"
          component={GetStartedFourScreen}
          options={{headerShown: false}}
        /> */}
        <Stack.Screen
          name="Login-screen"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register-screen"
          component={Register}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
      )}
    </>
  );
};

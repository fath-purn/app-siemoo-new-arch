import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// 1. Definisikan Base URL di satu tempat. Tidak ada lagi hardcode di setiap fungsi.
const BASE_URL = 'https://siemoo.vercel.app/api/v1';

// 2. Buat instance axios yang bisa kita gunakan kembali
const api = axios.create({
  baseURL: BASE_URL,
});

// 3. (Bagian Ajaib) Gunakan Interceptor untuk Menambahkan Token Secara Otomatis
// Kode ini akan berjalan SETIAP KALI ada permintaan menggunakan 'api'.
// Dia akan mengambil token dari AsyncStorage dan menempelkannya ke header.
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@data/user');
  if (token) {
    // Jika ada token, tambahkan ke header Authorization
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


// 4. Pindahkan fungsi-fungsi API Anda ke sini.
// Perhatikan, kita tidak perlu lagi parameter 'token' karena interceptor sudah menanganinya.
const verifyEmail = (email, otp) => {
  return api.post('/user/verify-email', {
    email: email,
    verificationCode: otp,
  });
};

const resendOTP = (email) => {
  return api.post('/user/resend-otp', {
    email: email,
  });
};


// 5. Export semua fungsi agar bisa digunakan di komponen lain
export default {
  verifyEmail,
  resendOTP,
};
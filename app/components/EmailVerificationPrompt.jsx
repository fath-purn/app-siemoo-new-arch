import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import apiService from '../services/apiService'; // Sesuaikan path jika perlu

// FUNGSI HELPER UNTUK MASKING EMAIL (VERSI BARU)
const maskEmail = (email) => {
  // Jika email tidak valid atau tidak ada, kembalikan string kosong
  if (!email || !email.includes('@')) {
    return '';
  }

  // 1. Pisahkan email menjadi bagian nama dan domain
  const [name, domain] = email.split('@');
  const len = name.length;

  // 2. Tangani kasus jika nama email sangat pendek (agar tidak aneh)
  if (len <= 3) {
    // Jika nama hanya 1 atau 2 huruf (misal: 'me@'), tampilkan apa adanya.
    return `${name}@${domain}`;
  }
  
  if (len === 3) {
    // Jika nama 3 huruf (misal: 'ana@'), samarkan yang tengah saja.
    return `${name.substring(0, 2)}*${name.substring(3)}@${domain}`; // Hasil -> a*a@domain
  }

  // 3. Logika utama: ambil 2 huruf depan, 2 huruf belakang
  const frontChars = name.substring(0, 3);
  const backChars = name.substring(len - 3);
  
  // Hitung berapa banyak asterisk (*) yang dibutuhkan
  const middleStars = '*'.repeat(len - 4); // (panjang total - 2 depan - 2 belakang)

  // 4. Gabungkan semuanya
  return `${frontChars}${middleStars}${backChars}@${domain}`;
};

const EmailVerificationPrompt = ({ userEmail, onSuccess }) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');

  // 1. STATE BARU UNTUK COUNTDOWN
  // Nilai 0 berarti timer tidak aktif.
  const [countdown, setCountdown] = useState(0);

  // 2. LOGIKA TIMER MENGGUNAKAN useEffect
  // 'Effect' ini akan berjalan setiap kali nilai 'countdown' berubah.
  useEffect(() => {
    // Jika countdown 0 atau kurang, hentikan interval
    if (countdown <= 0) return;

    // Buat interval yang akan mengurangi countdown 1 setiap 1000ms (1 detik)
    const intervalId = global.setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1);
    }, 1000);

    // Ini adalah fungsi cleanup yang sangat penting!
    // Ia akan membersihkan interval saat komponen di-unmount atau saat effect berjalan lagi.
    // Ini mencegah kebocoran memori.
    return () => global.clearInterval(intervalId);
  }, [countdown]); // <-- Dependency array, effect ini bergantung pada 'countdown'


  // Fungsi handleVerify sekarang lebih bersih
  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Kode OTP harus 6 digit.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      // Cukup panggil service, tidak perlu pusing dengan token
      await apiService.verifyEmail(userEmail, otp);

      Alert.alert('Sukses', 'Email Anda berhasil diverifikasi!');
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Terjadi kesalahan. Coba lagi.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. MODIFIKASI FUNGSI handleResend
  const handleResend = async () => {
    setIsResending(true);
    setError('');
    try {
      await apiService.resendOTP(userEmail);
      
      Alert.alert('Terkirim', 'Kode verifikasi baru telah dikirim ke email Anda.');

      // Mulai timer countdown setelah berhasil mengirim!
      setCountdown(60); // Atur ke 60 detik

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal mengirim ulang kode.';
      setError(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  // Bagian return (JSX) tidak ada perubahan, karena sudah bagus.
  return (
    <View className="w-full rounded-xl bg-[#609966] px-5 py-6 mb-4 shadow-lg">
      <View className="flex-row items-center mb-2">
        <MaterialCommunityIcons name="email-alert-outline" size={24} color="#EDF1D6" />
        <Text className="ml-2 text-xl font-bold text-white">
          Verifikasi Email Anda
        </Text>
      </View>
      <Text className="text-sm text-[#EDF1D6] mb-4">
        Akun Anda belum aktif. Masukkan 6 digit kode yang kami kirimkan ke <Text className="font-bold">{maskEmail(userEmail)}</Text> untuk mengakses semua fitur.
      </Text>

      <TextInput
        className="bg-white text-center text-lg font-bold rounded-md h-12 w-full mb-3 tracking-[10px]"
        placeholder="------"
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
      />
      
      {error && (
        <Text className="text-yellow-300 text-center mb-3">{error}</Text>
      )}

      <TouchableOpacity
        onPress={handleVerify}
        disabled={isLoading}
        className="bg-[#40513B] w-full py-3 rounded-md items-center justify-center mb-2"
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold text-base">Verifikasi Sekarang</Text>
        )}
      </TouchableOpacity>
      
      {/* 4. PERBARUI TAMPILAN TOMBOL KIRIM ULANG */}
      <TouchableOpacity 
        onPress={handleResend} 
        // Tombol nonaktif jika sedang mengirim ATAU jika countdown masih berjalan
        disabled={isResending || countdown > 0}
      >
          <Text className="text-center text-sm text-[#EDF1D6] underline">
            {isResending 
              ? 'Mengirim ulang...' 
              : countdown > 0 
                ? `Kirim ulang dalam ${countdown} detik` 
                : 'Tidak menerima kode? Kirim ulang'
            }
          </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmailVerificationPrompt;
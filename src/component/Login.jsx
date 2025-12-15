import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "../auth/Firebase";
import Logo from "../img/Logo.png";
import Background from "../img/bglogin.jpg";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setResetMessage("");

    try {
      // Login user
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // Ambil data user dari Firestore
      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists()) {
        const data = snap.data();

        // Simpan role ke localStorage
        localStorage.setItem("role", data.role || "User");
        localStorage.setItem("name", data.name || user.email);
      } else {
        // Jika tidak ada di Firestore, fallback
        localStorage.setItem("role", "User");
        localStorage.setItem("name", user.email);
      }

      // Setelah selesai, arahkan ke beranda
      navigate("/beranda");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("Pengguna tidak ditemukan.");
      } else if (err.code === "auth/wrong-password") {
        setError("Kata sandi salah.");
      } else if (err.code === "auth/invalid-email") {
        setError("Pengguna Tidak Ditemukan");
      } else {
        setError("Gagal Masuk! Periksa nama pengguna dan kata sandi Anda.");
      }
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setResetMessage("");

    if (!email) {
      setError("Masukkan Nama Pengguna Untuk Mengatur Ulang Kata Sandi.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage("Pesan Pengaturan Ulang Kata Sandi Telah Dikirim.");
    } catch (err) {
      setError("Gagal mengirim Pesan pengaturan ulang kata sandi.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[100vh] w-full">
      {/* Bagian Kiri (Gambar Background) */}
      <div
        className="hidden md:block md:w-4/5 h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${Background})` }}
      ></div>

      {/* Bagian Kanan (Form Login) */}
      <div className="flex w-full md:w-1/2 items-center h-[100vh] justify-center bg-[#F5E9D6] px-6 py-10">
        <div className="">
          <div className="flex justify-center items-center">
            <img src={Logo} alt="Logo" className="w-24 sm:w-24 mb-3" />
          </div>

          {/* Card Login */}
          <div className="w-full max-w-md bg-[#4C2C15] p-6 shadow-lg rounded-md">
            {/* Judul */}
            <div className="flex flex-col w-full items-center">
              <div className="relative w-full z-10 mb-6">
                <div className="text-[#F5E9D6] text-center z-10 absolute flex w-full justify-center font-semibold text-2xl">
                  <p className="bg-[#4C2C15] px-3 sm:text-2xl text-lg">Masuk</p>
                </div>
                <div className="absolute top-4 sm:top-5 z-0 w-full">
                  <div className="border-b border-[#F5E9D6]/40 w-full"></div>
                </div>
              </div>
            </div>

            {/* Pesan Error & Reset */}
            {error && (
              <p className="text-[#4C2C15] border border-red-400 bg-[#F5E9D6] rounded text-sm p-2 my-2 text-center font-medium">
                {error}
              </p>
            )}
            {resetMessage && (
              <p className="text-[#2B1200] border border-green-400 bg-[#F5E9D6] rounded text-sm p-2 my-2 text-center font-medium">
                {resetMessage}
              </p>
            )}

            {/* Form Login */}
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              {/* Input Email */}
              <input
                type="email"
                className="w-full p-3 rounded border border-[#D4BFAA] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] text-[#2B1200] bg-[#F5E9D6] placeholder-[#8B5E3C]/70"
                placeholder="Nama Pengguna"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Input Password */}
              <input
                type="password"
                className="w-full p-3 rounded border border-[#D4BFAA] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] text-[#2B1200] bg-[#F5E9D6] placeholder-[#8B5E3C]/70"
                placeholder="Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Tombol Login */}
              <button
                type="submit"
                className="w-full p-3 bg-[#8B5E3C] text-[#F5E9D6] rounded hover:bg-[#A47452] transition font-semibold"
              >
                Masuk
              </button>

              {/* Lupa Kata Sandi */}
              <div className="text-left mt-2">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-[#F5E9D6] hover:text-[#EED2B7] underline transition"
                >
                  Lupa kata sandi?
                </button>
              </div>
            </form>

            {/* Link ke halaman lain */}
            <div className="text-center mt-6">
              <p className="text-[#F5E9D6] text-sm">
                Belum Mempunyai Akun?{" "}
                <Link
                  to={"/daftar"}
                  className="text-[#EED2B7] font-medium hover:underline"
                >
                  Daftar
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

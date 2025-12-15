import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../auth/Firebase";
import { doc, setDoc } from "firebase/firestore";

import Logo from "../img/Logo.png";
import Background from "../img/bgdaftar.jpg";

const Regis = () => {
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validasi sederhana
    if (!nama || !email || !password || !confirmPassword) {
      setError("Semua field wajib diisi.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Kata sandi dan konfirmasi tidak cocok.");
      return;
    }

    try {
      // Register Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase displayName
      await updateProfile(user, { displayName: nama });

      // Simpan data user ke Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        nama: nama,
        email: email,
        role: "User",          // Role default
        createdAt: new Date(), // Optional
      });

      setSuccessMessage("Akun berhasil dibuat! Silakan masuk.");
      setTimeout(() => navigate("/masuk"), 2000);

    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email sudah terdaftar.");
      } else if (err.code === "auth/invalid-email") {
        setError("Format email tidak valid.");
      } else if (err.code === "auth/weak-password") {
        setError("Kata sandi terlalu lemah (minimal 6 karakter).");
      } else {
        setError("Gagal membuat akun. Silakan coba lagi.");
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full">
      {/* GAMBAR BACKGROUND */}
      <div
        className="hidden md:block md:w-4/5 h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${Background})` }}
      ></div>

      {/* CARD FORM */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-[#F5E9D6] px-6 py-10">
        <div className="">
          <div className="flex justify-center items-center">
            <img src={Logo} alt="Logo" className="w-24 sm:w-24 mb-3" />
          </div>

          <div className="w-full max-w-md bg-[#4C2C15] p-6 shadow-lg rounded-md">
            <div className="flex flex-col w-full items-center">
              <div className="relative w-full z-10 mb-6">
                <div className="text-[#F5E9D6] text-center z-10 absolute flex w-full justify-center font-semibold text-2xl">
                  <p className="bg-[#4C2C15] px-3 sm:text-2xl text-lg">Daftar Akun</p>
                </div>
                <div className="absolute top-4 sm:top-5 z-0 w-full">
                  <div className="border-b border-[#F5E9D6]/40 w-full"></div>
                </div>
              </div>
            </div>

            {/* PESAN ERROR */}
            {error && (
              <p className="text-[#4C2C15] border border-red-400 bg-[#F5E9D6] rounded text-sm p-2 my-2 text-center font-medium">
                {error}
              </p>
            )}

            {/* PESAN SUKSES */}
            {successMessage && (
              <p className="text-[#2B1200] border border-green-400 bg-[#F5E9D6] rounded text-sm p-2 my-2 text-center font-medium">
                {successMessage}
              </p>
            )}

            {/* FORM */}
            <form onSubmit={handleRegister} className="mt-6 space-y-4">
              <input
                type="text"
                className="w-full p-3 rounded border border-[#D4BFAA] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] text-[#2B1200] bg-[#F5E9D6] placeholder-[#8B5E3C]/70"
                placeholder="Nama Lengkap"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />

              <input
                type="email"
                className="w-full p-3 rounded border border-[#D4BFAA] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] text-[#2B1200] bg-[#F5E9D6] placeholder-[#8B5E3C]/70"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                className="w-full p-3 rounded border border-[#D4BFAA] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] text-[#2B1200] bg-[#F5E9D6] placeholder-[#8B5E3C]/70"
                placeholder="Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <input
                type="password"
                className="w-full p-3 rounded border border-[#D4BFAA] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] text-[#2B1200] bg-[#F5E9D6] placeholder-[#8B5E3C]/70"
                placeholder="Konfirmasi Kata Sandi"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type="submit"
                className="w-full p-3 bg-[#8B5E3C] text-[#F5E9D6] rounded hover:bg-[#A47452] transition font-semibold"
              >
                Daftar
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-[#F5E9D6] text-sm">
                Sudah Mempunyai Akun?{" "}
                <Link to={"/masuk"} className="text-[#EED2B7] font-medium hover:underline">
                  Masuk
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Regis;

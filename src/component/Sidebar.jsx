import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import logo from "../img/NamaAPk.png";
import { auth, db } from "../auth/Firebase";
import { doc, getDoc } from "firebase/firestore";

const Sidebar = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({ name: "", role: "" });

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/beranda");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role") || "User";
    const name = localStorage.getItem("name") || "";

    setUserData({ name, role });
  }, []);

  // =============================
  // MENU UNTUK ADMIN
  // =============================
  const adminMenu = [
    { label: "Beranda", link: "/beranda" },
    { label: "Diagnosis", link: "/diagnosis" },
    { label: "Daftar Penyakit", link: "/data-penyakit" },
    { label: "Daftar Gejala", link: "/data-gejala" },
    { label: "Rekomendasi Pengobatan", link: "/rekomendasi-pengobatan" },
    { label: "Basis Aturan", link: "/basis-aturan" },
    { label: "Riwayat Diagnosis", link: "/riwayat-diagnosis" },
  ];

  // =============================
  // MENU UNTUK USER
  // =============================
  const userMenu = [
    { label: "Beranda", link: "/beranda" },
    { label: "Diagnosis", link: "/diagnosis" },
    { label: "Riwayat Diagnosis", link: "/riwayat-diagnosis" },
    { label: "Bantuan", link: "/bantuan" },
  ];

  // Tentukan menu berdasarkan role
  const menuToShow = userData.role === "Admin" ? adminMenu : userMenu;

  return (
    <div className="hidden sm:block z-40 bg-[#252525] w-64 px-6 h-[100vh] drop-shadow-lg">
      {/* Logo */}
      <div className="w-full pt-5 flex justify-center">
        <Link to="/beranda">
          <img src={logo} className="w-32" alt="Logo" />
        </Link>
      </div>

      <div className="border-b mt-5 border-gray-600"></div>

      {/* Menu */}
      <div className="mt-6 grid gap-y-5 text-center text-white">
        {menuToShow.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className="hover:text-[#D7BFA8] transition text-sm"
          >
            {item.label}
          </Link>
        ))}

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="hover:text-[#FF8A80] transition text-sm"
        >
          Keluar
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

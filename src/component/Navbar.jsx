import React, { useState } from "react";
import logo from "../img/NamaAPk.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../auth/Firebase";
import { IoIosClose } from "react-icons/io";
import { IoPerson } from "react-icons/io5";

const Navbar = () => {
  const [openSidebar, setOpenSideBar] = useState(false);

  const navigate = useNavigate();
  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/beranda");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <div>
      {/* SIDEBAR MOBILE */}
      <div>
        <div
          id="default-modal"
          tabIndex="-1"
          aria-hidden="true"
          className={`fixed inset-0 flex items-center justify-start z-40 bg-black bg-opacity-60 transition-opacity duration-500 ${
            openSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`absolute z-40 bg-[#252525] w-64 h-[100vh] drop-shadow-lg transform transition-transform duration-500 ${
              openSidebar ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="w-full relative pt-3">

              {/* CLOSE BUTTON */}
              <button
                onClick={() => setOpenSideBar(false)}
                className="absolute top-1 right-2"
              >
                <IoIosClose color="white" size={30} />
              </button>

              {/* LOGO */}
              <Link
                to="/beranda"
                className="text-white rounded-md flex flex-col justify-center items-center w-full mt-4"
              >
                <img src={logo} className="w-28" alt="" />
              </Link>
            </div>

            {/* MENU */}
            <div className="mt-5 grid gap-y-4 text-lg px-5">
              <div className="border-b px-2 border-white w-full"></div>

              <Link
                to="/beranda"
                className="rounded-md text-white flex items-center text-lg w-full text-left"
              >
                Beranda
              </Link>

              <Link
                to="/diagnosis"
                className="rounded-md text-white flex items-center text-lg w-full text-left"
              >
                Diagnosis
              </Link>

              <Link
                to="/riwayat-diagnosis"
                className="rounded-md text-white flex items-center text-lg w-full text-left"
              >
                Riwayat Diagnosis
              </Link>

              <Link
                to="/bantuan"
                className="rounded-md text-white flex items-center text-lg w-full text-left"
              >
                Bantuan
              </Link>

              <button
                onClick={logout}
                className="rounded-md text-white flex items-center text-lg w-full text-left hover:text-red-400 transition"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NAVBAR MOBILE */}
      <div className="sm:hidden bg-[#252525] w-full flex m-0 py-4 z-10 justify-between items-center fixed">
        <div className="flex px-5 justify-between w-full items-center">
          <div className="flex items-center gap-2">
            <button onClick={() => setOpenSideBar(true)}>
              <GiHamburgerMenu color="white" size={20} />
            </button>
            <img src={logo} className="w-28" alt="Logo" />
          </div>

          <div className="text-white flex justify-end items-center gap-2">
            <div className="border flex justify-center items-center rounded-full p-1 border-white">
              <IoPerson />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

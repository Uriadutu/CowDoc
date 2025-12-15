import React from "react";
import Logo from "../../img/Logo.png";
import Bg from "../../img/Bg.jpg";
import { Link } from "react-router-dom";

const Splash = () => {
  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${Bg})`,
      }}
    >
      <div className="flex flex-col items-center w-full">
        {/* Logo */}
        <img src={Logo} className="w-32 md:w-20 mb-6 " alt="Logo" />

        {/* Judul */}
        <h1 className="text-3xl md:text-6xl text-[#2B1200]/65 font-bold mb-4 leading-tight tracking-[10px] ">
          COWDOCS
        </h1>

        {/* Deskripsi */}
        <p className="text-white text-sm md:text-base text-center lg:text-xl mb-11 max-w-lg tracking-1px]   ">
          Sahabat peternak dalam mendiagnosa penyakit sapi secara cepat dan
          akurat.
        </p>

        {/* Tombol Mulai */}
        <Link
          to="/masuk"
          className="text-gray-100 py-3 px-16 md:px-20 rounded-full bg-[#2B1200BD]/70 hover:bg-[#4e2100bd] transition duration-300"
        >
          Mulai
        </Link>
      </div>
    </div>
  );
};

export default Splash;

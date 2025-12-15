import React from 'react'
import { Link } from 'react-router-dom'
import { FaUserCircle } from "react-icons/fa";
import LogoApp from "../../img/sp.png"
const NavbarUser = () => {
  return (
    <div className="flex justify-between items-center fixed z-10 bg-[#0F9E25] py-2 sm:py-4 w-full drop-shadow-md px-2  sm:px-20">
      <Link
        to={"/"}
        className="uppercase flex items-center gap-1 font-bold text-md sm:text-lg text-white"
      >
        <img src={LogoApp} className="w-10" alt="" />
        <p className='text-white text-[12px] md:text-[16px]'>

        Sistem Rekomendasi Obat Asam Lambung
        </p>
      </Link>

      <div className="hidden sm:block">
        <Link
          to={"/masuk"}
          className=" py-2 text-gray-700 text-sm rounded-sm flex items-center bg-gray-300 px-6 hover:bg-gray-200 transition"
        >
          Masuk
        </Link>
      </div>
      <div className="block sm:hidden px-1">
        <Link to={"/masuk"} className="">
          <FaUserCircle size={25} color="white" />
        </Link>
      </div>
    </div>
  );
}

export default NavbarUser

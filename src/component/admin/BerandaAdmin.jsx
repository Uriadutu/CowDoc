import React from "react";

import Diagnosis from "../../img/Diagnosis.png";
import PMK from "../../img/Pmk.png";

const BerandaAdmin = () => {
  return (
    <div>
      <div className="grid sm:grid-cols-3 grid-cols-1 gap-3">
        {/* Card 1 */}
        <div className="bg-[#B12600] rounded-xl p-2 h-[180px] flex justify-between items-center">
          <div className="text-center text-white font-bold flex-col justify-between h-full">
            <p className="text-6xl mt-6">21</p>
            <p className="text-xl mt-3">Jumlah Penyakit</p>
          </div>
          <img src={Diagnosis} className="h-full object-contain m-1" alt="" />
        </div>
        <div className="bg-[#AEB100] rounded-xl p-2 h-[180px] flex justify-between items-center">
          <div className="text-center text-white font-bold flex-col justify-between h-full">
            <p className="text-6xl mt-6">21</p>
            <p className="text-xl mt-3">Jumlah Gejala</p>
          </div>
          <img src={Diagnosis} className="h-full object-contain m-1" alt="" />
        </div>
        <div className="bg-[#0073B1] rounded-xl p-2 h-[180px] flex justify-between items-center">
          <div className="text-center text-white font-bold flex-col justify-between h-full">
            <p className="text-6xl mt-6">21</p>
            <p className="text-xl mt-3">Jumlah Pengguna</p>
          </div>
          <img src={Diagnosis} className="h-full object-contain m-1" alt="" />
        </div>
        <div className="bg-[#00B16D] rounded-xl p-2 h-[180px] flex justify-between items-center">
          <div className="text-center text-white font-bold flex-col justify-between h-full">
            <p className="text-6xl mt-6">21</p>
            <p className="text-xl mt-3">Jumlah Diagnosis</p>
          </div>
          <img src={Diagnosis} className="h-full object-contain m-1" alt="" />
        </div>

        {/* Card 2 */}
        <div className="bg-[#C34D1B] rounded-xl p-2 h-[180px] relative overflow-hidden">
          <div className="relative flex justify-between items-center h-full">
            <div className="text-center text-white font-bold flex-col justify-between h-full">
              <p className="text-6xl mt-6">PMK</p>
              <p className="text-xl mt-3">Penyakit Yang Sering Muncul</p>
            </div>
            <img
              src={PMK}
              className="h-full object-contain m-1 top-0 right-0 absolute"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BerandaAdmin;

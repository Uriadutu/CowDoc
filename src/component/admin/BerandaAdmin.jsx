import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../auth/Firebase";

import Diagnosis from "../../img/Diagnosis.png";
import PMK from "../../img/Pmk.png";
import User from "../../img/User.png";
import Penyakit from "../../img/Penyakit.png";
import Gejala from "../../img/Gejala.png";

import { formatNamaPenyakit } from "../../utils/helper";

const BerandaAdmin = () => {
  const [jumlahPenyakit, setJumlahPenyakit] = useState(0);
  const [jumlahGejala, setJumlahGejala] = useState(0);
  const [jumlahUser, setJumlahUser] = useState(0);
  const [jumlahDiagnosis, setJumlahDiagnosis] = useState(0);
  const [penyakitTerbanyak, setPenyakitTerbanyak] = useState("-");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // === Hitung total ===
      const penyakitSnap = await getDocs(collection(db, "penyakit"));
      const gejalaSnap = await getDocs(collection(db, "gejala"));
      const userSnap = await getDocs(collection(db, "users"));
      const riwayatSnap = await getDocs(collection(db, "riwayat_diagnosis"));

      setJumlahPenyakit(penyakitSnap.size);
      setJumlahGejala(gejalaSnap.size);
      setJumlahUser(userSnap.size);
      setJumlahDiagnosis(riwayatSnap.size);

      // === Hitung penyakit paling sering muncul ===
      const counter = {};

      riwayatSnap.forEach((doc) => {
        const data = doc.data();
        data.hasil?.forEach((h) => {
          counter[h.penyakitId] = (counter[h.penyakitId] || 0) + 1;
        });
      });

      const penyakitIdTerbanyak = Object.keys(counter).reduce(
        (a, b) => (counter[a] > counter[b] ? a : b),
        null
      );

      if (penyakitIdTerbanyak) {
        const penyakitMap = {};
        penyakitSnap.forEach((doc) => {
          penyakitMap[doc.id] = doc.data().nama;
        });

        setPenyakitTerbanyak(
          penyakitMap[penyakitIdTerbanyak] || "-"
        );
      }
    } catch (err) {
      console.error("Gagal load dashboard:", err);
    }
  };

  return (
    <div>
      <div className="grid sm:grid-cols-3 grid-cols-1 gap-3">
        {/* Jumlah Penyakit */}
        <div className="bg-[#B12600] rounded-xl p-2 h-[180px] flex justify-between items-center">
          <div className="text-center text-white font-bold flex-col justify-between h-full">
            <p className="text-6xl mt-6">{jumlahPenyakit}</p>
            <p className="text-xl mt-3">Jumlah Penyakit</p>
          </div>
          <img src={Penyakit} className="h-full object-contain m-1 opacity-30" alt="" />
        </div>

        {/* Jumlah Gejala */}
        <div className="bg-[#AEB100] rounded-xl p-2 h-[180px] flex justify-between items-center">
          <div className="text-center text-white font-bold flex-col justify-between h-full">
            <p className="text-6xl mt-6">{jumlahGejala}</p>
            <p className="text-xl mt-3">Jumlah Gejala</p>
          </div>
          <img src={Gejala} className="h-full object-contain m-1 opacity-30" alt="" />
        </div>

        {/* Jumlah Pengguna */}
        <div className="bg-[#0073B1] rounded-xl p-2 h-[180px] flex justify-between items-center">
          <div className="text-center text-white font-bold flex-col justify-between h-full">
            <p className="text-6xl mt-6">{jumlahUser}</p>
            <p className="text-xl mt-3">Jumlah Pengguna</p>
          </div>
          <img src={User} className="h-full object-contain m-1 " alt="" />
        </div>

        {/* Jumlah Diagnosis */}
        <div className="bg-[#00B16D] rounded-xl p-2 h-[180px] flex justify-between items-center">
          <div className="text-center text-white font-bold flex-col justify-between h-full">
            <p className="text-6xl mt-6">{jumlahDiagnosis}</p>
            <p className="text-xl mt-3">Jumlah Diagnosis</p>
          </div>
          <img src={Diagnosis} className="h-full object-contain m-1 opacity-30" alt="" />
        </div>

        {/* Penyakit Paling Sering */}
        <div className="bg-[#C34D1B] rounded-xl p-2 h-[180px] relative overflow-hidden">
          <div className="relative flex justify-between items-center h-full">
            <div className="text-center text-white font-bold flex-col justify-between h-full">
              <p className="text-4xl mt-6">{formatNamaPenyakit(penyakitTerbanyak)}</p>
              <p className="text-xl mt-3">Penyakit Yang Sering Muncul</p>
            </div>
            <img
              src={PMK}
              className="h-full object-contain m-[0.02px] top-0 right-0 absolute"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BerandaAdmin;

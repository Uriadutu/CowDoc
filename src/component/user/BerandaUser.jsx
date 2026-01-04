import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../auth/Firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import Diagnosis from "../../img/Diagnosis.png";
import PMK from "../../img/Pmk.png";
import { formatNamaPenyakit } from "../../utils/helper"; 

const BerandaUser = () => {
  const [jumlahDiagnosis, setJumlahDiagnosis] = useState(0);
  const [penyakitTerbanyak, setPenyakitTerbanyak] = useState("-");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "riwayat_diagnosis"),
          where("userId", "==", user.uid)
        );

        const riwayatSnap = await getDocs(q);

        // === Jumlah diagnosis user ===
        setJumlahDiagnosis(riwayatSnap.size);

        // === Hitung penyakit terbanyak ===
        const counter = {};

        riwayatSnap.forEach((docSnap) => {
          const data = docSnap.data();
          data.hasil?.forEach((h) => {
            counter[h.penyakitId] = (counter[h.penyakitId] || 0) + 1;
          });
        });

        const penyakitIdTerbanyak = Object.keys(counter).reduce(
          (a, b) => (counter[a] > counter[b] ? a : b),
          null
        );

        if (penyakitIdTerbanyak) {
          const penyakitSnap = await getDoc(
            doc(db, "penyakit", penyakitIdTerbanyak)
          );

          if (penyakitSnap.exists()) {
            setPenyakitTerbanyak(
              formatNamaPenyakit(penyakitSnap.data().nama)
            );
          }
        }
      } catch (err) {
        console.error("Gagal load beranda user:", err);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <div className="grid sm:grid-cols-3 grid-cols-1 gap-3">
        {/* Jumlah Diagnosis */}
        <div className="bg-[#00B16D] rounded-xl p-2 h-[180px] flex justify-between items-center">
          <div className="text-center text-white font-bold">
            <p className="text-6xl mt-6">{jumlahDiagnosis}</p>
            <p className="text-xl mt-3">Jumlah Diagnosis</p>
          </div>
          <img src={Diagnosis} className="h-full object-contain m-1 opacity-100 " alt="" />
        </div>

        {/* Penyakit Terbanyak */}
        <div className="bg-[#C34D1B] rounded-xl p-2 h-[180px] relative overflow-hidden">
          <div className="relative flex justify-between items-center h-full">
            <div className="text-center text-white font-bold">
              <p className="text-5xl mt-6">{penyakitTerbanyak}</p>
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

export default BerandaUser;

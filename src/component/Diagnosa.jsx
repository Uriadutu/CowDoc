// Diagnosa.jsx
import React, { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../auth/Firebase";
import TentukanNilaiCFModal from "./modals/TentukanNilaiCFModal";
import { useNavigate } from "react-router-dom";
import { IoWarningOutline } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";

const Diagnosa = () => {
  const navigate = useNavigate();
  const [gejalaList, setGejalaList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [openCF, setOpenCF] = useState(false);
  const [loading, setLoading] = useState(true);

  // Ambil daftar gejala
  useEffect(() => {
    const fetchGejala = async () => {
      const snap = await getDocs(collection(db, "gejala"));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setGejalaList(data);
      setLoading(false);
    };
    fetchGejala();
  }, []);

  const toggleSelect = (g) => {
    if (selectedItems.some((x) => x.id === g.id)) {
      setSelectedItems(selectedItems.filter((x) => x.id !== g.id));
    } else {
      setSelectedItems([...selectedItems, g]);
    }
  };

  // Perhitungan CF berdasarkan gejala_penyakit
  const hitungCF = async (cfUser) => {
    const snap = await getDocs(collection(db, "gejala_penyakit"));
    const semuaPenyakit = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    let hasil = [];

    semuaPenyakit.forEach((penyakit) => {
      const list = penyakit.gejalaList || [];
      const gejalaPenyakit = list.map((g) => g.gejala);

      // cek apakah setidaknya ada 1 gejala user yang ada di penyakit ini
      const cocok = selectedItems.some((g) => gejalaPenyakit.includes(g.nama));
      if (!cocok) return;

      let cfGabungan = 0;

      selectedItems.forEach((g, idx) => {
        const pakar = list.find((x) => x.gejala === g.nama);
        if (!pakar) return; // skip jika gejala user tidak ada di penyakit ini
        const cfPakar = parseFloat(pakar.cf) || 0;
        const cfUserVal = cfUser[g.id] || 0;
        const cf = cfPakar * cfUserVal;

        if (idx === 0) cfGabungan = cf;
        else cfGabungan = cfGabungan + cf * (1 - cfGabungan);
      });

      hasil.push({
        penyakit: penyakit.penyakit, // nama penyakit
        gejalaList: list.map((g) => ({ gejala: g.gejala, cf: g.cf })),
        rekomendasiList: penyakit.rekomendasiList || [],
        cf: cfGabungan,
      });
    });

    // Urutkan berdasarkan cf terbesar
    hasil.sort((a, b) => b.cf - a.cf);
    return hasil;
  };

  const handleNext = () => {
    if (selectedItems.length < 2) {
      alert("Pilih minimal 2 gejala.");
      return;
    }
    setOpenCF(true);
  };

  const handleSelectCF = async (cfUser) => {
    const hasilCF = await hitungCF(cfUser);

    navigate("/hasil-diagnosa", {
      state: {
        hasilCF,
      },
    });
  };

  return (
    <div className="p-6">
      <h1 className="heading mb-3">Diagnosis Penyakit</h1>

      {/* Panduan */}
      <div className="bg-gray-200 p-2">
        <div className="flex items-center text-red-500 font-bold mb-1">
          <IoWarningOutline size={20} />
          <p className="ml-1">Panduan Pengisian</p>
        </div>
        <p className="pl-2">
          Pilih gejala yang terlihat. Pilih minimal 2 gejala untuk hasil yang
          akurat.
        </p>
      </div>

      {/* Pilihan gejala */}
      <div className="mt-10 bg-white rounded-b px-3 py-4">
        {loading ? (
          <p className="text-center py-4">Memuat data gejala...</p>
        ) : gejalaList.length === 0 ? (
          <p className="text-center py-4 text-gray-500">Tidak ada gejala.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-5">
            {gejalaList.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleSelect(item)}
                className={`border px-4 flex justify-center items-center h-20 rounded-lg relative cursor-pointer ${
                  selectedItems.some((x) => x.id === item.id)
                    ? "border-[#467D40] bg-green-50"
                    : "border-[#467D40]"
                }`}
              >
                {selectedItems.some((x) => x.id === item.id) && (
                  <div className="absolute left-2 top-2 text-[#467D40]">
                    <FaCheckCircle />
                  </div>
                )}
                <p className="text-center">{item.nama}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Button */}
      {selectedItems.length > 0 && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleNext}
            className="bg-[#467D40] text-white px-5 py-2 rounded-lg hover:bg-[#32ba47] transition"
          >
            Tentukan Keyakinan
          </button>
        </div>
      )}

      {/* Modal CF */}
      <AnimatePresence>
        <TentukanNilaiCFModal
          isOpen={openCF}
          onClose={() => setOpenCF(false)}
          gejalaList={selectedItems}
          onSubmit={handleSelectCF}
        />
      </AnimatePresence>
    </div>
  );
};

export default Diagnosa;

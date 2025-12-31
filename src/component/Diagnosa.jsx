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

  console.log("📦 DATA gejala_penyakit:", semuaPenyakit);

  let hasil = [];

  semuaPenyakit.forEach((penyakit) => {
    const list = penyakit.gejalaList || [];

    // ambil semua gejalaId penyakit
    const gejalaPenyakitIds = list.map((g) => g.gejalaId);

    // cek minimal 1 gejala user cocok
    const cocok = selectedItems.some((g) =>
      gejalaPenyakitIds.includes(g.id)
    );
    if (!cocok) return;

    let cfGabungan = 0;
    let isFirst = true;

    selectedItems.forEach((g) => {
      // cari gejala pakar BERDASARKAN gejalaId
      const pakar = list.find(
        (x) => x.gejalaId === g.id
      );
      if (!pakar) return;

      const cfPakar = Number(pakar.cf) || 0;
      const cfUserVal = Number(cfUser[g.id]) || 0;
      const cf = cfPakar * cfUserVal;

      console.log("🧮 HITUNG CF:", {
        penyakitId: penyakit.penyakitId,
        gejalaId: g.id,
        kode_gejala: pakar.kode_gejala,
        cfPakar,
        cfUserVal,
        hasil: cf,
      });

      if (isFirst) {
        cfGabungan = cf;
        isFirst = false;
      } else {
        cfGabungan = cfGabungan + cf * (1 - cfGabungan);
      }
    });

    hasil.push({
      penyakitId: penyakit.penyakitId,
      cf: cfGabungan,
      gejalaList: list,
      rekomendasiList: penyakit.rekomendasiList || [],
    });
  });

  hasil.sort((a, b) => b.cf - a.cf);

  console.log("🏆 HASIL AKHIR:", hasil);
  return hasil;
};


  useEffect(() => {
    hitungCF();
  }, []);

  const handleNext = () => {
    if (selectedItems.length < 3) {
      alert("Pilih minimal 3 gejala.");
      return;
    }
    setOpenCF(true);
  };

  const handleSelectCF = async (cfUser) => {
    const hasilCF = await hitungCF(cfUser);
    console.log(cfUser);

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
          Pilih gejala yang terlihat. Pilih minimal 3 gejala untuk hasil yang
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
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
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
                <p className="text-center text-sm">{item.nama}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Button */}
      {selectedItems.length > 0 && (
        <div className="flex justify-end mt-4 sticky bottom-7">
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

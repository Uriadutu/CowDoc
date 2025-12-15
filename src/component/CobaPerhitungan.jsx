import React, { useState, useEffect } from "react";
import CobaPerhitunganModal from "./modals/CobaPerhitunganModal";
import { db } from "../auth/Firebase";
import { collection, getDocs } from "firebase/firestore";
import { AnimatePresence } from "framer-motion";

const CobaPerhitungan = () => {
  const [lanjut, setLanjut] = useState(false);
  const [selectedGejala, setSelectedGejala] = useState([]); // Menyimpan gejala yang dicentang
  const [msg, setMsg] = useState("");
  const [dataGejala, setDataGejala] = useState([]); // 🔥 Data gejala dari Firestore
  const [obatData, setObatData] = useState([]); // 🔥 Data obat dari Firestore

  // 🔥 Ambil data gejala dari Firestore
  useEffect(() => {
    const fetchGejala = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "gejala"));
        const gejalaList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDataGejala(gejalaList);
      } catch (error) {
        console.error("Gagal mengambil data gejala:", error);
      }
    };

    fetchGejala();
  }, []);

  // 🔥 Ambil data obat dari Firestore
  useEffect(() => {
    const fetchObat = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "obat"));
        const obatList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setObatData(obatList);
      } catch (error) {
        console.error("Gagal mengambil data obat:", error);
      }
    };

    fetchObat();
  }, []);

  // Fungsi untuk menangani perubahan checkbox
  const handleCheckboxChange = (id, nama) => {
    setSelectedGejala((prev) => {
      if (prev.some((gejala) => gejala.id === id)) {
        return prev.filter((gejala) => gejala.id !== id); // Hapus jika sudah dipilih
      } else {
        return [...prev, { id, nama: nama }]; // Tambahkan jika belum dipilih
      }
    });
  };

  const handleClickLanjut = () => {
    if (selectedGejala.length === 0) {
      setMsg("Silahkan pilih gejala terlebih dahulu");
    } else if (selectedGejala.length < 2) {
      setMsg("Minimal pilih 2 gejala");
    } else {
      setLanjut(true);
      setMsg("");
    }
  };

  return (
    <div className="p-4">
      <AnimatePresence>
        {lanjut && (
          <CobaPerhitunganModal
            setIsOpenModalAdd={setLanjut}
            selectedGejala={selectedGejala}
            obatData={obatData} // 🔥 Kirim data obat ke modal
          />
        )}
      </AnimatePresence>
      <div className="bg-white rounded shadow-lg">
        <header className="border-b border-gray-200">
          <div className="bg-white rounded-t px-3 py-4 font-bold text-lg md:text-xl">
            <h1 className="text-center md:text-left">Coba Perhitungan</h1>
          </div>
        </header>
        <div className="bg-white rounded-b px-3 py-4">
          {dataGejala.length === 0 ? (
            <p className="text-gray-500 text-center">Memuat data gejala...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataGejala.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2 border p-3 rounded-lg shadow-sm text-sm md:text-base"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 md:w-5 md:h-5"
                    checked={selectedGejala.some(
                      (gejala) => gejala.id === item.id
                    )}
                    onChange={() => handleCheckboxChange(item.id, item.nama)}
                  />
                  <span>{item.nama}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 bg-white rounded-b px-3 py-4">
          <p className="text-red-500 text-center sm:text-left">{msg}</p>
          <button
            onClick={handleClickLanjut}
            className="w-full sm:w-auto bg-[#0C8E20] text-white px-8 py-2 rounded shadow-md hover:bg-[#32ba47] transition"
          >
            Lanjut
          </button>
        </div>
      </div>
    </div>
  );
};

export default CobaPerhitungan;

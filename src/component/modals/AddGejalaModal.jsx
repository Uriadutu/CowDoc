import React, { useState } from "react";
import { db } from "../../auth/Firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { motion } from "framer-motion";

const AddGejalaModal = ({ setIsOpenModalAdd }) => {
  const [kodeGejala, setKodeGejala] = useState("");
  const [namaGejala, setNamaGejala] = useState("");
  const [terkaitGejala, setTerkaitGejala] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTambahGejala = async (e) => {
  e.preventDefault();

  if (!kodeGejala.trim() || !namaGejala.trim()) {
    alert("Kode dan Nama gejala wajib diisi");
    return;
  }

  setLoading(true);

  try {
    const kodeTrim = kodeGejala.trim().toUpperCase();

    const q = query(
      collection(db, "gejala"),
      where("kode", "==", kodeTrim)
    );

    const snap = await getDocs(q);

    if (!snap.empty) {
      alert("Kode gejala sudah digunakan. Gunakan kode lain.");
      setLoading(false);
      return;
    }

    await addDoc(collection(db, "gejala"), {
      kode: kodeTrim,
      nama: namaGejala.trim(),
      terkait: terkaitGejala,
      createdAt: new Date(),
    });

    setKodeGejala("");
    setNamaGejala("");
    setTerkaitGejala("");
    setIsOpenModalAdd(false);
  } catch (error) {
    console.error("Error menambahkan gejala:", error);
    alert("Gagal menambahkan gejala");
  }

  setLoading(false);
};


  return (
    <div
      id="default-modal"
      tabIndex="-1"
      aria-hidden="true"
      className="fixed inset-0 px-3 flex items-center sm:items-start sm:pt-3 justify-center bg-black bg-opacity-60 z-40"
    >
      <form onSubmit={handleTambahGejala}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.3 }}
          className="w-[900px] max-w-5xl mx-auto rounded-xl"
        >
          {/* HEADER */}
          <div className="flex items-start justify-between p-5 border border-gray-400 bg-[#04BD51] rounded-xl mb-1">
            <h3 className="text-xl font-semibold text-white">Tambah Gejala</h3>
            <button
              onClick={() => setIsOpenModalAdd(false)}
              type="button"
              className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-100 bg-transparent rounded-lg hover:bg-red-500 hover:text-white transition duration-300"
            >
              ✕
            </button>
          </div>

          {/* BODY */}
          <div className="bg-white rounded-xl border border-[#04BD51]">
            <div className="p-6 space-y-5 text-gray-700">
              <div className="grid items-center grid-cols-5 gap-4">
                {/* KODE GEJALA */}
                <label className="text-sm font-medium text-gray-700">
                  Kode Gejala
                </label>
                <input
                  type="text"
                  value={kodeGejala}
                  onChange={(e) => setKodeGejala(e.target.value)}
                  className="w-full px-3 col-span-2 py-2 border border-gray-500 bg-white text-gray-700 focus:outline-none"
                />
                <div className="col-span-2"></div>

                {/* NAMA GEJALA */}
                <label className="text-sm font-medium text-gray-700">
                  Nama Gejala
                </label>
                <input
                  type="text"
                  value={namaGejala}
                  onChange={(e) => setNamaGejala(e.target.value)}
                  className="w-full px-3 col-span-2 py-2 border border-gray-500 bg-white text-gray-700 focus:outline-none"
                />
                <div className="col-span-2"></div>

                {/* TERKAIT GEJALA */}
                <label className="text-sm font-medium text-gray-700">
                  Terkait Gejala
                </label>
                <textarea
                  rows={5}
                  value={terkaitGejala}
                  onChange={(e) => setTerkaitGejala(e.target.value)}
                  className="resize-none w-full px-3 col-span-4 py-2 border border-gray-500 bg-white text-gray-700 focus:outline-none"
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-end p-4 space-x-3">
              <button
                onClick={() => setIsOpenModalAdd(false)}
                type="button"
                className="px-4 py-2 bg-gray-200 border border-gray-400 text-gray-500 text-sm rounded hover:bg-gray-100 transition duration-300"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#00D020] px-4 py-2 text-white font-semibold text-sm rounded hover:bg-[#3bdf54] transition duration-300"
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </motion.div>
      </form>
    </div>
  );
};

export default AddGejalaModal;

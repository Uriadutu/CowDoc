import React, { useState } from "react";
import { db } from "../../auth/Firebase";
import { collection, addDoc } from "firebase/firestore";
import { motion } from "framer-motion";

const AddPenyakitModal = ({ setIsOpenModalAdd }) => {
  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTambahPenyakit = async (e) => {
    e.preventDefault();

    if (!kode.trim() || !nama.trim()) {
      alert("Kode dan Nama Penyakit wajib diisi");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "penyakit"), {
        kode,
        nama,
        deskripsi,
        createdAt: new Date(),
      });

      setKode("");
      setNama("");
      setDeskripsi("");
      setIsOpenModalAdd(false);
    } catch (error) {
      console.error("Error menambahkan penyakit:", error);
      alert("Gagal menambahkan penyakit");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 px-3 flex items-center sm:items-start sm:pt-3 justify-center bg-black bg-opacity-60 z-40">
      <form onSubmit={handleTambahPenyakit}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.3 }}
          className="w-[900px] max-w-5xl mx-auto rounded-lg"
        >          
          {/* HEADER */}
          <div className="flex items-start justify-between p-5 border border-gray-400 bg-[#04BD51] rounded mb-1">
            <h3 className="text-xl font-semibold text-white">Tambah Penyakit</h3>
            <button
              type="button"
              onClick={() => setIsOpenModalAdd(false)}
              className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-100 hover:bg-red-500 hover:text-white rounded transition"
            >
              ✕
            </button>
          </div>

          {/* FORM */}
          <div className="bg-white rounded border border-[#04BD51]">
            <div className="p-6 space-y-5 text-gray-700">
              <div className="grid grid-cols-5 gap-4">

                {/* KODE */}
                <label className="text-sm font-medium">Kode Penyakit</label>
                <input
                  type="text"
                  value={kode}
                  onChange={(e) => setKode(e.target.value)}
                  className="w-full col-span-2 px-3 py-2 border border-gray-500 bg-white text-gray-700"
                />
                <div className="col-span-2"></div>

                {/* NAMA */}
                <label className="text-sm font-medium">Nama Penyakit</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full col-span-2 px-3 py-2 border border-gray-500 bg-white text-gray-700"
                />
                <div className="col-span-2"></div>

                {/* DESKRIPSI */}
                <label className="text-sm font-medium">Deskripsi Penyakit</label>
                <textarea
                  rows={5}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="col-span-4 px-3 py-2 border border-gray-500 bg-white text-gray-700 resize-none"
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end p-4 space-x-3">
              <button
                type="button"
                onClick={() => setIsOpenModalAdd(false)}
                className="px-4 py-2 bg-gray-200 border border-gray-400 text-gray-500 rounded hover:bg-gray-100"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#00D020] text-white rounded hover:bg-[#3bdf54]"
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

export default AddPenyakitModal;
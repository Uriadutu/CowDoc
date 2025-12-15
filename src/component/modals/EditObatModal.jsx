import React, { useState } from "react";
import { db } from "../../auth/Firebase";
import { doc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";

const EditObatModal = ({ onClose, obat }) => {
  const [namaObat, setNamaObat] = useState(obat.nama || "");
  const [loading, setLoading] = useState(false);

  const handleUpdateObat = async (e) => {
    e.preventDefault();
    if (!namaObat.trim()) {
      alert("Nama obat tidak boleh kosong");
      return;
    }

    setLoading(true);
    try {
      const obatRef = doc(db, "obat", obat.id);
      await updateDoc(obatRef, {
        nama: namaObat,
        updatedAt: new Date(),
      });
      onClose();
    } catch (error) {
      console.error("Error mengupdate obat:", error);
      alert("Gagal mengupdate obat");
    }
    setLoading(false);
  };

  return (
    <div
      tabIndex="-1"
      aria-hidden="true"
      className="fixed inset-0 px-2 flex items-center sm:items-start sm:pt-3 justify-center bg-black z-40 bg-opacity-60"
    >
      <form onSubmit={handleUpdateObat}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg bg-white rounded-lg shadow-lg"
        >
          <div className="flex items-start justify-between p-4 border-b border-gray-200 rounded-t">
            <h3 className="text-xl font-semibold text-gray-700">Ubah Obat</h3>
            <button
              onClick={onClose}
              type="button"
              className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-700 bg-transparent rounded-lg hover:bg-red-500 hover:text-gray-100 ms-auto transition duration-300"
            >
              ✕
            </button>
          </div>
          <div className="p-4 space-y-4 text-gray-700">
            <div className="mb-6">
              <div className="mb-4 grid items-center grid-cols-2 gap-4">
                <label className="block text-sm font-medium text-gray-700">
                  Nama Obat
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    value={namaObat}
                    onChange={(e) => setNamaObat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg focus:outline-none"
                    placeholder="Masukan Nama Obat"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end p-4 space-x-3 border-t border-gray-200 rounded-b">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 bg-gray-200 border border-gray-400 text-gray-500 text-sm rounded hover:bg-gray-100 transition duration-300"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#00D020] px-3 py-2 text-white font-semibold text-sm rounded hover:bg-[#3bdf54] transition duration-300"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </motion.div>
      </form>
    </div>
  );
};

export default EditObatModal;

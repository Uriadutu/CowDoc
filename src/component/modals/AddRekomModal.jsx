import React, { useState } from "react";
import { db } from "../../auth/Firebase";
import { collection, addDoc } from "firebase/firestore";
import { motion } from "framer-motion";

const AddRekomModal = ({ setIsOpenModalAdd }) => {
  const [isi, setIsi] = useState("");
  const [jenis, setJenis] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTambah = async (e) => {
    e.preventDefault();

    if (!isi.trim() || !jenis.trim()) {
      alert("Semua field wajib diisi!");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "rekomendasi"), {
        isi,
        jenis,
        createdAt: new Date(),
      });

      setIsOpenModalAdd(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menambah rekomendasi");
    }
    setLoading(false);
  };

  return (
    <div
      id="edit-modal"
      tabIndex="-1"
      aria-hidden="true"
      className="fixed inset-0 px-3 flex items-center sm:items-start sm:pt-3 justify-center bg-black bg-opacity-60 z-40"
    >
      {" "}
      <form onSubmit={handleTambah}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.3 }}
          className="w-[900px] max-w-5xl mx-auto rounded-lg"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between p-5 border border-gray-400 bg-[#04BD51] rounded mb-1">
            <h3 className="text-xl font-semibold text-white">
              Tambah Rekomendasi
            </h3>
            <button
              onClick={() => setIsOpenModalAdd(false)}
              type="button"
              className="w-8 h-8 text-sm bg-transparent text-white hover:bg-red-500 rounded transition"
            >
              ✕
            </button>
          </div>

          {/* BODY */}
          <div className="bg-white rounded border border-[#04BD51]">
            <div className="p-6 space-y-5 text-gray-700">
              <div className="grid grid-cols-5 gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Isi Rekomendasi
                </label>
                <textarea
                  rows={4}
                  value={isi}
                  onChange={(e) => setIsi(e.target.value)}
                  className="resize-none col-span-4 border border-gray-500 px-3 py-2"
                />

                <label className="text-sm font-medium text-gray-700 mt-3">
                  Jenis Pengobatan
                </label>
                <input
                  type="text"
                  value={jenis}
                  onChange={(e) => setJenis(e.target.value)}
                  className="col-span-4 border border-gray-500 px-3 py-2"
                />
              </div>

              {/* FOOTER */}
              <div className="flex justify-end space-x-3">
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
          </div>
        </motion.div>
      </form>
    </div>
  );
};

export default AddRekomModal;

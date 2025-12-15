import React, { useState } from "react";
import { db } from "../../auth/Firebase";
import { doc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";

const EditRekomModal = ({ setIsOpenModalEdit, rekom }) => {
  const [isi, setIsi] = useState(rekom.isi);
  const [jenis, setJenis] = useState(rekom.jenis);
  const [loading, setLoading] = useState(false);

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!isi.trim() || !jenis.trim()) {
      alert("Semua field wajib diisi!");
      return;
    }

    setLoading(true);
    try {
      const ref = doc(db, "rekomendasi", rekom.id);
      await updateDoc(ref, {
        isi,
        jenis,
        updatedAt: new Date(),
      });

      setIsOpenModalEdit(false);
    } catch (error) {
      console.error("Error edit:", error);
      alert("Gagal mengedit rekomendasi!");
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
      <form onSubmit={handleEdit}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.3 }}
          className="w-[900px] max-w-5xl mx-auto rounded-lg"
        >
          {/* HEADER */}
          <div className="flex justify-between p-5 border border-gray-400 bg-[#048FBD] rounded mb-1">
            <h3 className="text-xl font-semibold text-white">
              Edit Rekomendasi
            </h3>
            <button
              onClick={() => setIsOpenModalEdit(false)}
              type="button"
              className="w-8 h-8 text-white hover:bg-red-500 rounded"
            >
              ✕
            </button>
          </div>

          {/* BODY */}
          <div className="bg-white rounded border border-[#048FBD] p-6 space-y-5">
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

              <label className="text-sm font-medium text-gray-700">
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
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setIsOpenModalEdit(false)}
                type="button"
                className="px-4 py-2 bg-gray-200 border border-gray-400 text-gray-500 text-sm rounded hover:bg-gray-100 transition duration-300"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#048FBD] px-4 py-2 text-white font-semibold text-sm rounded hover:bg-[#179cc8] transition duration-300"
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

export default EditRekomModal;

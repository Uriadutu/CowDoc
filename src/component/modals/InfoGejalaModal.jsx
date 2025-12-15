import React from "react";
import { motion } from "framer-motion";

const InfoGejalaModal = ({ setIsOpenModalAdd, gejalaUser }) => {
  return (
    <div
      id="default-modal"
      tabIndex="-1"
      aria-hidden="true"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 z-50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-100 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Gejala yang Dipilih</h3>
          <button
            onClick={() => setIsOpenModalAdd(false)}
            className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-700 bg-transparent rounded-lg hover:bg-red-500 hover:text-gray-100 ms-auto transition duration-300"
            >
            ✕
          </button>
        </div>

        {/* Konten */}
        <div className="px-6 py-4 text-gray-700 space-y-4 max-h-[60vh] overflow-y-auto">
          {gejalaUser.length > 0 ? (
            <div className="space-y-2">
              {gejalaUser.map((gejala, index) => (
                <div
                  key={gejala.id}
                  className="grid grid-cols-6 items-center px-4 py-3 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                >
                  <span className="font-medium col-span-5 text-gray-800">{gejala.nama}</span>
                  <span className="text-sm text-center text-gray-600">
                     <span className="font-semibold text-green-600">{(gejala.keyakinan * 10).toFixed()}</span>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Tidak ada gejala yang dipilih.</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-100 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => setIsOpenModalAdd(false)}
            className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
            >
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default InfoGejalaModal;

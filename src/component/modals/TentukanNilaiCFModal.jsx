import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TentukanNilaiCFModal = ({ isOpen, onClose, gejalaList, onSubmit }) => {
  const [nilaiCF, setNilaiCF] = useState({});

  console.log(nilaiCF);
  

  useEffect(() => {
    if (isOpen && gejalaList.length) {
      const init = {};
      gejalaList.forEach((g) => (init[g.id] = 0.1));
      setNilaiCF(init);
    }
  }, [isOpen, gejalaList]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSubmit(nilaiCF);
    onClose();
  };

  return (
    <div className="fixed inset-0 px-3 flex items-center sm:items-start sm:pt-3 justify-center bg-black bg-opacity-60 z-40">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.3 }}
        className="w-[700px] max-w-5xl mx-auto rounded-xl"
      >
        <h2 className="text-xl font-semibold text-center bg-[#04BD51] text-white p-2 rounded-md">
          Tentukan Nilai Keyakinan
        </h2>

        <div className="mt-1 rounded-md max-h-[60vh] p-4 bg-white overflow-y-auto border border-[#04BD51]">
          <div className="grid grid-cols-5 px-2">
            <div className="col-span-3 text-center ">
              <p className="border-b border-[#04BD51] pb-1">
                Gejala Yang Dipilih
              </p>
            </div>
            <div className="col-span-2 text-center">
              <p className="border-b border-[#04BD51] pb-1">
                Keyakinan
              </p>
            </div>
          </div>

          {gejalaList.map((g) => (
            <div key={g.id} className="grid grid-cols-5 px-2 items-center border-b gap-2 ">
              <div className="col-span-3 text-left">
                <p className="pb-1 pr-1">{g.nama}</p>
              </div>
              <div className="col-span-2 text-center">
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0.1}
                    max={1.0}
                    step={0.1}
                    value={nilaiCF[g.id]}
                    onChange={(e) =>
                      setNilaiCF({
                        ...nilaiCF,
                        [g.id]: parseFloat(e.target.value),
                      })
                    }
                    className="w-full h-1 rounded-lg appearance-none range-track"
                    style={{
                      background: `linear-gradient(to right, #04BD51 0%, #04BD51 ${
                        nilaiCF[g.id] * 100
                      }%, #d1d5db ${nilaiCF[g.id] * 100}%, #d1d5db 100%)`,
                    }}
                  />
                  <span className="w-12 text-center font-medium">
                    {(nilaiCF[g.id] * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-1 flex justify-end gap-3 bg-white pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 font-medium border border-[#2F8326] rounded text-[#2F8326] hover:bg-gray-100 transition"
            >
              Kembali
            </button>

            <button
              onClick={handleSave}
              className="px-5 py-2 bg-[#376D01] border border-[#2F8326] text-white rounded hover:bg-[#3a6836] transition"
            >
              Diagnosis
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TentukanNilaiCFModal;

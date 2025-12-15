import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const UserCFModal = ({ setIsOpenModalAdd, selectedGejala, obatData }) => {
  const [nilaiKeyakinan, setNilaiKeyakinan] = useState({});
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");

  const handleReset = () => {
    setNilaiKeyakinan({});
  };

  const hitungCertaintyFactor = () => {
    if (!selectedGejala.length || !obatData.length) {
      setMsg("Data gejala atau obat tidak tersedia!");
      return;
    }

    if (Object.keys(nilaiKeyakinan).length !== selectedGejala.length) {
      setMsg("Pilih nilai keyakinan!");
      return;
    }

    let hasilPerhitungan = [];

    const obatValid = obatData.filter(
      (obat) => Array.isArray(obat.gejalaList) && obat.gejalaList.length > 0
    );

    if (obatValid.length === 0) {
      setMsg("Tidak ada obat yang sesuai dengan gejala yang dipilih!");
      return;
    }

    obatValid.forEach((obat) => {
      const gejalaObat = obat.gejalaList.map((g) => g.gejala);
      const semuaGejalaCocok = selectedGejala.every((gejala) =>
        gejalaObat.includes(gejala.nama)
      );

      if (!semuaGejalaCocok) return;

      let cfGabungan = 0;

      selectedGejala.forEach((gejala, index) => {
        const gejalaData = obat.gejalaList.find(
          (g) => g.gejala === gejala.nama
        );
        const cfPakar = parseFloat(gejalaData?.keyakinan) || 0;
        const cfUser = nilaiKeyakinan[gejala.id] || 0;
        const cf = cfPakar * cfUser;

        if (index === 0) {
          cfGabungan = cf;
        } else {
          cfGabungan = cfGabungan + cf * (1 - cfGabungan);
        }
      });

      hasilPerhitungan.push({
        namaObat: obat.nama,
        cf: cfGabungan,
      });
    });

    const totalCF = hasilPerhitungan.reduce((acc, { namaObat, cf }) => {
      if (!acc[namaObat]) {
        acc[namaObat] = cf;
      } else {
        acc[namaObat] = acc[namaObat] + cf * (1 - acc[namaObat]);
      }
      return acc;
    }, {});

    const rekomendasiObat = Object.entries(totalCF)
      .map(([namaObat, cfTotal]) => ({
        nama: namaObat,
        nilai: (cfTotal * 100).toFixed(2),
      }))
      .sort((a, b) => b.nilai - a.nilai);

    const dataUser = selectedGejala.map((gejala) => ({
      id: gejala.id,
      nama: gejala.nama,
      keyakinan: nilaiKeyakinan[gejala.id],
    }));

    navigate("/hasil-perhitungan", {
      state: { hasilRekomendasi: rekomendasiObat, gejalaUser: dataUser },
    });
  };

  return (
    <div className="fixed inset-0 px-2 flex items-center sm:items-start sm:pt-3 justify-center bg-black bg-opacity-70 z-40">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-3xl bg-white text-gray-700 rounded-lg shadow-lg"
      >
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="">
            <h3 className="text-xl font-semibold">Tentukan Nilai Keyakinan</h3>
            <div className="flex gap-3 mt-5">
              <div className="col-span-1 text-[12px] font-bold">
                <p>Pilih nilai tingkat keyakinan Anda:</p>
              </div>
              <div className="col-span-3 text-[12px] font-bold  ">
                {" "}
                1 (Kurang Yakin) - 10 (Sangat Yakin)
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpenModalAdd(false)}
            className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-700 bg-transparent rounded-lg hover:bg-red-500 hover:text-gray-100 ms-auto transition duration-300"
          >
            ✕
          </button>
        </div>
        <div className="py-2 px-6 max-h-[60vh] overflow-y-auto">
          <div className="w-full grid grid-cols-4">
            <div className=""></div>
          </div>
          <div className="w-full grid grid-cols-4">
            <div className=""></div>
            <div className="grid grid-cols-10 w-full justify-center col-span-3">
              <div className="flex justify-center text-[12px]">1</div>
              <div className="flex justify-center text-[12px]">2</div>
              <div className="flex justify-center text-[12px]">3</div>
              <div className="flex justify-center text-[12px]">4</div>
              <div className="flex justify-center text-[12px]">5</div>
              <div className="flex justify-center text-[12px]">6</div>
              <div className="flex justify-center text-[12px]">7</div>
              <div className="flex justify-center text-[12px]">8</div>
              <div className="flex justify-center text-[12px]">9</div>
              <div className="flex justify-center text-[12px]">10</div>
            </div>
          </div>
          <div className="space-y-2 mt-2">
            {selectedGejala.length > 0 ? (
              selectedGejala.map((gejala) => (
                <div
                  key={gejala.id}
                  className="grid grid-cols-4 gap-2 items-center"
                >
                  <span className="font-medium">{gejala.nama}</span>
                  <div className="col-span-3 grid grid-cols-10 w-full">
                    {Array.from({ length: 10 }).map((_, index) => {
                      const nilai = (index + 1) / 10;
                      return (
                        <label
                          key={index}
                          className="flex justify-center items-center text-center"
                        >
                          <div className="">
                            <input
                              type="radio"
                              name={`nilai_gejala_${gejala.id}`}
                              value={nilai}
                              checked={nilaiKeyakinan[gejala.id] === nilai}
                              onChange={() =>
                                setNilaiKeyakinan((prev) => ({
                                  ...prev,
                                  [gejala.id]: nilai,
                                }))
                              }
                            />
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                Tidak ada gejala yang dipilih.
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center w-full justify-end p-4 space-x-3 border-t border-gray-200 rounded-b">
          <p className="text-red-500">{msg}</p>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 border border-gray-400 text-gray-500 text-sm rounded hover:bg-gray-100 transition duration-300"
          >
            Ulang
          </button>
          <button
            onClick={hitungCertaintyFactor}
            className="bg-[#00D020] px-3 py-2 text-white font-semibold text-sm rounded hover:bg-[#3bdf54] transition duration-300"
          >
            Periksa
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserCFModal;

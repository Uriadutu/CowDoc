// HasilDiagnosa.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const HasilDiagnosa = () => {
  const [dataRiwayat, setDataRiwayat] = useState([]);
  const [openRekomendasi, setOpenRekomendasi] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.hasilCF) return <p>Tidak ada hasil.</p>;

  const { hasilCF } = state;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#467D40] mb-6 text-center">
        Hasil Diagnosa
      </h1>

      {hasilCF.length === 0 ? (
        <p className="text-red-500 text-center">
          Tidak ditemukan penyakit yang cocok.
        </p>
      ) : (
        <div className="space-y-6">
          {hasilCF.map((row, i) => (
            <div key={i} className="">
              <div className="col-span-1">
                <div className="text-white font-medium  rounded-lg py-2 px-6 bg-[#1A7E0FBD] w-full transition border-2 border-[#467D40] grid grid-cols-4">
                 <p className="col-span-1 text-center">Hasil Diagnosis</p>
                 <div className="col-span-3"></div>
                </div>
                <div className="grid grid-cols-4 border-2 p-6 border-[#1A7E0FBD] rounded-lg mt-1">
                  <div className="col-span-1 border-r-2 border-[#1A7E0FBD]">
                    <h2 className="text-2xl  text-center font-semibold text-gray-700 mb-3 md:mb-0">
                      {row.penyakit}
                    </h2>

                    {/* Tingkat keyakinan */}
                    <p className="text-red-500 font-bold text-center text-4xl mb-3 md:mb-0">
                      {(row.cf * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div className="col-span-3 flex justify-center w-full items-center text-center">
                    <p>
                      Sapi Anda Menderita Penyakit {row.penyakit} dengan
                      Presentase Tingkat Keyakinan {(row.cf * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
              {/* Rekomendasi */}
              {/* {row.rekomendasiList.length > 0 && (
                <div>
                  <p className="font-medium text-gray-700 mb-1">Rekomendasi:</p>
                  <ul className="list-disc list-inside text-gray-600">
                    {row.rekomendasiList.map((r, idx) => (
                      <li key={idx}>{r.id}</li>
                    ))}
                  </ul>
                </div>
              )} */}
            </div>
          ))}
        </div>
      )}

      {/* Button Kembali */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate("/diagnosis")}
          className="px-6 py-3 bg-[#467D40] text-white rounded-2xl font-semibold hover:bg-[#3a6836] transition shadow-md"
        >
          Kembali
        </button>
      </div>
    </div>
  );
};

export default HasilDiagnosa;

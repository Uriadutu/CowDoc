import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../auth/Firebase";

const HasilDiagnosa = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const [dataRiwayat, setDataRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openRekomendasi, setOpenRekomendasi] = useState({});

  // ✅ AMAN dari eslint (tidak conditional)
  const hasilCF = state?.hasilCF || [];

  useEffect(() => {
    const fetchData = async () => {
      if (!hasilCF || hasilCF.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const hasilDenganNama = await Promise.all(
          hasilCF.map(async (row) => {
            // ambil nama penyakit
            let namaPenyakit = "Tidak diketahui";
            try {
              const penyakitRef = doc(db, "penyakit", row.penyakitId);
              const penyakitSnap = await getDoc(penyakitRef);
              if (penyakitSnap.exists()) {
                namaPenyakit = penyakitSnap.data().nama;
              }
            } catch (err) {
              console.error("Gagal ambil penyakit:", err);
            }

            // ambil nama rekomendasi
            // ambil rekomendasi (isi + jenis)
            let rekomendasiDetail = [];
            if (row.rekomendasiList && row.rekomendasiList.length > 0) {
              rekomendasiDetail = await Promise.all(
                row.rekomendasiList.map(async (id) => {
                  try {
                    const ref = doc(db, "rekomendasi", id);
                    const snap = await getDoc(ref);
                    if (snap.exists()) {
                      const data = snap.data();
                      return {
                        isi: data.isi,
                        jenis: data.jenis,
                      };
                    }
                    return null;
                  } catch (err) {
                    console.error("Gagal ambil rekomendasi:", err);
                    return null;
                  }
                })
              );

              // buang null
              rekomendasiDetail = rekomendasiDetail.filter(Boolean);
            }

            return {
              ...row,
              penyakit: namaPenyakit,
              rekomendasiDetail,
            };
          })
        );

        setDataRiwayat(hasilDenganNama);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hasilCF]);

  if (!state || !state.hasilCF) {
    return <p className="text-center mt-10">Tidak ada hasil.</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#467D40] mb-6 text-center">
        Hasil Diagnosa
      </h1>

      {loading ? (
        <p className="text-center">Memuat hasil diagnosa...</p>
      ) : dataRiwayat.length === 0 ? (
        <p className="text-red-500 text-center">
          Tidak ditemukan penyakit yang cocok.
        </p>
      ) : (
        <div className="space-y-6">
          {dataRiwayat.map((row, i) => (
            <div key={i}>
              {/* Header */}
              <div className="text-white font-medium rounded-lg py-2 px-6 bg-[#1A7E0FBD] w-full border-2 border-[#467D40] grid grid-cols-4">
                <p className="col-span-1 text-center">Hasil Diagnosis</p>
                <div className="col-span-3"></div>
              </div>

              {/* Content */}
              <div className="grid grid-cols-4 border-2 p-6 border-[#1A7E0FBD] rounded-lg mt-1">
                <div className="col-span-1 border-r-2 border-[#1A7E0FBD]">
                  <h2 className="text-2xl text-center font-semibold text-gray-700 mb-3">
                    {row.penyakit}
                  </h2>

                  <p className="text-red-500 font-bold text-center text-4xl">
                    {(row.cf * 100).toFixed(0)}%
                  </p>
                </div>

                <div className="col-span-3 flex justify-center items-center text-center px-4">
                  <p>
                    Sapi Anda Menderita Penyakit <b>{row.penyakit}</b> dengan
                    Presentase Tingkat Keyakinan{" "}
                    <b>{(row.cf * 100).toFixed(0)}%</b>
                  </p>
                </div>

                {row.rekomendasiDetail.length > 0 && (
                  <div className="col-span-4 mt-4">
                    {/* Tombol Toggle */}
                    <button
                      onClick={() =>
                        setOpenRekomendasi((prev) => ({
                          ...prev,
                          [i]: !prev[i],
                        }))
                      }
                      className="font-semibold text-[#467D40] mb-2"
                    >
                      {openRekomendasi[i]
                        ? "Tutup"
                        : "Lihat Rekomendasi"}
                    </button>

                    {/* Dropdown */}
                    {openRekomendasi[i] && (
                      <ul className="list-disc list-inside text-gray-600 mt-2">
                        {row.rekomendasiDetail.map((r, idx) => (
                          <li key={idx}>
                            <b>{r.jenis}</b>: {r.isi}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
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

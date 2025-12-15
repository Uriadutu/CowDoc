import { AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import InfoGejalaModal from "./modals/InfoGejalaModal";
import { useState } from "react";

const HasilCobaPerhitungan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openModalInfo, setOpenModalInfo] = useState(false);
  const [showPerhitungan, setShowPerhitungan] = useState(false); // Tambahan
  const { hasilRekomendasi, gejalaUser, langkahPerhitungan } =
    location.state || {
      hasilRekomendasi: [],
      gejalaUser: [],
      langkahPerhitungan: [],
    };

  // Di dalam komponen HasilCobaPerhitungan

  // Pisahkan dua jenis langkah perhitungan
  const cfAwal = langkahPerhitungan.filter(
    (item) => item.cfKombinasi !== undefined
  );
  const cfGabungan = langkahPerhitungan.filter(
    (item) => item.kombinasiSebelumnya !== undefined
  );

  console.log(langkahPerhitungan);

  // Mengelompokkan obat dengan persentase yang sama
  const groupedHasil = hasilRekomendasi.reduce((acc, item) => {
    const key = item.nilai > 100 ? 100 : item.nilai;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item.nama);
    return acc;
  }, {});

  return (
    <div className="px-4">
      <AnimatePresence>
        {openModalInfo && (
          <InfoGejalaModal
            setIsOpenModalAdd={setOpenModalInfo}
            gejalaUser={gejalaUser}
          />
        )}
      </AnimatePresence>

      <div className="bg-white rounded shadow-lg">
        <header className="border-b border-gray-200">
          <div className="bg-white rounded-t px-3 py-4 font-bold text-lg md:text-xl">
            <h1 className="text-center md:text-left">Hasil Rekomendasi Obat</h1>
          </div>
        </header>

        <div className="bg-white rounded-b px-3 py-4">
          {Object.keys(groupedHasil).length > 0 ? (
            <ul className="space-y-4">
              {Object.entries(groupedHasil).map(([nilai, namaObat], index) => (
                <li
                  key={index}
                  className="p-4 border rounded-lg shadow-sm bg-gray-50"
                >
                  <div className="font-semibold mb-1">
                    {index + 1}. {namaObat.join(" / ")}
                  </div>
                  <div className="relative w-full h-4 bg-gray-200 rounded-lg overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-green-500 transition-all"
                      style={{ width: `${Math.min(nilai, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-sm text-gray-700 mt-1">
                    Persentase Rekomendasi: {Math.min(nilai, 100)}%
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">
              Tidak ada hasil rekomendasi.
            </p>
          )}
        </div>
        <div className="flex w-full justify-end gap-2 py-4 px-3">
          <div className="flex gap-3 items-center ">
            <button
              className="px-4 py-2 bg-gray-200 border border-gray-400 text-gray-700 text-sm rounded hover:bg-gray-100 transition duration-300"
              onClick={() => navigate("/coba-perhitungan")}
            >
              Kembali
            </button>
          </div>
          <button className="btn-add" onClick={() => setOpenModalInfo(true)}>
            Lihat Gejala
          </button>
          <button
            className="btn-add"
            onClick={() => setShowPerhitungan(!showPerhitungan)}
          >
            {showPerhitungan ? "Sembunyikan Perhitungan" : "Lihat Perhitungan"}
          </button>
        </div>

        {/* Tabel perhitungan */}
        {showPerhitungan && (
          <div className="px-3 pb-6 space-y-6">
            <h2 className="text-lg font-semibold">
              Detail Perhitungan Certainty Factor
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(
                [...cfAwal, ...cfGabungan].reduce((acc, curr) => {
                  if (!acc[curr.namaObat])
                    acc[curr.namaObat] = { awal: [], gabungan: [] };

                  if (curr.gejala) {
                    acc[curr.namaObat].awal.push(curr);
                  } else {
                    acc[curr.namaObat].gabungan.push(curr);
                  }

                  return acc;
                }, {})
              ).map(([namaObat, data], index) => {
                const hasilTerakhir = data.gabungan
                  .at(-1)
                  ?.rumus.split("=")
                  .pop()
                  ?.trim();

                return (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded shadow-sm border text-sm space-y-4"
                  >
                    <p className="font-semibold text-base">Obat: {namaObat}</p>

                    {/* CF Awal */}
                    {data.awal.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-1">
                          1. Perkalian CF Pakar × CF Pengguna
                        </h4>
                        {data.awal.map((item, idx) => (
                          <div key={idx}>
                            <p className="text-gray-700">
                              Gejala:{" "}
                              <span className="italic">{item.gejala}</span>
                            </p>
                            <p>CF = CF Pakar × CF Pengguna</p>
                            <p>
                              CF = {item.cfPakar} × {item.cfUser}
                            </p>
                            <p>
                              CF ={" "}
                              <span className="font-bold">
                                {item.cfKombinasi.toFixed(2)}
                              </span>
                            </p>
                            {idx < data.awal.length - 1 && (
                              <hr className="my-2" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Kombinasi CF */}
                    {data.gabungan.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-1">2. Kombinasi CF</h4>
                        <p className="text-gray-700">Kombinasi CF:</p>
                        {data.gabungan.map((item, idx) => {
                          const huruf = String.fromCharCode(65 + idx);
                          const hasil = item.rumus.split("=").pop()?.trim();
                          return (
                            <div key={idx}>
                              <p className="ml-2">
                                CF {huruf} = {item.kombinasiSebelumnya} +{" "}
                                {item.cfBaru} × (1 - {item.kombinasiSebelumnya})
                                = <span className="font-bold">{hasil}</span>
                              </p>
                              {idx < data.gabungan.length - 1 && (
                                <hr className="my-2" />
                              )}
                            </div>
                          );
                        })}

                        {/* Presentase akhir */}
                        {hasilTerakhir && (
                          <p className="ml-2 font-semibold pt-2">
                            Presentase ={" "}
                            <span className="font-bold">
                              {(hasilTerakhir * 100).toFixed(2)}%
                            </span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HasilCobaPerhitungan;

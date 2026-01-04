import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../auth/Firebase";
import { formatTanggal } from "../../utils/helper";

const RiwayatModal = ({ isOpen, onClose, data }) => {
  const [hasilDetail, setHasilDetail] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !data) return;

    const fetchDetail = async () => {
      try {
        const hasilWithDetail = await Promise.all(
          data.hasil.map(async (h) => {
            // 🔹 Ambil penyakit
            let penyakitNama = "Tidak diketahui";
            let penyakitKode = "-";

            try {
              const snap = await getDoc(doc(db, "penyakit", h.penyakitId));
              if (snap.exists()) {
                penyakitNama = snap.data().nama;
                penyakitKode = snap.data().kode;
              }
            } catch {}

            // 🔹 Ambil rekomendasi
            let rekomendasiDetail = [];
            if (h.rekomendasiList?.length) {
              rekomendasiDetail = await Promise.all(
                h.rekomendasiList.map(async (rid) => {
                  try {
                    const rSnap = await getDoc(doc(db, "rekomendasi", rid));
                    if (rSnap.exists()) {
                      return rSnap.data(); // { isi, jenis }
                    }
                  } catch {}
                  return null;
                })
              );

              rekomendasiDetail = rekomendasiDetail.filter(Boolean);
            }

            return {
              ...h,
              penyakitNama,
              penyakitKode,
              rekomendasiDetail,
            };
          })
        );

        setHasilDetail(hasilWithDetail);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [isOpen, data]);

  if (!isOpen || !data) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 px-3 flex items-center sm:items-start sm:pt-5 justify-center bg-black bg-opacity-60 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-lg shadow-lg w-full max-w-4xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* HEADER */}
          <div className="flex justify-between items-center px-5 py-3 border-b">
            <h3 className="text-lg font-semibold text-[#467D40]">
              Detail Riwayat Diagnosis
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded hover:bg-red-500 hover:text-white transition"
            >
              ✕
            </button>
          </div>

          {/* CONTENT */}
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-sm">
            <p>
              <b>Tanggal Diagnosis:</b> {formatTanggal(data.createdAt.toDate())}
            </p>

            {/* GEJALA */}
            <div>
              <h4 className="font-semibold mb-1">Gejala Dipilih</h4>
              <ul className="list-disc list-inside text-gray-700">
                {data.gejalaDipilih.map((g, i) => (
                  <li key={i}>
                    {g.nama} — <b>{(g.cfUser * 100).toFixed(0)}%</b>
                  </li>
                ))}
              </ul>
            </div>

            {/* HASIL */}
            <div>
              <h4 className="font-semibold mb-2">Hasil Diagnosis</h4>

              {loading ? (
                <p>Memuat detail...</p>
              ) : (
                hasilDetail.map((h, i) => (
                  <div
                    key={i}
                    className="border rounded p-3 mb-3 bg-gray-50"
                  >
                    <p className="font-semibold text-[#467D40]">
                      {h.penyakitKode} - {h.penyakitNama}
                    </p>
                    <p className="text-red-500 font-bold">
                      Keyakinan: {(h.cf * 100).toFixed(0)}%
                    </p>

                    {h.rekomendasiDetail.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium">Rekomendasi:</p>
                        <ul className="list-disc list-inside text-gray-700">
                          {h.rekomendasiDetail.map((r, idx) => (
                            <li key={idx}>
                              <b>{r.jenis}</b>: {r.isi}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end px-5 py-3 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#467D40] text-[#467D40] rounded hover:bg-gray-100 transition"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RiwayatModal;

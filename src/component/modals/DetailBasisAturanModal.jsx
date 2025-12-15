import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../auth/Firebase";
import EditBasisAturanModal from "./EditBasisAturanModal";

const DetailBasisAturanModal = ({
  setIsOpenModal,
  dataAturan,
  handleDelete,
  getData,
}) => {
  const [rekomendasiData, setRekomendasiData] = useState(null);
  const [loadingRekom, setLoadingRekom] = useState(false);
  const [dataEdit, setDataEdit] = useState(null);
  const [openModalEdit, setOpenModalEdit] = useState(false);

  const [penyakitName, setPenyakitName] = useState("");
  const [gejalaListFull, setGejalaListFull] = useState([]);

  const getAllData = {
    fetchPenyakitName: async () => {
      if (!dataAturan?.penyakitId) return;

      try {
        const ref = doc(db, "penyakit", dataAturan.penyakitId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setPenyakitName(snap.data().nama);
        } else {
          setPenyakitName("Tidak ditemukan");
        }
      } catch (err) {
        console.error(err);
        setPenyakitName("Error memuat");
      }
    },

    fetchGejalaAll: async () => {
      if (!dataAturan?.gejalaList) return;

      const result = [];

      for (let item of dataAturan.gejalaList) {
        const ref = doc(db, "gejala", item.gejalaId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          result.push({
            kode: snap.data().kode,
            nama: snap.data().nama,
            cf: item.cf,
          });
        }
      }

      setGejalaListFull(result);
    },

    fetchAllRekomendasi: async () => {
      if (
        !dataAturan?.rekomendasiList ||
        dataAturan.rekomendasiList.length === 0
      )
        return;

      try {
        setLoadingRekom(true);

        let ids = Array.isArray(dataAturan.rekomendasiList)
          ? dataAturan.rekomendasiList
          : [dataAturan.rekomendasiList];

        const fetchPromises = ids.map(async (id) => {
          const ref = doc(db, "rekomendasi", id);
          const snap = await getDoc(ref);
          return snap.exists() ? { id, ...snap.data() } : null;
        });

        const results = await Promise.all(fetchPromises);
        setRekomendasiData(results.filter((x) => x !== null));
      } catch (err) {
        console.error("Error memuat rekomendasi:", err);
      } finally {
        setLoadingRekom(false);
      }
    },
  };

  useEffect(() => {
    getData();
    getAllData.fetchPenyakitName();
  }, [dataAturan?.penyakitId]);

  useEffect(() => {
    getAllData.fetchGejalaAll();
  }, [dataAturan?.gejalaList]);

  useEffect(() => {
    getAllData.fetchAllRekomendasi();
  }, [dataAturan?.rekomendasiList]);

  const onEdit = () => {
    setOpenModalEdit(true);
    setDataEdit(dataAturan);
  };

  return (
    <div className="fixed inset-0 px-3 flex items-center sm:items-start sm:pt-3 justify-center bg-black bg-opacity-60 z-40">
      <AnimatePresence>
        {openModalEdit && (
          <EditBasisAturanModal
            setIsOpenEdit={setOpenModalEdit}
            dataAturan={dataEdit}
            penyakitName={penyakitName}
            getData={getData}
            getAllData={getAllData} // ⬅️ KIRIM OBJECT
          />
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.3 }}
        className="w-[900px] max-w-5xl mx-auto rounded-lg"
      >
        <div className="flex items-start justify-between p-5 border border-gray-400 bg-[#04BD51] rounded mb-1">
          <h3 className="text-xl font-semibold text-white">
            Detail Basis Aturan
          </h3>
          <button
            onClick={() => setIsOpenModal(false)}
            className="w-8 h-8 text-white hover:bg-red-500 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        <div className="bg-white rounded border border-[#04BD51]">
          <div className="p-6 space-y-6 text-gray-700 max-h-[70vh] overflow-y-auto">
            {/* ====================== NAMA PENYAKIT ====================== */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="text-lg font-semibold mb-2">Informasi Penyakit</h4>

              <div className="grid grid-cols-3 gap-4">
                <p className="text-sm font-medium">Nama Penyakit</p>
                <p className="col-span-2 font-semibold">{penyakitName}</p>
              </div>
            </div>

            {/* ====================== REKOMENDASI ====================== */}
            {loadingRekom ? (
              <p className="text-gray-600 text-sm">Memuat rekomendasi…</p>
            ) : rekomendasiData ? (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="text-lg font-semibold mb-3">
                  Daftar Rekomendasi Pengobatan
                </h4>

                <table className="w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-200 text-gray-700">
                      <th className="border px-3 py-2">No</th>
                      <th className="border px-3 py-2 text-left">Isi</th>
                      <th className="border px-3 py-2 text-left">Jenis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rekomendasiData.map((item, i) => (
                      <tr key={item.id} className="hover:bg-gray-100">
                        <td className="border px-3 py-2">{i + 1}</td>
                        <td className="border px-3 py-2">{item.isi}</td>
                        <td className="border px-3 py-2">{item.jenis}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            {/* ====================== GEJALA ====================== */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="text-lg font-semibold mb-3">Daftar Gejala</h4>

              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-3 py-2">No</th>
                    <th className="border px-3 py-2">Kode</th>
                    <th className="border px-3 py-2">Gejala</th>
                    <th className="border px-3 py-2">CF</th>
                  </tr>
                </thead>
                <tbody>
                  {gejalaListFull.map((g, i) => (
                    <tr key={i} className="hover:bg-gray-100">
                      <td className="border px-3 py-2">{i + 1}</td>
                      <td className="border px-3 py-2">{g.kode}</td>
                      <td className="border px-3 py-2">{g.nama}</td>
                      <td className="border px-3 py-2">{g.cf}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 p-4 border-t">
            <button
              onClick={() => {
                onEdit(dataAturan);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Hapus
            </button>

            <button
              onClick={() => setIsOpenModal(false)}
              className="px-4 py-2 bg-gray-200 border rounded hover:bg-gray-100"
            >
              Tutup
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DetailBasisAturanModal;

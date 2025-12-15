import React, { useEffect, useState } from "react";
import { db } from "../../auth/Firebase";
import {
  collection,
  getDocs, 
  doc,
  updateDoc,
} from "firebase/firestore";
import { motion } from "framer-motion";

const EditBasisAturanModal = ({
  setIsOpenEdit,
  dataAturan,
  penyakitName,
  getData,
  getAllData
}) => {
  const [gejalaOptions, setGejalaOptions] = useState([]);
  const [rekomOptions, setRekomOptions] = useState([]);
  const [gejalaList, setGejalaList] = useState([]);
  const [selectedRekom, setSelectedRekom] = useState([]);

  const [loading, setLoading] = useState(false);

  // ========================================
  // LOAD DATA PERTAMA KALI
  // ========================================
  useEffect(() => {
    if (dataAturan) {
      setSelectedRekom(dataAturan.rekomendasiList || []);

      setGejalaList(
        dataAturan.gejalaList.map((g) => ({
          gejalaId: g.gejalaId,
          gejala: g.gejala,
          kode_gejala: g.kode_gejala,
          cf: g.cf * 100, // convert 0.1 → 10%
        }))
      );
    }
  }, [dataAturan]);
  useEffect(() => {
    const loadData = async () => {
      const gejalaSnap = await getDocs(collection(db, "gejala"));
      setGejalaOptions(
        gejalaSnap.docs.map((d) => ({
          id: d.id,
          nama: d.data().nama,
          kode: d.data().kode,
        }))
      );

      const rekomSnap = await getDocs(collection(db, "rekomendasi"));
      setRekomOptions(
        rekomSnap.docs.map((d) => ({
          id: d.id,
          isi: d.data().isi,
          jenis: d.data().jenis,
        }))
      );
    };

    loadData();
  }, []);

  // ========================================
  // HANDLER
  // ========================================
  const handleChangeGejala = (i, id) => {
    const selected = gejalaOptions.find((g) => g.id === id);
    const updated = [...gejalaList];
    updated[i].gejalaId = id;
    updated[i].gejala = selected?.nama;
    updated[i].kode_gejala = selected?.kode;
    setGejalaList(updated);
  };

  const handleChangeCF = (i, value) => {
    const updated = [...gejalaList];
    updated[i].cf = Number(value);
    setGejalaList(updated);
  };

  const handleChangeRekom = (id) => {
    setSelectedRekom((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleTambahGejala = () => {
    setGejalaList([
      ...gejalaList,
      { gejalaId: "", gejala: "", kode_gejala: "", cf: 10 },
    ]);
  };

  const handleHapusGejala = (i) => {
    setGejalaList(gejalaList.filter((_, idx) => idx !== i));
  };

  // ========================================
  // SUBMIT UPDATE
  // ========================================
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (gejalaList.some((g) => !g.gejalaId))
      return alert("Masih ada gejala yang belum dipilih!");

    if (selectedRekom.length === 0)
      return alert("Pilih minimal satu rekomendasi!");

    setLoading(true);

    try {
      const ref = doc(db, "gejala_penyakit", dataAturan.id);

      await updateDoc(ref, {
        gejalaList: gejalaList.map((g) => ({
          gejalaId: g.gejalaId || "",
          kode_gejala: g.kode_gejala || "",
          gejala: g.gejala || "",
          cf: Number((g.cf / 100).toFixed(1)) || 0.1,
        })),
        rekomendasiList: selectedRekom || [],
        updatedAt: new Date(),
      });


      getData();
      await getAllData.fetchAllRekomendasi();
      
      setIsOpenEdit(false);
      
    } catch (err) {
      console.error(err);
      alert("Gagal update data!");
    }
    
    await getAllData.fetchAllRekomendasi();
    getData();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 px-2 flex items-center sm:items-start sm:pt-3 justify-center bg-black/60 z-40">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-2xl bg-white rounded-lg shadow-xl"
      >
        {/* HEADER */}
        <div className="p-4 border-b flex justify-between">
          <h3 className="text-xl font-semibold text-gray-700">
            Edit Basis Aturan Penyakit
          </h3>
          <button
            onClick={() => setIsOpenEdit(false)}
            className="w-8 h-8 rounded-lg hover:bg-red-500 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
            {/* PENYAKIT (LOCKED) */}
            <div>
              <label className="text-sm font-medium">Penyakit</label>
              <input
                disabled
                value={penyakitName}
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 font-semibold"
              />
            </div>

            {/* REKOMENDASI */}
            <div className="border rounded-lg p-3">
              <label className="text-sm font-medium">
                Rekomendasi Pengobatan
              </label>

              <div className="max-h-40 overflow-y-auto mt-2 space-y-2">
                {rekomOptions.map((r) => (
                  <label key={r.id} className="flex gap-2 items-start">
                    <input
                      type="checkbox"
                      checked={selectedRekom.includes(r.id)}
                      onChange={() => handleChangeRekom(r.id)}
                    />
                    <div>
                      <p className="font-semibold">{r.jenis}</p>
                      <p className="text-sm text-gray-600">{r.isi}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* GEJALA */}
            <div className="space-y-4">
              {gejalaList.map((item, i) => (
                <div key={i} className="grid grid-cols-7 gap-2">
                  <select
                    value={item.gejalaId}
                    onChange={(e) => handleChangeGejala(i, e.target.value)}
                    className="col-span-4 border rounded px-3 py-2"
                  >
                    <option value="">Pilih Gejala</option>
                    {gejalaOptions.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.kode} — {g.nama}
                      </option>
                    ))}
                  </select>

                  <select
                    value={item.cf}
                    onChange={(e) => handleChangeCF(i, e.target.value)}
                    className="col-span-2 border rounded px-2 py-2"
                  >
                    {[...Array(10).keys()].map((x) => {
                      const persen = (x + 1) * 10;
                      return (
                        <option key={x} value={persen}>
                          {persen}%
                        </option>
                      );
                    })}
                  </select>

                  <button
                    type="button"
                    onClick={() => handleHapusGejala(i)}
                    className="bg-red-500 text-white px-3 py-2 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={handleTambahGejala}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                + Tambah Gejala
              </button>
            </div>
          </div>

          {/* FOOTER */}
          <div className="p-4 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsOpenEdit(false)}
              className="px-4 py-2 border bg-gray-200 rounded"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditBasisAturanModal;

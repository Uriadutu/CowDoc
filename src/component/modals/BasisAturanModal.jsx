import React, { useEffect, useState } from "react";
import { db } from "../../auth/Firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { motion } from "framer-motion";

const BasisAturanModal = ({ setIsOpenModal, getData }) => {
  const [penyakitOptions, setPenyakitOptions] = useState([]);
  const [gejalaOptions, setGejalaOptions] = useState([]);
  const [gejalaList, setGejalaList] = useState([]);
  const [namaPenyakit, setNamaPenyakit] = useState("");
  const [loading, setLoading] = useState(false);

  // 👉 Tambahan state untuk rekomendasi
  const [rekomOptions, setRekomOptions] = useState([]);
  const [selectedRekom, setSelectedRekom] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // =====================
        // AMBIL PENYAKIT
        // =====================
        const penyakitSnap = await getDocs(collection(db, "penyakit"));
        const penyakitData = penyakitSnap.docs.map((doc) => ({
          id: doc.id,
          nama: doc.data().nama,
        }));

        const aturanSnap = await getDocs(collection(db, "gejala_penyakit"));
        const penyakitSudahDipakai = aturanSnap.docs.map(
          (doc) => doc.data().penyakit
        );

        let filteredPenyakit = penyakitData.filter(
          (p) => !penyakitSudahDipakai.includes(p.nama)
        );

        if (filteredPenyakit.length === 0) {
          filteredPenyakit = [
            {
              id: "none",
              nama: "Semua Penyakit Sudah Diatur",
              disabled: true,
            },
          ];
        }

        setPenyakitOptions(filteredPenyakit);

        // =====================
        // AMBIL GEJALA
        // =====================

        const gejalaSnap = await getDocs(collection(db, "gejala"));
        const listGejala = gejalaSnap.docs.map((doc) => ({
          id: doc.id, // ✅ TAMBAHKAN ID
          nama: doc.data().nama,
          kode: doc.data().kode,
        }));
        setGejalaOptions(listGejala);

        // =====================
        // AMBIL REKOMENDASI PENGOBATAN
        // =====================
        const rekomSnap = await getDocs(collection(db, "rekomendasi"));
        const rekomData = rekomSnap.docs.map((doc) => ({
          id: doc.id,
          isi: doc.data().isi,
          jenis: doc.data().jenis,
        }));

        setRekomOptions(rekomData);
      } catch (error) {
        console.error("Error fetch:", error);
      }
    };

    fetchData();
  }, []);

  const handlePenyakitChange = (e) => {
    setNamaPenyakit(e.target.value);
    setGejalaList([]);
    setSelectedRekom([]); // reset rekomendasi juga
  };

  const handleTambahGejala = () => {
    setGejalaList([...gejalaList, { gejala: "", kode_gejala: "", cf: "1" }]);
  };

  const handleHapusGejala = (i) => {
    setGejalaList(gejalaList.filter((_, idx) => idx !== i));
  };

  const handleChangeGejala = (i, value) => {
    const selected = gejalaOptions.find((g) => g.id === value);

    const updated = [...gejalaList];
    updated[i].gejalaId = selected?.id || ""; // ✅ SIMPAN ID GEJALA
    updated[i].gejala = selected?.nama || ""; // optional untuk display
    updated[i].kode_gejala = selected?.kode || "";
    setGejalaList(updated);
  };
  const handleChangeCF = (i, value) => {
    const updated = [...gejalaList];
    updated[i].cf = value;
    setGejalaList(updated);
  };

  const getAvailableGejala = (selectedGejala) =>
    gejalaOptions.filter(
      (g) =>
        !gejalaList.some((item) => item.gejala === g.nama) ||
        selectedGejala === g.nama
    );

  // 👉 Handle pilih rekomendasi pengobatan
  const handleChangeRekom = (id) => {
    if (selectedRekom.includes(id)) {
      setSelectedRekom(selectedRekom.filter((x) => x !== id));
    } else {
      setSelectedRekom([...selectedRekom, id]);
    }
  };

  // ----------------------------
  // SUBMIT
  // ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!namaPenyakit) return alert("Pilih penyakit terlebih dahulu.");

    if (selectedRekom.length === 0)
      return alert("Pilih minimal satu rekomendasi pengobatan.");

    if (gejalaList.some((x) => !x.gejala))
      return alert("Ada gejala yang belum dipilih!");

    if (gejalaList.some((x) => !x.cf))
      return alert("Ada nilai CF yang belum dipilih!");

    setLoading(true);

    try {
      await addDoc(collection(db, "gejala_penyakit"), {
        penyakitId: namaPenyakit, // 🔥 ID PENYAKIT
        gejalaList: gejalaList.map((item) => ({
          gejalaId: item.gejalaId, // 🔥 ID GEJALA
          kode_gejala: item.kode_gejala,
          cf: Number((item.cf / 100).toFixed(1)),
        })),
        rekomendasiList: selectedRekom, // 🔥 SUDAH ID
        createdAt: new Date(),
      });

      setIsOpenModal(false);
      getData();
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      alert("Gagal menyimpan basis aturan");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 px-2 flex items-center sm:items-start sm:pt-3 justify-center bg-black/60 z-40">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl bg-white rounded-lg shadow-xl"
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-700">
            Tambah Basis Aturan Penyakit
          </h3>
          <button
            onClick={() => setIsOpenModal(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-red-500 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
            {/* PILIH PENYAKIT */}
            <div>
              <label className="text-sm font-medium">Pilih Penyakit</label>
              <select
                value={namaPenyakit}
                onChange={handlePenyakitChange}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Pilih Penyakit...</option>

                {penyakitOptions.map((p) => (
                  <option
                    key={p.id}
                    value={p.disabled ? "" : p.id}
                    disabled={p.disabled}
                  >
                    {p.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* ============================== */}
            {/*      REKOMENDASI PENGOBATAN   */}
            {/* ============================== */}
            {namaPenyakit && (
              <div className="border rounded-lg p-3">
                <label className="font-medium text-sm">
                  Pilih Rekomendasi Pengobatan
                </label>

                <div className="max-h-40 overflow-y-auto mt-2 space-y-2">
                  {rekomOptions.map((r) => (
                    <label
                      key={r.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
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
            )}

            {/* GEJALA LIST */}
            {namaPenyakit && (
              <div className="space-y-4">
                {gejalaList.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-7 gap-2 items-center"
                  >
                    <select
                      value={item.gejalaId}
                      onChange={(e) =>
                        handleChangeGejala(index, e.target.value)
                      }
                      className="col-span-4 px-3 py-2 border rounded-lg"
                    >
                      <option value="">Pilih Gejala</option>
                      {getAvailableGejala(item.gejala).map((g, i) => (
                        <option key={g.id} value={g.id}>
                          {g.kode} — {g.nama}
                        </option>
                      ))}
                    </select>

                    <select
                      value={item.cf}
                      onChange={(e) => handleChangeCF(index, e.target.value)}
                      className="col-span-2 px-2 py-2 border rounded-lg"
                    >
                      <option value="">CF</option>
                      {[...Array(10).keys()].map((i) => {
                        const persen = (i + 1) * 10;
                        return (
                          <option key={i} value={persen}>
                            {persen}%
                          </option>
                        );
                      })}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleHapusGejala(index)}
                      className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleTambahGejala}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  + Tambah Gejala
                </button>
              </div>
            )}
          </div>

          <div className="p-4 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsOpenModal(false)}
              className="px-4 py-2 bg-gray-200 border text-gray-600 rounded hover:bg-gray-100"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#00D020] text-white font-semibold rounded hover:bg-[#39dd52]"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default BasisAturanModal;

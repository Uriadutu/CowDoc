import React, { useEffect, useState } from "react";
import { auth, db } from "../../auth/Firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { IoSearch, IoEye } from "react-icons/io5";
import { formatTanggal } from "../../utils/helper";
import RiwayatModal from "../modals/RiwayatModal";

const RiwayatUser = () => {
  const [dataRiwayat, setDataRiwayat] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRiwayat, setSelectedRiwayat] = useState(null);

  const fetchRiwayat = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(
        collection(db, "riwayat_diagnosis"),
        where("userId", "==", user.uid)
      );

      const snap = await getDocs(q);

      let data = await Promise.all(
        snap.docs.map(async (docSnap) => {
          const d = docSnap.data();

          const hasilTerbesar = d.hasil.reduce((max, cur) =>
            cur.cf > max.cf ? cur : max
          );

          let namaPenyakit = "Tidak diketahui";
          try {
            const penyakitSnap = await getDoc(
              doc(db, "penyakit", hasilTerbesar.penyakitId)
            );
            if (penyakitSnap.exists()) {
              namaPenyakit = penyakitSnap.data().nama;
            }
          } catch {}

          return {
            id: docSnap.id,
            createdAt: d.createdAt?.toDate() || new Date(0), // ⬅️ simpan Date
            tanggal: formatTanggal(d.createdAt.toDate()),
            penyakit: namaPenyakit,
            cf: hasilTerbesar.cf,
            jumlahGejala: d.gejalaDipilih.length,
            raw: d,
          };
        })
      );

      // ✅ SORT PALING BARU DI ATAS
      data.sort((a, b) => b.createdAt - a.createdAt);

      setDataRiwayat(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const filteredData = dataRiwayat.filter((r) =>
    r.penyakit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="heading">
        Riwayat Diagnosis
        <br />
        <span className="text-sm font-medium">
          Riwayat hasil diagnosis Anda
        </span>
      </h1>

      <div className="flex justify-end mb-2">
        <div className="flex p-2 border rounded border-gray-200 items-center bg-white">
          <input
            type="text"
            placeholder="Cari penyakit"
            className="text-sm outline-0 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IoSearch color="silver" />
        </div>
      </div>

      <div className="w-full max-w-full overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700 bg-white">
          <thead>
            <tr className="text-center text-[#467D40]">
              <th className="border px-4 py-2">Tanggal</th>
              <th className="border px-4 py-2">Penyakit Teratas</th>
              <th className="border px-4 py-2">Keyakinan</th>
              <th className="border px-4 py-2">Jumlah Gejala Dipilih</th>
              <th className="border px-4 py-2">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  Memuat data...
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((r) => (
                <tr key={r.id} className="hover:bg-gray-100 text-center">
                  <td className="border px-4 py-2">{r.tanggal}</td>
                  <td className="border px-4 py-2 font-medium">{r.penyakit}</td>
                  <td className="border px-4 py-2 text-red-500 font-bold">
                    {(r.cf * 100).toFixed(0)}%
                  </td>
                  <td className="border px-4 py-2">{r.jumlahGejala}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-500 text-white p-1"
                      title="Lihat Detail"
                      onClick={() => {
                        setSelectedRiwayat(r.raw);
                        setOpenModal(true);
                      }}
                    >
                      <IoEye />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="border px-4 py-2 text-center text-gray-500"
                >
                  Belum ada riwayat diagnosis
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <RiwayatModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        data={selectedRiwayat}
      />
    </div>
  );
};

export default RiwayatUser;
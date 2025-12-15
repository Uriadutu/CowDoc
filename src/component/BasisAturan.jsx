import React, { useEffect, useState } from "react";
import AddBasisAturanModal from "./modals/BasisAturanModal";
import DetailBasisAturanModal from "./modals/DetailBasisAturanModal";
import EditBasisAturanModal from "./modals/EditBasisAturanModal";
import { AnimatePresence } from "framer-motion";
import { db } from "../auth/Firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { IoSearch } from "react-icons/io5";

const BasisAturan = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [selectedData, setSelectedData] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔥 Penyakit & Gejala mapping
  const [penyakitMap, setPenyakitMap] = useState({});
  const [gejalaMap, setGejalaMap] = useState({});

  // =====================================================
  // FETCH Penyakit & Gejala terlebih dahulu (sekali saja)
  // =====================================================
  useEffect(() => {
    fetchPenyakitDanGejala();
  }, []);

  const fetchPenyakitDanGejala = async () => {
    // Fetch penyakit
    const penyakitSnap = await getDocs(collection(db, "penyakit"));
    const penyakitObj = {};
    penyakitSnap.forEach((doc) => {
      const d = doc.data();
      penyakitObj[doc.id] = d.nama || d.penyakit || "Tanpa Nama";
    });

    // Fetch gejala
    const gejalaSnap = await getDocs(collection(db, "gejala"));
    const gejalaObj = {};
    gejalaSnap.forEach((doc) => {
      const d = doc.data();
      gejalaObj[doc.id] = {
        nama: d.nama,
        kode: d.kode,
      };
    });

    setPenyakitMap(penyakitObj);
    setGejalaMap(gejalaObj);
  };

  // =====================================================
  // FETCH DATA Basis Aturan
  // =====================================================
  useEffect(() => {
    fetchBasisAturan();
  }, [openModal, openDetailModal, openEditModal]);

  const fetchBasisAturan = async () => {
    const querySnapshot = await getDocs(collection(db, "gejala_penyakit"));

    const list = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const sorted = list.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return a.createdAt.seconds - b.createdAt.seconds;
      }
      return a.id.localeCompare(b.id);
    });

    setDataList(sorted);
  };

  // =====================================================
  // DETAIL
  // =====================================================
  const handleDetail = (data) => {
    setSelectedData(data);
    setOpenDetailModal(true);
  };

  // =====================================================
  // DELETE
  // =====================================================
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus basis aturan ini?")) return;

    try {
      await deleteDoc(doc(db, "gejala_penyakit", id));
      setOpenDetailModal(false);
      fetchBasisAturan();
    } catch (error) {
      console.error("Error delete:", error);
      alert("Gagal menghapus data");
    }
  };

  // =====================================================
  // EDIT
  // =====================================================
  const openEdit = (item) => {
    setSelectedData(item);
    setOpenEditModal(true);
  };

  // =====================================================
  // FILTER SEARCH
  // =====================================================
  const filteredData = dataList.filter((item) =>
    (penyakitMap[item.penyakitId] || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* MODAL TAMBAH */}
      <AnimatePresence>
        {openModal && (
          <AddBasisAturanModal
            setIsOpenModal={setOpenModal}
            getData={fetchBasisAturan}
          />
        )}
      </AnimatePresence>

      {/* MODAL DETAIL */}
      <AnimatePresence>
        {openDetailModal && selectedData && (
          <DetailBasisAturanModal
            setIsOpenModal={setOpenDetailModal}
            dataAturan={selectedData}
            handleDelete={() => handleDelete(selectedData.id)}
            onEditClick={openEdit}
            getData={fetchPenyakitDanGejala}
          />
        )}
      </AnimatePresence>

      {/* MODAL EDIT */}
      <AnimatePresence>
        {openEditModal && selectedData && (
          <EditBasisAturanModal
            setIsOpenModal={setOpenEditModal}
            selectedData={selectedData}
            getData={fetchBasisAturan}
          />
        )}
      </AnimatePresence>

      {/* HEADER */}
      <h1 className="heading">
        Basis Aturan <br />
        <span className="text-sm font-medium">Manajemen Rule CF</span>
      </h1>

      {/* SEARCH + ADD */}
      <div className="flex justify-between items-center">
        <button onClick={() => setOpenModal(true)} className="btn-add">
          Tambah Aturan
        </button>

        <div className="flex p-2 border rounded border-gray-200 items-center">
          <input
            type="text"
            placeholder="Cari penyakit..."
            className="text-sm outline-0 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IoSearch color="silver" />
        </div>
      </div>

      {/* TABEL */}
      <div className="w-full max-w-full overflow-x-auto mt-2">
        <table className="min-w-full text-sm text-gray-700 bg-white">
          <thead>
            <tr className="text-center text-[#467D40]">
              <th className="border px-4 py-2">No</th>
              <th className="border px-4 py-2 whitespace-nowrap">Penyakit</th>
              <th className="border px-4 py-2 whitespace-nowrap">Kode Gejala</th>
              <th className="border px-4 py-2 whitespace-nowrap">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <tr key={row.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2 text-center">{index + 1}</td>

                  {/* 🔥 Nama Penyakit (hasil mapping ID → Nama) */}
                  <td className="border px-4 py-2 font-semibold">
                    {penyakitMap[row.penyakitId] || "Tidak ditemukan"}
                  </td>

                  {/* 🔥 Kode Gejala */}
                  <td className="border px-4 py-2">
                    {row.gejalaList
                      .map((g) => gejalaMap[g.id]?.kode || g.kode_gejala || "-")
                      .join(", ")}
                  </td>

                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleDetail(row)}
                      className="text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="border px-4 py-2 text-center text-gray-500"
                >
                  Tidak ada data basis aturan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BasisAturan;

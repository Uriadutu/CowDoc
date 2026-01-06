import React, { useEffect, useState } from "react";
import AddPenyakitModal from "./modals/AddPenyakitModal";
import EditPenyakitModal from "./modals/EditPenyakitModal";
import { AnimatePresence } from "framer-motion";
import { db } from "../auth/Firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { capitalizeWords } from "../utils/helper";
import { IoPencil, IoSearch, IoTrash } from "react-icons/io5";

const DataPenyakit = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [selectedPenyakit, setSelectedPenyakit] = useState(null);
  const [dataPenyakit, setDataPenyakit] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPenyakit();
  }, [openModal, openModalEdit]);

  const fetchPenyakit = async () => {
    const querySnapshot = await getDocs(collection(db, "penyakit"));
    const penyakitList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sorting berdasarkan createdAt atau fallback ke id
    const sorted = penyakitList.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return a.createdAt.seconds - b.createdAt.seconds;
      }
      return a.id.localeCompare(b.id);
    });

    setDataPenyakit(sorted);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus penyakit ini?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "penyakit", id));
      setDataPenyakit((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Gagal menghapus penyakit:", error);
      alert("Gagal menghapus penyakit!");
    }
  };

  const handleEditPenyakit = (penyakit) => {
    setSelectedPenyakit(penyakit);
    setOpenModalEdit(true);
  };

  const filteredData = dataPenyakit.filter((p) =>
    p.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <AnimatePresence>
        {openModal && <AddPenyakitModal setIsOpenModalAdd={setOpenModal} />}
      </AnimatePresence>

      <AnimatePresence>
        {openModalEdit && selectedPenyakit && (
          <EditPenyakitModal
            setIsOpenModalEdit={setOpenModalEdit}
            penyakit={selectedPenyakit}
          />
        )}
      </AnimatePresence>

      <h1 className="heading">
        Daftar Penyakit <br />
        <span className="text-sm font-medium">Manajemen Data Penyakit</span>
      </h1>

      <div className="flex justify-between items-center">
        <button onClick={() => setOpenModal(true)} className="btn-add">
          Tambah Penyakit
        </button>

        <div className="flex p-2 border rounded border-gray-200 items-center">
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

      <div className="w-full max-w-full overflow-x-auto mt-2">
        <div className="sm:w-auto w-auto">
          <table className="min-w-full text-sm text-gray-700 bg-white">
            <thead>
              <tr className="text-center text-[#467D40]">
                <th className="border px-4 py-2">Kode Penyakit</th>
                <th className="border px-4 py-2">Nama Penyakit</th>
                <th className="border px-4 py-2">Deskripsi</th>
                <th className="border px-4 py-2">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{p.kode}</td>
                    <td className="border px-4 py-2">
                      {capitalizeWords(p.nama)}
                    </td>
                    <td className="border px-4 py-2">
                      {capitalizeWords(p.deskripsi)}
                    </td>

                    <td className="border px-4 py-2 text-center">
                      <div className="flex">
                        <button
                          onClick={() => handleEditPenyakit(p)}
                          className="text-white bg-blue-500 p-1 hover:underline mr-2"
                        >
                          <IoPencil />
                        </button>

                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-white bg-red-500 p-1 hover:underline"
                        >
                          <IoTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="border px-4 py-2 text-center text-gray-500"
                  >
                    Tidak ada data penyakit
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataPenyakit;

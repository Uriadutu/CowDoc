import React, { useEffect, useState } from "react";
import AddRekomModal from "./modals/AddRekomModal";
import EditRekomModal from "./modals/EditRekomModal";
import { AnimatePresence } from "framer-motion";
import { db } from "../auth/Firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { IoPencil, IoTrash, IoSearch } from "react-icons/io5";

const RekomendasiPengobatan = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [selectedRekom, setSelectedRekom] = useState(null);
  const [dataRekom, setDataRekom] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRekomendasi();
  }, [openModal, openModalEdit]);

  const fetchRekomendasi = async () => {
    const querySnapshot = await getDocs(collection(db, "rekomendasi"));
    const rekomList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const sorted = rekomList.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return a.createdAt.seconds - b.createdAt.seconds;
      }
      return a.id.localeCompare(b.id);
    });

    setDataRekom(sorted);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus data ini?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "rekomendasi", id));
      setDataRekom((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Gagal menghapus rekomendasi:", error);
      alert("Gagal menghapus data!");
    }
  };

  const handleEdit = (rek) => {
    setSelectedRekom(rek);
    setOpenModalEdit(true);
  };

  const filteredData = dataRekom.filter((rek) =>
    rek.isi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <AnimatePresence>
        {openModal && <AddRekomModal setIsOpenModalAdd={setOpenModal} />}
      </AnimatePresence>

      <AnimatePresence>
        {openModalEdit && selectedRekom && (
          <EditRekomModal
            setIsOpenModalEdit={setOpenModalEdit}
            rekom={selectedRekom}
          />
        )}
      </AnimatePresence>

      <h1 className="heading">
        Rekomendasi Pengobatan
        <br />
        <span className="text-sm font-medium">Manajemen Data Rekomendasi</span>
      </h1>

      <div className="flex justify-between items-center">
        <button onClick={() => setOpenModal(true)} className="btn-add">
          Tambah Rekomendasi
        </button>

        <div className="flex p-2 border rounded border-gray-200 items-center">
          <input
            type="text"
            placeholder="Cari rekomendasi"
            className="text-sm outline-0 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IoSearch color="silver" />
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full max-w-full overflow-x-auto mt-2">
        <table className="min-w-full text-sm text-gray-700 bg-white">
          <thead>
            <tr className="text-center text-[#467D40]">
              <th className="border px-4 py-2">No</th>
              <th className="border px-4 py-2 whitespace-nowrap">Isi Rekomendasi</th>
              <th className="border px-4 py-2 whitespace-nowrap">Jenis Pengobatan</th>
              <th className="border px-4 py-2 whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((rek, index) => (
                <tr key={rek.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2 text-center">{index + 1}</td>
                  <td className="border px-4 py-2">{rek.isi}</td>
                  <td className="border px-4 py-2">{rek.jenis}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(rek)}
                      className="text-white bg-blue-500 p-1 mr-2"
                    >
                      <IoPencil />
                    </button>
                    <button
                      onClick={() => handleDelete(rek.id)}
                      className="text-white bg-red-500 p-1"
                    >
                      <IoTrash />
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
                  Tidak ada data rekomendasi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RekomendasiPengobatan;

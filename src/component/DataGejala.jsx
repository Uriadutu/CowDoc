import React, { useEffect, useState } from "react";
import AddGejalaModal from "./modals/AddGejalaModal";
import EditGejalaModal from "./modals/EditGejalaModal";
import { AnimatePresence } from "framer-motion";
import { db } from "../auth/Firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { capitalizeWords } from "../utils/helper";
import { IoPencil, IoSearch, IoTrash } from "react-icons/io5";

const DataGejala = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [selectedGejala, setSelectedGejala] = useState(null);
  const [dataGejala, setDataGejala] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchGejala();
  }, [openModal, openModalEdit]);

  const fetchGejala = async () => {
    const querySnapshot = await getDocs(collection(db, "gejala"));
    const gejalaList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Tambahkan sorting berdasarkan timestamp jika ada, fallback ke id
    const sortedGejala = gejalaList.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return a.createdAt.seconds - b.createdAt.seconds; // ascending
      }
      return a.id.localeCompare(b.id); // fallback
    });

    setDataGejala(sortedGejala);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus gejala ini?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "gejala", id));
      setDataGejala((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Gagal menghapus gejala:", error);
      alert("Gagal menghapus gejala!");
    }
  };

  const handleEditGejala = (gejala) => {
    setSelectedGejala(gejala);
    setOpenModalEdit(true);
  };

  const filteredData = dataGejala.filter((gejala) =>
    gejala.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="">
      <AnimatePresence>
        {openModal && <AddGejalaModal setIsOpenModalAdd={setOpenModal} />}
      </AnimatePresence>
      <AnimatePresence>
        {openModalEdit && selectedGejala && (
          <EditGejalaModal
            setIsOpenModalEdit={setOpenModalEdit}
            gejala={selectedGejala}
          />
        )}
      </AnimatePresence>
      <h1 className="heading">
        Daftar Gejala <br />{" "}
        <span className="text-sm font-medium">Manajemen Data Gejala</span>
      </h1>{" "}
      <div className="flex justify-between items-center">
        <button onClick={() => setOpenModal(true)} className="btn-add">
          Tambah Gejala
        </button>
        <div className="flex p-2 border rounded border-gray-200 items-center">
          <input
            type="text"
            placeholder="Cari gejala"
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
            <thead className="">
              <tr className="text-center text-[#467D40]">
                <th className="border px-4 py-2">Kode Gejala</th>
                <th className="border px-4 py-2 whitespace-nowrap">
                  Nama Gejala
                </th>
                <th className="border px-4 py-2 whitespace-nowrap">
                  Terkait Gejala
                </th>
                <th className="border px-4 py-2 whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((gejala, index) => (
                  <tr key={gejala.id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{gejala.kode}</td>
                    <td className="border px-4 py-2">
                      {capitalizeWords(gejala.nama)}
                    </td>
                    <td className="border px-4 py-2">
                      {capitalizeWords(gejala.terkait)}
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleEditGejala(gejala)}
                        className="text-white bg-blue-500 p-1 hover:underline mr-2 "
                      >
                        <IoPencil />
                      </button>
                      <button
                        onClick={() => handleDelete(gejala.id)}
                        className="text-white bg-red-500 p-1 hover:underline"
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
                    Tidak ada data gejala
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

export default DataGejala;

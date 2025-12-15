// import React, { useState, useEffect } from "react";
// import { AnimatePresence } from "framer-motion";
// import { db } from "../auth/Firebase";
// import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
// import AddKelolaDataModal from "./modals/BasisAturanModal";
// import { capitalizeWords } from "../utils/helper";
// import { IoSearch } from "react-icons/io5";

// const KelolaData = () => {
//   const [openModal, setOpenModal] = useState(false);
//   const [dataObat, setDataObat] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const obatSnapshot = await getDocs(collection(db, "obat"));
//       const obatData = obatSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       const obatDenganGejala = obatData.filter(obat => obat.gejalaList && obat.gejalaList.length > 0);
//       setDataObat(obatDenganGejala);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Apakah Anda yakin ingin menghapus semua gejala dari obat ini?")) return;
//     try {
//       const obatRef = doc(db, "obat", id);
//       await updateDoc(obatRef, { gejalaList: [] }); // Mengosongkan gejalaList
//       fetchData(); // Refresh data setelah update
//     } catch (error) {
//       console.error("Error deleting gejalaList:", error);
//     }
//   };

//   const filteredObat = dataObat.filter((obat) =>
//     obat.nama.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="p-4">
//       <AnimatePresence>
//         {openModal && <AddKelolaDataModal setIsOpenModalAdd={setOpenModal} getData={fetchData} />}
//       </AnimatePresence>

//       <div className="bg-white rounded shadow-lg">
//         <header className="border-b border-gray-200 px-3 py-4 font-bold text-xl">
//           <h1>Kelola Aturan</h1>
//         </header>
//         <div className="px-3 py-4">
//           <div className="flex justify-between items-center mb-4">
//             <button onClick={() => setOpenModal(true)} className="btn-add">
//               Kelola Aturan
//             </button>
//             <div className="flex p-2 border rounded border-gray-200 items-center">
//               <input
//                 type="text"
//                 placeholder="Cari nama obat"
//                 className="text-sm outline-0 w-full"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               <IoSearch color="silver" />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
//             {filteredObat.map((obat) => (
//               <div key={obat.id} className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 flex flex-col relative hover:scale-x-[1.02] transition duration-300">
//                 <h2 className="text-xl font-semibold text-gray-700">{capitalizeWords(obat.nama)}</h2>
//                 <ul className="mt-2 flex flex-col gap-1">
//                   {obat.gejalaList.map((gejala, index) => (
//                     <li key={index} className="bg-gray-100 rounded-lg px-3 py-2 flex justify-between">
//                       <span className="text-gray-500">{capitalizeWords(gejala.gejala)}</span>
//                       <span className="text-gray-600 font-medium">{(parseFloat(gejala.keyakinan) * 100).toFixed(0)}%</span>
//                     </li>
//                   ))}
//                 </ul>
//                 <button 
//                   onClick={() => handleDelete(obat.id)} 
//                   className="absolute top-0 right-0 text-sm text-black px-2 py-1 rounded rounded-tr-lg hover:bg-red-400 hover:text-white transition duration-300"
//                   title="Hapus Gejala"
//                 >
//                    ✕
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default KelolaData;

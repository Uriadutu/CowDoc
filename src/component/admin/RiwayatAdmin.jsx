import React, { useEffect, useState } from "react";
import { db } from "../../auth/Firebase";
import { collection, getDocs } from "firebase/firestore";
import { IoEye, IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const RiwayatAdmin = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const snap = await getDocs(collection(db, "users"));
      const data = snap.docs.map((doc, i) => ({
        id: doc.id,
        no: i + 1,
        ...doc.data(),
      }));
      setUsers(data);
    } catch (err) {
      console.error("Gagal ambil user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    (u.nama || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="heading">
        Riwayat Diagnosis
        <br />
        <span className="text-sm font-medium">
          Daftar pengguna sistem
        </span>
      </h1>

      {/* Search */}
      <div className="flex justify-end mb-2">
        <div className="flex p-2 border rounded border-gray-200 items-center bg-white">
          <input
            type="text"
            placeholder="Cari nama user"
            className="text-sm outline-0 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IoSearch color="silver" />
        </div>
      </div>

      {/* Table */}
      <div className="w-full max-w-full overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700 bg-white">
          <thead>
            <tr className="text-center text-[#467D40]">
              <th className="border px-4 py-2">No</th>
              <th className="border px-4 py-2">Nama</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Memuat data...
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((u, index) => (
                <tr
                  key={u.id}
                  className="hover:bg-gray-100 text-center"
                >
                  <td className="border px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border px-4 py-2 font-medium">
                    {u.nama || "-"}
                  </td>
                  <td className="border px-4 py-2 font-medium">
                    {u.email || "-"}
                  </td>
                  <td className="border px-4 py-2 font-medium">
                      {u.role}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-500 text-white p-1 rounded"
                      title="Lihat Riwayat"
                      onClick={() =>
                        navigate(u.uid + "/" + u.nama)
                      }
                    >
                      <IoEye />
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
                  Data user tidak ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiwayatAdmin;

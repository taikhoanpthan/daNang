import { useState } from "react";
import Swal from "sweetalert2";
import { getAllGroups, deleteGroup } from "../services/api";
import { toast } from "react-toastify";

export default function GroupManager() {
  const [groups, setGroups] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = async () => {
    const { value: password } = await Swal.fire({
      title: "Nhập mật khẩu",
      input: "password",
      inputPlaceholder: "Nhập mật khẩu...",
      confirmButtonText: "Xem",
    });

    if (!password) return;

    if (password !== "matkhau123") {
      toast.error("Sai mật khẩu ❌");
      return;
    }

    try {
      const res = await getAllGroups();
      setGroups(res.data);
      setIsOpen(true);
    } catch (err) {
      console.log(err);
      toast.error("Lỗi tải dữ liệu ❌");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Xoá nhóm?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteGroup(id);
      setGroups((prev) => prev.filter((g) => g.id !== id));
      toast.success("Đã xoá 🗑️");
    } catch {
      toast.error("Xoá thất bại ❌");
    }
  };

  return (
    <div className="bg-white p-3 rounded-xl shadow">
      <button
        onClick={handleOpen}
        className="w-full bg-black text-white py-2 rounded-lg"
      >
        📂 Xem danh sách nhóm
      </button>

      {isOpen && (
        <div className="mt-3 space-y-2">
          {groups.map((g) => (
            <div
              key={g.id}
              className="flex justify-between items-center bg-gray-100 p-2 rounded"
            >
              <div>
                <div className="font-semibold">ID: {g.id}</div>
                <div className="text-xs text-gray-500">
                  {g.users?.map((u) => u.name).join(", ")}
                </div>
              </div>

              <button
                onClick={() => handleDelete(g.id)}
                className="text-red-500"
              >
                Xoá
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
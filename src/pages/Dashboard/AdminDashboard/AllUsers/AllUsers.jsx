import { useState, useRef, useEffect } from "react";
import {
  FiMoreVertical,
  FiUser,
  FiSearch,
  FiShield,
  FiLock,
  FiUnlock,
  FiUserPlus,
} from "react-icons/fi";
import useCustomToast from "../../../../hooks/useCustomToast";
import useDatabaseData from "../../../../hooks/useDatabaseData";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";
import toast from "react-hot-toast";
import Pagination from "../../../../component/Pagination/Pagination";
import { capitalize } from "../../../../utils/capitalized";
import ProfileViewModal from "./ProfileViewModal";

const statusColors = {
  active: "badge-success",
  blocked: "badge-error",
};

const roleColors = {
  donor: "badge-primary",
  volunteer: "badge-secondary",
  admin: "badge-warning",
};

const AllUsers = () => {
  const { showConfirmationToast } = useCustomToast();
  const { axiosPublic } = useAxiosPublic();
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const dropdownRefs = useRef({});

  const queryParams = {
    accountStatus: filters.status === "all" ? undefined : filters.status,
    page: pagination.page,
    limit: pagination.limit,
    ...(filters.search && { search: filters.search }),
  };

  const { data, isLoading, refetch } = useDatabaseData("/users", queryParams);
  const usersData = data?.data || {};

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        activeDropdown &&
        !dropdownRefs.current[activeDropdown]?.contains(event.target)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleStatusFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, status: e.target.value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const toggleDropdown = (userId, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === userId ? null : userId);
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setActiveDropdown(null);
  };

  const handleCloseProfile = () => {
    setSelectedUser(null);
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    const confirmed = await showConfirmationToast({
      title: `Confirm ${newStatus === "active" ? "Unblock" : "Block"} User`,
      description: `Are you sure you want to ${
        newStatus === "active" ? "unblock" : "block"
      } this user?`,
      confirmText: newStatus === "active" ? "Unblock" : "Block",
      iconColor: newStatus === "active" ? "text-green-500" : "text-red-500",
    });

    if (confirmed) {
      try {
        await axiosPublic.patch(`/users/${userId}/status`, {
          status: newStatus,
        });
        toast.success(
          `User ${
            newStatus === "active" ? "unblocked" : "blocked"
          } successfully`
        );
        refetch();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to update user status"
        );
      }
    }
    setActiveDropdown(null);
  };

  const handleUpdateRole = async (userId, newRole) => {
    const confirmed = await showConfirmationToast({
      title: `Confirm Role Change`,
      description: `Are you sure you want to make this user a ${newRole}?`,
      confirmText: `Make ${newRole}`,
      iconColor: "text-blue-500",
    });

    if (confirmed) {
      try {
        await axiosPublic.patch(`/users/${userId}/role`, { role: newRole });
        toast.success(`User role updated to ${newRole} successfully`);
        refetch();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to update user role"
        );
      }
    }
    setActiveDropdown(null);
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">All Users</h1>

      <div className="flex flex-col md:flex-row justify-between gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="w-full md:w-auto">
          <select
            className="select  focus:outline-none w-full md:w-48"
            value={filters.status}
            onChange={handleStatusFilterChange}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search users..."
            className="input focus:outline-none w-full pl-10"
            value={filters.search}
            onChange={handleSearchChange}
          />
          <span className="absolute left-3 top-3 z-10">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center mt-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-primary text-primary-content">
                  <th className="py-3">User</th>
                  <th className="py-3">Email</th>
                  <th className="py-3">Role</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersData?.length > 0 ? (
                  usersData?.map((user) => (
                    <tr
                      key={user?._id}
                      className="hover:bg-base-200 hover:cursor-pointer"
                      onClick={() => handleViewProfile(user)}
                    >
                      <td>
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="avatar">
                            <div className="w-8 md:w-10 rounded-full">
                              <img
                                src={
                                  user?.image ||
                                  `https://ui-avatars.com/api/?name=${user?.name}&background=random`
                                }
                                alt={user?.name}
                              />
                            </div>
                          </div>
                          <div className="font-medium">{user?.name}</div>
                        </div>
                      </td>
                      <td className="truncate max-w-[120px] md:max-w-none">
                        {user?.email}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            roleColors[user?.role] || "badge-info"
                          }`}
                        >
                          {capitalize(user?.role)}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            statusColors[user?.accountStatus] || "badge-info"
                          }`}
                        >
                          {capitalize(user?.accountStatus)}
                        </span>
                      </td>
                      <td className="text-right relative">
                        <div className="dropdown dropdown-end">
                          <button
                            onClick={(e) => toggleDropdown(user?._id, e)}
                            className="btn btn-ghost btn-sm"
                          >
                            <FiMoreVertical className="h-5 w-5" />
                          </button>
                          {activeDropdown === user?._id && (
                            <div
                              ref={(el) =>
                                (dropdownRefs.current[user?._id] = el)
                              }
                              className="absolute right-0 mt-1 z-50"
                              style={{
                                position: "fixed",
                                transform: "translateX(-50%)",
                              }}
                            >
                              <ul className="menu p-2 shadow bg-base-100 rounded-box w-52">
                                <li>
                                  <button
                                    onClick={() => handleViewProfile(user)}
                                  >
                                    <FiUser className="mr-2" /> View Profile
                                  </button>
                                </li>

                                {user?.accountStatus === "active" ? (
                                  <li>
                                    <button
                                      onClick={() =>
                                        handleUpdateStatus(user?._id, "blocked")
                                      }
                                      className="text-error"
                                    >
                                      <FiLock className="mr-2" /> Block User
                                    </button>
                                  </li>
                                ) : (
                                  <li>
                                    <button
                                      onClick={() =>
                                        handleUpdateStatus(user?._id, "active")
                                      }
                                      className="text-success"
                                    >
                                      <FiUnlock className="mr-2" /> Unblock User
                                    </button>
                                  </li>
                                )}

                                {user?.role !== "volunteer" && (
                                  <li>
                                    <button
                                      onClick={() =>
                                        handleUpdateRole(user?._id, "volunteer")
                                      }
                                    >
                                      <FiUserPlus className="mr-2" /> Make
                                      Volunteer
                                    </button>
                                  </li>
                                )}

                                {user?.role !== "admin" && (
                                  <li>
                                    <button
                                      onClick={() =>
                                        handleUpdateRole(user?._id, "admin")
                                      }
                                    >
                                      <FiShield className="mr-2" /> Make Admin
                                    </button>
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {usersData?.meta?.totalPages > 1 && (
            <div className="mt-4 md:mt-6">
              <Pagination
                currentPage={pagination.page}
                totalPages={usersData?.meta?.totalPages || 1}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      {/* Profile View Modal */}
      {selectedUser && (
        <ProfileViewModal user={selectedUser} onClose={handleCloseProfile} />
      )}
    </div>
  );
};

export default AllUsers;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { StatusPill } from "../components/common/StatusPill";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { useAuth } from "../context/AuthContext";
import {
  Users,
  Search,
  Plus,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Phone,
  Building,
} from "lucide-react";

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    businessName: "",
    gstNumber: "",
    type: "Wholesale",
    address: "",
    status: "Lead",
    followUpDate: "",
    notes: "",
  });

  const { hasRole } = useAuth();
  const navigate = useNavigate();

  const fetchCustomers = async (page = 1) => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set("pageSize", "10");

      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (typeFilter) params.set("type", typeFilter);

      const res = await api.get(`/api/customers?${params.toString()}`);

      setCustomers(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(1);
  }, [search, statusFilter, typeFilter]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    try {
      await api.post("/api/customers", form);

      setIsCreateOpen(false);

      setForm({
        name: "",
        mobile: "",
        email: "",
        businessName: "",
        gstNumber: "",
        type: "Wholesale",
        address: "",
        status: "Lead",
        followUpDate: "",
        notes: "",
      });

      fetchCustomers(1);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create customer");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      await api.delete(`/api/customers/${deleteTarget.id}`);

      setDeleteTarget(null);

      fetchCustomers(meta.page);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete customer");

      setDeleteTarget(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* ================= HERO HEADER ================= */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-900 p-8 text-white shadow-2xl">

        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

        <div className="relative flex flex-col lg:flex-row justify-between gap-8">

          <div>

            <p className="uppercase tracking-[5px] text-xs font-mono text-indigo-100">
              Customer Relationship Management
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              Customers Directory
            </h1>

            <p className="mt-3 max-w-xl text-indigo-100">
              Manage wholesale customers, distributors, retailers and
              business relationships from one place.
            </p>

            <div className="flex flex-wrap gap-5 mt-8">

              <div className="bg-white/10 backdrop-blur rounded-2xl px-6 py-4">
                <Users className="mb-3" />
                <p className="text-xs text-indigo-100">
                  Total Customers
                </p>
                <h2 className="text-3xl font-bold">
                  {meta.total}
                </h2>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl px-6 py-4">
                <Building className="mb-3" />
                <p className="text-xs text-indigo-100">
                  Current Page
                </p>
                <h2 className="text-3xl font-bold">
                  {meta.page}
                </h2>
              </div>

            </div>

          </div>

          {hasRole("Admin", "Sales") && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 bg-white text-indigo-700 px-6 py-3 rounded-xl font-semibold shadow-xl hover:scale-105 transition h-fit"
            >
              <Plus size={18} />
              Add Customer
            </button>
          )}

        </div>

      </div>
            {/* ================= SEARCH & FILTER ================= */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 flex items-center justify-between">
          <span className="text-red-700 text-sm font-medium">{error}</span>

          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl border border-indigo-100 p-6 flex flex-col lg:flex-row justify-between gap-5">

        <div className="relative w-full lg:w-96">

          <Search
            size={18}
            className="absolute left-4 top-3.5 text-indigo-500"
          />

          <input
            type="text"
            placeholder="Search customer, mobile or business..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-indigo-50 border border-indigo-200 outline-none focus:ring-2 focus:ring-indigo-500"
          />

        </div>

        <div className="flex flex-wrap gap-4">

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-5 py-3 rounded-xl bg-indigo-50 border border-indigo-200 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="Lead">Lead</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-5 py-3 rounded-xl bg-indigo-50 border border-indigo-200 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Types</option>
            <option value="Wholesale">Wholesale</option>
            <option value="Distributor">Distributor</option>
            <option value="Retail">Retail</option>
          </select>

        </div>

      </div>

      {/* ================= CUSTOMERS TABLE ================= */}

      <div className="bg-white rounded-3xl border border-indigo-100 shadow-xl overflow-hidden">

        {loading ? (

          <div className="p-12 text-center text-indigo-600 font-semibold">
            Loading customer records...
          </div>

        ) : customers.length === 0 ? (

          <div className="p-12 text-center">

            <Users
              size={50}
              className="mx-auto text-indigo-400 mb-4"
            />

            <h3 className="text-2xl font-bold text-indigo-700">
              No Customers Found
            </h3>

            <p className="text-gray-500 mt-2">
              Create your first customer to start managing your CRM.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white uppercase text-xs tracking-wider">

                  <th className="px-6 py-4 text-left">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-left">
                    Contact
                  </th>

                  <th className="px-6 py-4 text-left">
                    Type
                  </th>

                  <th className="px-6 py-4 text-left">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left">
                    Follow Up
                  </th>

                  <th className="px-6 py-4 text-right">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-indigo-100">
                                {customers.map((c) => (

                  <tr
                    key={c.id}
                    className="hover:bg-indigo-50 transition-all duration-200"
                  >

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">

                          <Users
                            size={20}
                            className="text-indigo-700"
                          />

                        </div>

                        <div>

                          <p className="font-bold text-gray-800">
                            {c.name}
                          </p>

                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">

                            <Building
                              size={14}
                              className="text-indigo-500"
                            />

                            {c.businessName}

                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="px-6 py-5">

                      <div className="space-y-1">

                        <p className="flex items-center gap-2 text-gray-700">

                          <Phone
                            size={15}
                            className="text-indigo-500"
                          />

                          {c.mobile}

                        </p>

                        <p className="text-sm text-gray-500">

                          {c.email}

                        </p>

                      </div>

                    </td>

                    <td className="px-6 py-5">

                      <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">

                        {c.type}

                      </span>

                    </td>

                    <td className="px-6 py-5">

                      <StatusPill status={c.status} />

                    </td>

                    <td className="px-6 py-5 text-gray-600">

                      {c.followUpDate
                        ? new Date(c.followUpDate).toLocaleDateString()
                        : "--"}

                    </td>

                    <td className="px-6 py-5 text-right">

                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() => navigate(`/customers/${c.id}`)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white transition"
                        >
                          <Eye size={16} />
                          View
                        </button>

                        {hasRole("Admin") && (

                          <button
                            onClick={() => setDeleteTarget(c)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>

                        )}

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ================= PAGINATION ================= */}

      <div className="bg-white rounded-2xl border border-indigo-100 shadow-lg p-5 flex flex-col sm:flex-row justify-between items-center gap-4">

        <div className="text-sm text-gray-600">

          Showing Page

          <span className="font-bold text-indigo-700 mx-1">

            {meta.page}

          </span>

          of

          <span className="font-bold text-indigo-700 mx-1">

            {meta.totalPages}

          </span>

          ({meta.total} records)

        </div>

        <div className="flex items-center gap-3">

          <button
            disabled={meta.page <= 1}
            onClick={() => fetchCustomers(meta.page - 1)}
            className="h-10 w-10 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-100 disabled:opacity-40 transition flex items-center justify-center"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold">

            {meta.page}

          </div>

          <button
            disabled={meta.page >= meta.totalPages}
            onClick={() => fetchCustomers(meta.page + 1)}
            className="h-10 w-10 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-100 disabled:opacity-40 transition flex items-center justify-center"
          >
            <ChevronRight size={18} />
          </button>

        </div>

      </div>
            {/* ================= CREATE CUSTOMER MODAL ================= */}

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">

            {/* Header */}

            <div className="bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-900 px-8 py-6 text-white">

              <h2 className="text-2xl font-bold">
                Add New Customer
              </h2>

              <p className="mt-1 text-sm text-indigo-100">
                Create a new customer account for wholesale, distributor or retail business.
              </p>

            </div>

            <form
              onSubmit={handleCreateSubmit}
              className="p-8 space-y-6 max-h-[75vh] overflow-y-auto"
            >

              {/* Contact Details */}

              <div className="grid md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Name
                  </label>

                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                </div>

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Number
                  </label>

                  <input
                    type="text"
                    required
                    value={form.mobile}
                    onChange={(e) =>
                      setForm({ ...form, mobile: e.target.value })
                    }
                    className="w-full rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                </div>

              </div>

              {/* Email */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />

              </div>

              {/* Business */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Name
                </label>

                <input
                  type="text"
                  required
                  value={form.businessName}
                  onChange={(e) =>
                    setForm({ ...form, businessName: e.target.value })
                  }
                  className="w-full rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />

              </div>

              {/* GST + Type */}

              <div className="grid md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    GST Number
                  </label>

                  <input
                    type="text"
                    value={form.gstNumber}
                    onChange={(e) =>
                      setForm({ ...form, gstNumber: e.target.value })
                    }
                    className="w-full rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                </div>

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Account Type
                  </label>

                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm({ ...form, type: e.target.value })
                    }
                    className="w-full rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Wholesale">Wholesale</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Retail">Retail</option>
                  </select>

                </div>

              </div>
                            {/* Address */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Billing / Delivery Address
                </label>

                <textarea
                  rows={3}
                  required
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  className="w-full rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />

              </div>

              {/* Status & Follow Up */}

              <div className="grid md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>

                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                    className="w-full rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Lead">Lead</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>

                </div>

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Follow Up Date
                  </label>

                  <input
                    type="date"
                    value={form.followUpDate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        followUpDate: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                </div>

              </div>

              {/* Notes */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes
                </label>

                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Additional customer notes..."
                  className="w-full rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />

              </div>

              {/* Footer */}

              <div className="flex justify-end gap-4 border-t border-indigo-100 pt-6">

                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-700 text-white font-semibold hover:from-indigo-700 hover:to-blue-800 transition shadow-lg"
                >
                  Create Customer
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* Delete Confirmation */}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        isDanger
        title={`Delete ${deleteTarget?.name}?`}
        message="This action will soft delete the customer."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { StockGauge } from '../components/common/StockGauge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useAuth } from '../context/AuthContext';
import {
  Package,
  Search,
  Plus,
  ArrowDownUp,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Warehouse,
} from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [adjustTarget, setAdjustTarget] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: 'Electrical',
    unitPrice: 100,
    currentStock: 10,
    minStockAlert: 5,
    warehouseLocation: 'Rack A-1',
  });

  const [adjustForm, setAdjustForm] = useState({
    quantityChanged: 5,
    movementType: 'IN',
    reason: 'Manual warehouse audit adjustment',
  });

  const { hasRole } = useAuth();
  const navigate = useNavigate();

  const fetchProducts = async (page = 1) => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      params.set('page', String(page));
      params.set('pageSize', '10');

      if (search) params.set('search', search);
      if (categoryFilter) params.set('category', categoryFilter);
      if (lowStockOnly) params.set('lowStockOnly', 'true');

      const res = await api.get(`/api/products?${params.toString()}`);

      setProducts(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [search, categoryFilter, lowStockOnly]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await api.post('/api/products', {
        ...form,
        unitPrice: Number(form.unitPrice),
        currentStock: Number(form.currentStock),
        minStockAlert: Number(form.minStockAlert),
      });

      setIsCreateOpen(false);
      fetchProducts(1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create product');
    }
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adjustTarget) return;

    setError(null);

    try {
      await api.post(`/api/products/${adjustTarget.id}/stock-movements`, {
        quantityChanged: Number(adjustForm.quantityChanged),
        movementType: adjustForm.movementType,
        reason: adjustForm.reason,
      });

      setAdjustTarget(null);
      fetchProducts(meta.page);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to record stock movement');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      await api.delete(`/api/products/${deleteTarget.id}`);

      setDeleteTarget(null);
      fetchProducts(meta.page);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete product');
      setDeleteTarget(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Hero Header */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 p-8 text-white shadow-2xl">

        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

        <div className="relative flex flex-col lg:flex-row justify-between gap-8">

          <div>

            <p className="uppercase tracking-[5px] text-xs font-mono text-indigo-100">
              Inventory Management
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              Inventory & Stock Ledger
            </h1>

            <p className="mt-3 max-w-xl text-indigo-100">
              Manage products, pricing, warehouse locations and stock movements
              with a centralized inventory dashboard.
            </p>

          </div>

          {hasRole('Admin', 'Warehouse') && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-indigo-50 transition"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          )}

        </div>

      </div>
            {/* Error Message */}

      {error && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-xl text-red-600 text-sm flex items-center justify-between shadow-sm">
          <span>{error}</span>

          <button
            onClick={() => setError(null)}
            className="text-xs font-semibold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search & Filters */}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 flex flex-wrap items-center justify-between gap-4">

        <div className="relative min-w-[280px] flex-1">

          <Search
            className="absolute left-4 top-3.5 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search SKU, Product Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
          />

        </div>

        <div className="flex flex-wrap gap-3">

          <label className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-sm font-medium text-gray-700">

            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => setLowStockOnly(e.target.checked)}
              className="accent-indigo-600"
            />

            <AlertTriangle
              className="text-amber-500"
              size={16}
            />

            Low Stock

          </label>

          <input
            type="text"
            placeholder="Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
          />

        </div>

      </div>

      {/* Products Table */}

      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">

        {loading ? (

          <div className="p-12 text-center text-gray-500 font-medium">
            Loading inventory...
          </div>

        ) : products.length === 0 ? (

          <div className="p-12 text-center">

            <Package
              className="mx-auto text-gray-400 mb-4"
              size={42}
            />

            <h3 className="text-xl font-bold text-gray-800">
              No Products Found
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Try changing your filters or create a new product.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-indigo-50 border-b border-gray-200 text-xs uppercase text-indigo-700 font-semibold">
                                    <th className="px-6 py-4 text-left">SKU / Product</th>
                  <th className="px-6 py-4 text-left">Category</th>
                  <th className="px-6 py-4 text-left">Unit Price</th>
                  <th className="px-6 py-4 text-left">Current Stock</th>
                  <th className="px-6 py-4 text-left">Warehouse</th>
                  <th className="px-6 py-4 text-right">Actions</th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-200">

                {products.map((p) => (

                  <tr
                    key={p.id}
                    className="hover:bg-indigo-50 transition duration-200"
                  >

                    {/* Product */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="h-11 w-11 rounded-xl bg-indigo-100 flex items-center justify-center">

                          <Package
                            size={20}
                            className="text-indigo-600"
                          />

                        </div>

                        <div>

                          <p className="font-bold text-indigo-600 font-mono">
                            [{p.sku}]
                          </p>

                          <p className="font-semibold text-gray-800">
                            {p.name}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Category */}

                    <td className="px-6 py-5">

                      <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">

                        {p.category}

                      </span>

                    </td>

                    {/* Price */}

                    <td className="px-6 py-5">

                      <p className="font-bold text-gray-800">

                        ₹{Number(p.unitPrice).toFixed(2)}

                      </p>

                    </td>

                    {/* Stock Gauge */}

                    <td className="px-6 py-5">

                      <StockGauge
                        currentStock={p.currentStock}
                        minStockAlert={p.minStockAlert}
                      />

                    </td>

                    {/* Warehouse */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-2">

                        <Warehouse
                          size={16}
                          className="text-indigo-600"
                        />

                        <span className="text-gray-700">

                          {p.warehouseLocation}

                        </span>

                      </div>

                    </td>

                    {/* Actions */}

                    <td className="px-6 py-5">

                      <div className="flex justify-end gap-2">

                        {hasRole("Admin", "Warehouse") && (

                          <button
                            onClick={() => setAdjustTarget(p)}
                            className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
                            title="Adjust Stock"
                          >

                            <ArrowDownUp size={16} />

                          </button>

                        )}

                        <button
                          onClick={() => navigate(`/products/${p.id}`)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                          title="View Product"
                        >

                          <Eye size={16} />

                        </button>

                        {hasRole("Admin") && (

                          <button
                            onClick={() => setDeleteTarget(p)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
                            title="Delete Product"
                          >

                            <Trash2 size={16} />

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
                {/* Pagination */}

        <div className="p-5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">

          <div className="text-sm text-gray-600">

            Showing Page

            <span className="font-bold text-gray-800">
              {" "}{meta.page}
            </span>

            {" "}of{" "}

            <span className="font-bold text-gray-800">
              {meta.totalPages}
            </span>

            <span className="ml-2 text-gray-500">
              ({meta.total} records)
            </span>

          </div>

          <div className="flex items-center gap-3">

            <button
              disabled={meta.page <= 1}
              onClick={() => fetchProducts(meta.page - 1)}
              className="flex items-center justify-center h-10 w-10 rounded-xl bg-white border border-gray-300 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 transition"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold">
              {meta.page}
            </div>

            <button
              disabled={meta.page >= meta.totalPages}
              onClick={() => fetchProducts(meta.page + 1)}
              className="flex items-center justify-center h-10 w-10 rounded-xl bg-white border border-gray-300 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 transition"
            >
              <ChevronRight size={18} />
            </button>

          </div>

        </div>

      </div>

      {/* ================= STOCK ADJUSTMENT MODAL ================= */}

      {adjustTarget && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-gray-200 p-6">

            <h2 className="text-2xl font-bold text-indigo-700">
              Adjust Stock
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {adjustTarget.name}
            </p>

            <form
              onSubmit={handleAdjustSubmit}
              className="space-y-5 mt-6"
            >

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Movement Type
                </label>

                <select
                  value={adjustForm.movementType}
                  onChange={(e) =>
                    setAdjustForm({
                      ...adjustForm,
                      movementType: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="IN">Stock In</option>
                  <option value="OUT">Stock Out</option>
                </select>

              </div>

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>

                <input
                  type="number"
                  value={adjustForm.quantityChanged}
                  onChange={(e) =>
                    setAdjustForm({
                      ...adjustForm,
                      quantityChanged: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

              </div>
                            <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>

                <textarea
                  rows={3}
                  value={adjustForm.reason}
                  onChange={(e) =>
                    setAdjustForm({
                      ...adjustForm,
                      reason: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  placeholder="Enter reason..."
                />

              </div>

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setAdjustTarget(null)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
                >
                  Save Adjustment
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ================= CREATE PRODUCT MODAL ================= */}

      {isCreateOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-gray-200 p-8">

            <h2 className="text-3xl font-bold text-indigo-700 mb-2">
              Add Product
            </h2>

            <p className="text-gray-500 mb-6">
              Create a new inventory product.
            </p>

            <form
              onSubmit={handleCreateSubmit}
              className="space-y-5"
            >

              <div className="grid md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU
                  </label>

                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        sku: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />

                </div>

              </div>

              <div className="grid md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>

                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Price
                  </label>

                  <input
                    type="number"
                    value={form.unitPrice}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        unitPrice: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />

                </div>

              </div>
                            <div className="grid md:grid-cols-3 gap-5">

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Stock
                  </label>

                  <input
                    type="number"
                    value={form.currentStock}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        currentStock: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Stock Alert
                  </label>

                  <input
                    type="number"
                    value={form.minStockAlert}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        minStockAlert: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warehouse Location
                  </label>

                  <input
                    type="text"
                    value={form.warehouseLocation}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        warehouseLocation: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />

                </div>

              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">

                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-6 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition"
                >
                  Create Product
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ================= DELETE CONFIRM DIALOG ================= */}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        isDanger={true}
        title={`Soft Delete Product '[${deleteTarget?.sku}] ${deleteTarget?.name}'?`}
        message="If this product is referenced in active Draft challans, deletion will be blocked."
        confirmLabel="Delete Product"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

    </div>

  );

};

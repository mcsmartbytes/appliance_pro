'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface InventoryStats {
  total_items: number;
  total_units: number;
  low_stock_count: number;
  out_of_stock_count: number;
  total_value: number;
}

interface InventoryItem {
  id: string;
  item_type: string;
  title: string;
  sku: string | null;
  quantity_on_hand: number;
  reorder_point: number;
  status: string;
  price: number | null;
  stock_status: 'OK' | 'LOW' | 'OUT';
  part_number: string | null;
  model_number: string | null;
  brand_name: string | null;
  category_name: string | null;
  primary_photo_url: string | null;
  units_needed?: number;
}

export default function InventoryDashboard() {
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ quantity: 0, reorder_point: 0 });

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        filter,
        type: typeFilter,
        search,
      });
      const res = await fetch(`/api/admin/inventory?${params}`);
      const data = await res.json();
      setStats(data.stats);
      setItems(data.items || []);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, typeFilter, search]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditValues({
      quantity: item.quantity_on_hand,
      reorder_point: item.reorder_point,
    });
  };

  const handleSave = async (itemId: string) => {
    try {
      const res = await fetch(`/api/admin/inventory/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: editValues.quantity,
          reorder_point: editValues.reorder_point,
          change_type: 'ADJUSTMENT',
          notes: 'Manual adjustment from admin',
        }),
      });

      if (res.ok) {
        setEditingId(null);
        fetchInventory();
      }
    } catch (error) {
      console.error('Failed to update:', error);
    }
  };

  const handleRestock = async (itemId: string, addQty: number) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    try {
      await fetch(`/api/admin/inventory/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: item.quantity_on_hand + addQty,
          change_type: 'RESTOCK',
          notes: `Restocked ${addQty} units`,
        }),
      });
      fetchInventory();
    } catch (error) {
      console.error('Failed to restock:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getStockBadge = (status: string) => {
    switch (status) {
      case 'OUT':
        return 'bg-red-100 text-red-800';
      case 'LOW':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-emerald-100 text-emerald-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            <a
              href="/"
              className="text-blue-700 hover:text-blue-800 font-medium"
            >
              ← Back to Site
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_items}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Total Units</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_units}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-2xl font-bold text-amber-600">{stats.low_stock_count}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{stats.out_of_stock_count}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total_value)}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'low' | 'out')}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Items</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Types</option>
                <option value="PART">Parts</option>
                <option value="USED_UNIT">Used</option>
                <option value="NEW_MODEL">New</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or part number..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        {stats && stats.low_stock_count > 0 && filter !== 'low' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-amber-800 font-medium">
                {stats.low_stock_count} item(s) need reordering
              </span>
            </div>
            <button
              onClick={() => setFilter('low')}
              className="text-amber-700 hover:text-amber-800 font-medium"
            >
              View Low Stock →
            </button>
          </div>
        )}

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No items found
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Item</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Type</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">Qty</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">Reorder At</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          {item.primary_photo_url ? (
                            <Image
                              src={item.primary_photo_url}
                              alt={item.title}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{item.title}</p>
                          <p className="text-sm text-gray-500">
                            {item.part_number || item.model_number || item.sku || '-'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.item_type === 'PART' ? 'Part' : item.item_type === 'USED_UNIT' ? 'Used' : 'New'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {editingId === item.id ? (
                        <input
                          type="number"
                          value={editValues.quantity}
                          onChange={(e) => setEditValues({ ...editValues, quantity: parseInt(e.target.value) || 0 })}
                          className="w-16 border rounded px-2 py-1 text-center"
                        />
                      ) : (
                        <span className="font-semibold">{item.quantity_on_hand}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {editingId === item.id ? (
                        <input
                          type="number"
                          value={editValues.reorder_point}
                          onChange={(e) => setEditValues({ ...editValues, reorder_point: parseInt(e.target.value) || 0 })}
                          className="w-16 border rounded px-2 py-1 text-center"
                        />
                      ) : (
                        <span className="text-gray-600">{item.reorder_point || '-'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockBadge(item.stock_status)}`}>
                        {item.stock_status === 'OUT' ? 'Out of Stock' : item.stock_status === 'LOW' ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {editingId === item.id ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleSave(item.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleRestock(item.id, item.units_needed || 10)}
                            className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded text-sm hover:bg-emerald-200"
                            title="Quick restock"
                          >
                            +{item.units_needed || 10}
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

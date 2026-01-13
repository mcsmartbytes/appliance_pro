'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface OrderStats {
  pending_count: number;
  confirmed_count: number;
  processing_count: number;
  ready_count: number;
  unviewed_count: number;
  total_count: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address_line1: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  notes: string | null;
  subtotal: number;
  email_sent: boolean;
  viewed_at: string | null;
  created_at: string;
  item_count: number;
  total_units: number;
}

interface OrderItem {
  id: string;
  item_id: string;
  title: string;
  part_number: string | null;
  model_number: string | null;
  price: number | null;
  quantity: number;
  image_url: string | null;
}

export default function OrdersDashboard() {
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: statusFilter });
      const res = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();
      setStats(data.stats);
      setOrders(data.orders || []);
      setLowStockCount(data.lowStockCount || 0);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const viewOrderDetail = async (order: Order) => {
    setSelectedOrder(order);
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`);
      const data = await res.json();
      setOrderItems(data.items || []);
      // Refresh to update viewed status
      fetchOrders();
    } catch (error) {
      console.error('Failed to fetch order detail:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-purple-100 text-purple-800';
      case 'READY':
        return 'bg-emerald-100 text-emerald-800';
      case 'DELIVERED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
              <nav className="flex gap-4">
                <Link href="/admin/orders" className="text-blue-700 font-medium">
                  Orders
                </Link>
                <Link href="/admin/inventory" className="text-gray-600 hover:text-gray-900">
                  Inventory
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {lowStockCount > 0 && (
                <Link
                  href="/admin/inventory?filter=low"
                  className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {lowStockCount} Low Stock
                </Link>
              )}
              <Link
                href="/"
                className="text-blue-700 hover:text-blue-800 font-medium"
              >
                ← Back to Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            <button
              onClick={() => setStatusFilter('all')}
              className={`bg-white rounded-lg shadow p-4 text-left transition-all ${statusFilter === 'all' ? 'ring-2 ring-blue-500' : ''}`}
            >
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_count}</p>
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`bg-white rounded-lg shadow p-4 text-left transition-all ${statusFilter === 'PENDING' ? 'ring-2 ring-blue-500' : ''}`}
            >
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending_count}</p>
            </button>
            <button
              onClick={() => setStatusFilter('CONFIRMED')}
              className={`bg-white rounded-lg shadow p-4 text-left transition-all ${statusFilter === 'CONFIRMED' ? 'ring-2 ring-blue-500' : ''}`}
            >
              <p className="text-sm text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold text-blue-600">{stats.confirmed_count}</p>
            </button>
            <button
              onClick={() => setStatusFilter('PROCESSING')}
              className={`bg-white rounded-lg shadow p-4 text-left transition-all ${statusFilter === 'PROCESSING' ? 'ring-2 ring-blue-500' : ''}`}
            >
              <p className="text-sm text-gray-500">Processing</p>
              <p className="text-2xl font-bold text-purple-600">{stats.processing_count}</p>
            </button>
            <button
              onClick={() => setStatusFilter('READY')}
              className={`bg-white rounded-lg shadow p-4 text-left transition-all ${statusFilter === 'READY' ? 'ring-2 ring-blue-500' : ''}`}
            >
              <p className="text-sm text-gray-500">Ready</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.ready_count}</p>
            </button>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">New (Unviewed)</p>
              <p className="text-2xl font-bold text-red-600">{stats.unviewed_count}</p>
            </div>
          </div>
        )}

        {/* New Orders Alert */}
        {stats && stats.unviewed_count > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-red-800">
                {stats.unviewed_count} new order{stats.unviewed_count !== 1 ? 's' : ''} need attention!
              </p>
              <p className="text-sm text-red-600">Click on an order to view details</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b bg-gray-50">
                <h2 className="font-semibold text-gray-900">
                  {statusFilter === 'all' ? 'All Orders' : `${statusFilter} Orders`}
                </h2>
              </div>
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No orders found
                </div>
              ) : (
                <div className="divide-y">
                  {orders.map((order) => (
                    <button
                      key={order.id}
                      onClick={() => viewOrderDetail(order)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                        selectedOrder?.id === order.id ? 'bg-blue-50' : ''
                      } ${!order.viewed_at ? 'bg-yellow-50' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {!order.viewed_at && (
                              <span className="w-2 h-2 bg-red-500 rounded-full" />
                            )}
                            <span className="font-semibold text-gray-900">
                              {order.order_number}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-gray-700">{order.customer_name}</p>
                          <p className="text-sm text-gray-500">
                            {order.total_units} item{order.total_units !== 1 ? 's' : ''} · {formatCurrency(order.subtotal)}
                          </p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Detail Panel */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div className="bg-white rounded-lg shadow sticky top-24">
                <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">
                    Order {selectedOrder.order_number}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="READY">Ready</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Customer</h3>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                      <p className="font-medium text-gray-900">{selectedOrder.customer_name}</p>
                      <p className="text-sm">
                        <a href={`mailto:${selectedOrder.customer_email}`} className="text-blue-700 hover:underline">
                          {selectedOrder.customer_email}
                        </a>
                      </p>
                      <p className="text-sm">
                        <a href={`tel:${selectedOrder.customer_phone}`} className="text-blue-700 hover:underline">
                          {selectedOrder.customer_phone}
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {selectedOrder.address_line1 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery Address</h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-900">{selectedOrder.address_line1}</p>
                        <p className="text-gray-900">
                          {selectedOrder.city}, {selectedOrder.state} {selectedOrder.zip}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedOrder.notes && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
                      <div className="bg-yellow-50 rounded-lg p-3">
                        <p className="text-gray-700 text-sm">{selectedOrder.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Items */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Items</h3>
                    {detailLoading ? (
                      <div className="text-center py-4">
                        <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {orderItems.map((item) => (
                          <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                            <p className="font-medium text-gray-900 text-sm line-clamp-2">
                              {item.title}
                            </p>
                            {(item.part_number || item.model_number) && (
                              <p className="text-xs text-gray-500">
                                {item.part_number ? `Part #: ${item.part_number}` : `Model: ${item.model_number}`}
                              </p>
                            )}
                            <div className="flex justify-between mt-1">
                              <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                              <span className="text-sm font-medium">
                                {item.price ? formatCurrency(item.price) : 'Call for price'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Subtotal</span>
                      <span>{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                  </div>

                  {/* Email Status */}
                  <div className="text-sm text-gray-500">
                    {selectedOrder.email_sent ? (
                      <span className="flex items-center gap-1 text-emerald-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Email notification sent
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Email not sent
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

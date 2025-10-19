'use client';
import { useState, useEffect, useRef } from 'react';
import SaleForm from '@/components/SaleForm';
import InvoiceTemplate from '@/components/InvoiceTemplate';
import { generateInvoicePDF } from '@/utils/invoiceGenerator';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [paymentModal, setPaymentModal] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [notification, setNotification] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const invoiceRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchData = async () => {
    try {
      const [salesRes, customersRes, productsRes] = await Promise.all([
        fetch('/api/sales'),
        fetch('/api/customers'),
        fetch('/api/products'),
      ]);

      const [salesData, customersData, productsData] = await Promise.all([
        salesRes.json(),
        customersRes.json(),
        productsRes.json(),
      ]);

      if (salesData.success) setSales(salesData.data);
      if (customersData.success) setCustomers(customersData.data);
      if (productsData.success) setProducts(productsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      showNotification('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        await fetchData();
        setShowForm(false);
        showNotification('Sale created successfully!');
      } else {
        showNotification(data.error || 'Error creating sale', 'error');
      }
    } catch (error) {
      console.error('Error saving sale:', error);
      showNotification('Error creating sale', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this sale?')) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/sales/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        await fetchData();
        showNotification('Sale deleted successfully!');
      } else {
        showNotification(data.error || 'Error deleting sale', 'error');
      }
    } catch (error) {
      console.error('Error deleting sale:', error);
      showNotification('Error deleting sale', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddPayment = async () => {
    const amount = parseFloat(paymentAmount);

    if (!paymentAmount || amount <= 0) {
      showNotification('Please enter a valid payment amount', 'error');
      return;
    }

    if (amount > paymentModal.dueAmount) {
      showNotification('Payment amount cannot exceed due amount', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          saleId: paymentModal._id,
          amount: amount,
        }),
      });

      const data = await res.json();
      if (data.success) {
        await fetchData();
        setPaymentModal(null);
        setPaymentAmount('');
        showNotification('Payment added successfully!');
      } else {
        showNotification(data.error || 'Error processing payment', 'error');
      }
    } catch (error) {
      console.error('Error adding payment:', error);
      showNotification('Error processing payment', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Download Invoice
  const handleDownloadInvoice = async (sale) => {
    setIsGeneratingPDF(true);
    setInvoiceData(sale);

    // Wait for invoice to render
    setTimeout(async () => {
      const invoiceNumber = sale._id.slice(-8).toUpperCase();
      const success = await generateInvoicePDF(invoiceRef, invoiceNumber);

      if (success) {
        showNotification('Invoice downloaded successfully!');
      } else {
        showNotification('Failed to generate invoice', 'error');
      }

      setIsGeneratingPDF(false);
      setInvoiceData(null);
    }, 100);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hidden Invoice Template for PDF Generation */}
      <div className="fixed -left-[9999px] top-0">
        {invoiceData && <InvoiceTemplate sale={invoiceData} invoiceRef={invoiceRef} />}
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${notification.type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'
          }`}>
          {notification.message}
        </div>
      )}

      {/* Loading Overlay for PDF Generation */}
      {isGeneratingPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-800 font-semibold">Generating Invoice...</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales</h1>
          <p className="text-gray-600 mt-2">Track and manage all sales transactions</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          disabled={actionLoading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + New Sale
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm text-gray-600">Total Sales</p>
          <p className="text-2xl font-bold text-gray-900">{sales.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">
            ${sales.reduce((sum, s) => sum + s.totalAmount, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm text-gray-600">Total Paid</p>
          <p className="text-2xl font-bold text-blue-600">
            ${sales.reduce((sum, s) => sum + s.paidAmount, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm text-gray-600">Total Due</p>
          <p className="text-2xl font-bold text-red-600">
            ${sales.reduce((sum, s) => sum + s.dueAmount, 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Sale Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Sale</h2>
            <SaleForm
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
              customers={customers}
              products={products}
              loading={actionLoading}
            />
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Payment</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-semibold text-black">{paymentModal.customer?.name}</p>
                <p className="text-sm text-gray-600 mt-2">Product</p>
                <p className="font-semibold text-black">{paymentModal.product?.name}</p>
                <p className="text-sm text-gray-600 mt-2">Due Amount</p>
                <p className="text-2xl font-bold text-red-600">
                  ${paymentModal.dueAmount.toFixed(2)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Amount
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  min="0"
                  max={paymentModal.dueAmount}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter amount"
                  disabled={actionLoading}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleAddPayment}
                  disabled={actionLoading}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? 'Processing...' : 'Add Payment'}
                </button>
                <button
                  onClick={() => {
                    setPaymentModal(null);
                    setPaymentAmount('');
                  }}
                  disabled={actionLoading}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                    No sales found. Create your first sale to get started.
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(sale.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {sale.customer?.name}
                      </div>
                      <div className="text-sm text-gray-500">{sale.customer?.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{sale.product?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{sale.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ${sale.totalAmount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-green-600 font-semibold">
                        ${sale.paidAmount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-red-600 font-semibold">
                        ${sale.dueAmount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sale.status === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : sale.status === 'Partially Paid'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {sale.dueAmount > 0 && (
                        <button
                          onClick={() => setPaymentModal(sale)}
                          disabled={actionLoading}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          💵 Pay
                        </button>
                      )}
                      <button
                        onClick={() => handleDownloadInvoice(sale)}
                        disabled={isGeneratingPDF}
                        className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50 font-semibold"
                        title="Download Invoice"
                      >
                        📄 Invoice
                      </button>

                      <button
                        onClick={() => handleDelete(sale._id)}
                        disabled={actionLoading}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
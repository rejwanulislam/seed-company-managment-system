// path: /components/InvoiceTemplate.jsx
import React from 'react';

export default function InvoiceTemplate({ sale, invoiceRef }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div ref={invoiceRef} className="bg-white p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-indigo-600 pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-indigo-600">INVOICE</h1>
            <p className="text-gray-600 mt-2">Seat Company Management</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Invoice Date</p>
            <p className="font-semibold">{formatDate(sale.createdAt || new Date())}</p>
            <p className="text-sm text-gray-600 mt-2">Invoice #</p>
            <p className="font-semibold">INV-{sale._id?.slice(-8).toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* Company & Customer Info */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">FROM:</h3>
          <div className="text-gray-800">
            <p className="font-bold text-lg">Seat Company</p>
            <p>123 Business Street</p>
            <p>New York, NY 10001</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Email: info@seatcompany.com</p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">BILL TO:</h3>
          <div className="text-gray-800">
            <p className="font-bold text-lg">{sale.customer?.name}</p>
            {sale.customer?.address && <p>{sale.customer.address}</p>}
            <p>Phone: {sale.customer?.phone}</p>
            {sale.customer?.email && <p>Email: {sale.customer.email}</p>}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-8">
        <thead className="bg-gray-100 border-b-2 border-gray-300">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">ITEM</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700">QUANTITY</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-700">UNIT PRICE</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-700">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-200">
            <td className="py-4 px-4">
              <p className="font-semibold text-gray-900">{sale.product?.name}</p>
              <p className="text-sm text-gray-600">{sale.product?.category}</p>
            </td>
            <td className="py-4 px-4 text-center text-gray-800">{sale.quantity}</td>
            <td className="py-4 px-4 text-right text-gray-800">
              ${(sale.totalAmount / sale.quantity).toFixed(2)}
            </td>
            <td className="py-4 px-4 text-right font-semibold text-gray-900">
              ${sale.totalAmount.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-semibold">${sale.totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Tax (0%):</span>
            <span className="font-semibold">$0.00</span>
          </div>
          <div className="flex justify-between py-3 border-b-2 border-gray-800">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-lg font-bold text-indigo-600">
              ${sale.totalAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-2 mt-2 bg-green-50 px-3 rounded">
            <span className="text-green-700 font-semibold">Paid:</span>
            <span className="text-green-700 font-semibold">
              ${sale.paidAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-2 bg-red-50 px-3 rounded mt-2">
            <span className="text-red-700 font-bold">Due:</span>
            <span className="text-red-700 font-bold text-lg">
              ${sale.dueAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment History */}
      {sale.paymentHistory && sale.paymentHistory.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment History</h3>
          <table className="w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-right py-2 px-4 text-sm font-semibold text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {sale.paymentHistory.map((payment, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="py-2 px-4 text-sm text-gray-800">
                    {formatDate(payment.date)}
                  </td>
                  <td className="py-2 px-4 text-sm text-right text-gray-800">
                    ${payment.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Status Badge */}
      <div className="mb-8">
        <span className={`inline-block px-6 py-2 rounded-full text-sm font-semibold ${
          sale.status === 'Paid' 
            ? 'bg-green-100 text-green-800' 
            : sale.status === 'Partially Paid'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          Status: {sale.status}
        </span>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-200 pt-6 text-center text-sm text-gray-600">
        <p className="font-semibold mb-2">Thank you for your business!</p>
        <p>For any questions, please contact us at support@seatcompany.com</p>
        <p className="mt-2">Terms & Conditions: Payment is due within 30 days</p>
      </div>
    </div>
  );
}
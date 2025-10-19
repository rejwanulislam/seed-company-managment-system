'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [sales, setSales] = useState([]);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
console.log(product)
  useEffect(() => {
    if (id) fetchCustomerDetails();
  }, [id]);

  const fetchCustomerDetails = async () => {
    try {
      const res = await fetch(`/api/customers/${id}`);
      const data = await res.json();
      if (data.success) {
        setCustomer(data.data);
      }

   

 

      // ✅ Fetch sales related to this customer
      const saleRes = await fetch(`/api/sales?customerId=${id}`);
      const saleData = await saleRes.json();
      if (saleData.success) {
        setSales(saleData.data);
      }
    } catch (error) {
      console.error('Error fetching customer details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading customer details...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 text-lg mb-4">Customer not found!</p>
        <Link href="/customers" className="text-indigo-600 hover:underline">
          Go Back
        </Link>
      </div>
    );
  }

  // ✅ Calculate totals
  const totalOrder = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalPaid = sales.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalDue = totalOrder - totalPaid;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{customer.name}</h1>
            <p className="text-gray-600">Email: {customer.email || 'N/A'}</p>
            <p className="text-gray-600">Phone: {customer.phone}</p>
            <p className="text-gray-600">Address: {customer.address || 'N/A'}</p>
          </div>
          <Link
            href="/customers"
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Back to List
          </Link>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Summary</h2>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-gray-500 text-sm">Total Order</p>
              <p className="text-2xl font-bold text-blue-700">৳{totalOrder}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-gray-500 text-sm">Total Paid</p>
              <p className="text-2xl font-bold text-green-700">৳{totalPaid}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <p className="text-gray-500 text-sm">Total Due</p>
              <p className="text-2xl font-bold text-red-700">৳{totalDue}</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">Order History</h3>
          {sales.length === 0 ? (
            <p className="text-gray-500">No orders found for this customer.</p>
          ) : (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-600 text-sm font-medium">Date</th>
                  <th className="px-4 py-3 text-left text-gray-600 text-sm font-medium">Product</th>
                  <th className="px-4 py-3 text-left text-gray-600 text-sm font-medium">Quantity</th>
                  <th className="px-4 py-3 text-left text-gray-600 text-sm font-medium">Total</th>
                  <th className="px-4 py-3 text-left text-gray-600 text-sm font-medium">Paid</th>
                  <th className="px-4 py-3 text-left text-gray-600 text-sm font-medium">Due</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s) => (
                  <tr key={s._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{new Date(s.saleDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{s.productName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{s.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">৳{s.totalAmount}</td>
                    <td className="px-4 py-3 text-sm text-green-600">৳{s.paidAmount}</td>
                    <td className="px-4 py-3 text-sm text-red-600">৳{s.totalAmount - s.paidAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}




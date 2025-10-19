'use client';
import { useState, useEffect } from 'react';
import CustomerForm from '@/components/CustomerForm';
import Link from 'next/link';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [dueMap, setDueMap] = useState({});
  const [searchQuery, setSearchQuery] = useState(''); // Search state

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();
      if (data.success) {
        setCustomers(data.data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const url = editingCustomer
        ? `/api/customers/${editingCustomer._id}`
        : '/api/customers';
      const method = editingCustomer ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        fetchCustomers();
        setShowForm(false);
        setEditingCustomer(null);
      }
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchCustomers();
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Customers
        const custRes = await fetch('/api/customers');
        const custData = await custRes.json();
        if (custData.success) setCustomers(custData.data);

        // Due
        const dueRes = await fetch('/api/sales');
        const dueData = await dueRes.json();
        if (dueData.success) {
          const map = {};
          dueData.data.forEach(d => map[d._id] = d.due);
          setDueMap(map);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter customers based on search query
  const filteredCustomers = customers.filter((customer) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const name = customer.name?.toLowerCase() || '';
    const email = customer.email?.toLowerCase() || '';
    const phone = customer.phone?.toLowerCase() || '';
    
    return name.includes(query) || 
           email.includes(query) || 
           phone.includes(query);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-2">Manage your customer database</p>
        </div>
        <button
          onClick={() => {
            setEditingCustomer(null);
            setShowForm(true);
          }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Add Customer
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-xl">🔍</span>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or phone number..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        
        {/* Search Results Info */}
        {searchQuery && (
          <div className="mt-3 text-sm text-gray-600">
            Found <span className="font-semibold text-indigo-600">{filteredCustomers.length}</span> customer{filteredCustomers.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h2>
            <CustomerForm
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingCustomer(null);
              }}
              initialData={editingCustomer}
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  {searchQuery ? (
                    <div>
                      <div className="text-4xl mb-2">🔍</div>
                      <p className="text-lg font-medium mb-1">No customers found</p>
                      <p className="text-sm">Try searching with a different keyword</p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-4xl mb-2">👥</div>
                      <p>No customers found. Add your first customer to get started.</p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {customer.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{customer.email || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{customer.address || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      href={`/customers/${customer._id}`} 
                      className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                    >
                      View Details →
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(customer._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      {!searchQuery && customers.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Customers</p>
              <p className="text-3xl font-bold text-indigo-600">{customers.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">With Email</p>
              <p className="text-3xl font-bold text-green-600">
                {customers.filter(c => c.email).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">With Address</p>
              <p className="text-3xl font-bold text-blue-600">
                {customers.filter(c => c.address).length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
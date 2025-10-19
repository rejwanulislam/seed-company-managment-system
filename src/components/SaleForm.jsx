'use client';
import { useState, useEffect } from 'react';

export default function SaleForm({ onSubmit, onCancel, customers, products }) {
  const [formData, setFormData] = useState({
    customer: '',
    product: '',
    quantity: '',
    paidAmount: '',
  });
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  
  useEffect(() => {
    if (formData.product && formData.quantity) {
      const product = products.find((p) => p._id === formData.product);
      if (product) {
        setSelectedProduct(product);
        setTotalAmount(product.price * parseInt(formData.quantity));
      }
    } else {
      setSelectedProduct(null);
      setTotalAmount(0);
    }
  }, [formData.product, formData.quantity, products]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      quantity: parseInt(formData.quantity),
      paidAmount: parseFloat(formData.paidAmount) || 0,
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
        <select
          name="customer"
          value={formData.customer}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">Select Customer</option>
          {customers.map((customer) => (
            <option key={customer._id} value={customer._id}>
              {customer.name} - {customer.phone}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
        <select
          name="product"
          value={formData.product}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name} - ${product.price} (Stock: {product.stock})
            </option>
          ))}
        </select>
      </div>
      
      {selectedProduct && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <p className="text-blue-800">
            <strong>Available Stock:</strong> {selectedProduct.stock} units
          </p>
          <p className="text-blue-800">
            <strong>Price per unit:</strong> ${selectedProduct.price}
          </p>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
          min="1"
          max={selectedProduct?.stock || 999999}
          className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      
      {totalAmount > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-800 font-semibold text-lg">
            Total Amount: ${totalAmount.toFixed(2)}
          </p>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount</label>
        <input
          type="number"
          name="paidAmount"
          value={formData.paidAmount}
          onChange={handleChange}
          min="0"
          step="0.01"
          max={totalAmount}
          className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Leave empty or enter 0 for full due payment
        </p>
      </div>
      
      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Create Sale
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
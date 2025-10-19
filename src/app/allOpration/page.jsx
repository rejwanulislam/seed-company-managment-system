'use client';
import { useState, useEffect } from 'react';

export default function AllOperations() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, day, month, year
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await fetch('/api/sales');
      const data = await res.json();
      if (data.success) {
        setSales(data.data);
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique years from sales
  const getYears = () => {
    const years = [...new Set(sales.map(sale => 
      new Date(sale.createdAt).getFullYear()
    ))];
    return years.sort((a, b) => b - a);
  };

  // Get months
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Filter sales based on selected criteria
  const getFilteredSales = () => {
    let filtered = [...sales];

    if (filterType === 'day' && selectedDate) {
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.createdAt).toISOString().split('T')[0];
        return saleDate === selectedDate;
      });
    } else if (filterType === 'month' && selectedMonth && selectedYear) {
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.createdAt);
        return saleDate.getMonth() === parseInt(selectedMonth) && 
               saleDate.getFullYear() === parseInt(selectedYear);
      });
    } else if (filterType === 'year' && selectedYear) {
      filtered = filtered.filter(sale => {
        return new Date(sale.createdAt).getFullYear() === parseInt(selectedYear);
      });
    }

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(sale => {
        const query = searchQuery.toLowerCase();
        const customerName = sale.customer?.name?.toLowerCase() || '';
        const productName = sale.product?.name?.toLowerCase() || '';
        const saleDate = new Date(sale.createdAt).toLocaleDateString().toLowerCase();
        
        return customerName.includes(query) || 
               productName.includes(query) || 
               saleDate.includes(query);
      });
    }

    return filtered;
  };

  // Group sales by date
  const groupByDate = (salesData) => {
    const grouped = {};
    salesData.forEach(sale => {
      const date = new Date(sale.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!grouped[date]) {
        grouped[date] = {
          sales: [],
          totalAmount: 0,
          totalPaid: 0,
          totalDue: 0,
          count: 0
        };
      }
      grouped[date].sales.push(sale);
      grouped[date].totalAmount += sale.totalAmount;
      grouped[date].totalPaid += sale.paidAmount;
      grouped[date].totalDue += sale.dueAmount;
      grouped[date].count += 1;
    });
    return grouped;
  };

  // Group sales by month
  const groupByMonth = (salesData) => {
    const grouped = {};
    salesData.forEach(sale => {
      const date = new Date(sale.createdAt);
      const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
      if (!grouped[monthYear]) {
        grouped[monthYear] = {
          sales: [],
          totalAmount: 0,
          totalPaid: 0,
          totalDue: 0,
          count: 0
        };
      }
      grouped[monthYear].sales.push(sale);
      grouped[monthYear].totalAmount += sale.totalAmount;
      grouped[monthYear].totalPaid += sale.paidAmount;
      grouped[monthYear].totalDue += sale.dueAmount;
      grouped[monthYear].count += 1;
    });
    return grouped;
  };

  // Group sales by year
  const groupByYear = (salesData) => {
    const grouped = {};
    salesData.forEach(sale => {
      const year = new Date(sale.createdAt).getFullYear();
      if (!grouped[year]) {
        grouped[year] = {
          sales: [],
          totalAmount: 0,
          totalPaid: 0,
          totalDue: 0,
          count: 0
        };
      }
      grouped[year].sales.push(sale);
      grouped[year].totalAmount += sale.totalAmount;
      grouped[year].totalPaid += sale.paidAmount;
      grouped[year].totalDue += sale.dueAmount;
      grouped[year].count += 1;
    });
    return grouped;
  };

  const filteredSales = getFilteredSales();
  const groupedByDate = groupByDate(filteredSales);
  const groupedByMonth = groupByMonth(filteredSales);
  const groupedByYear = groupByYear(filteredSales);

  // Calculate totals
  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalPaid = filteredSales.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalDue = filteredSales.reduce((sum, s) => sum + s.dueAmount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading operations data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Operations</h1>
        <p className="text-gray-600 mt-2">Complete sales analytics and reports</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <p className="text-sm opacity-90 mb-1">Total Sales</p>
          <p className="text-3xl font-bold">{filteredSales.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <p className="text-sm opacity-90 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
          <p className="text-sm opacity-90 mb-1">Total Paid</p>
          <p className="text-3xl font-bold">${totalPaid.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow-lg">
          <p className="text-sm opacity-90 mb-1">Total Due</p>
          <p className="text-3xl font-bold">${totalDue.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🔍 Search & Filter</h2>
        
        {/* Search Bar */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search (Customer, Product, Date)
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type to search..."
            className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Filter Type */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <button
            onClick={() => {
              setFilterType('all');
              setSelectedDate('');
              setSelectedMonth('');
              setSelectedYear('');
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Sales
          </button>
          <button
            onClick={() => setFilterType('day')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'day'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            By Day
          </button>
          <button
            onClick={() => setFilterType('month')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'month'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            By Month
          </button>
          <button
            onClick={() => setFilterType('year')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'year'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            By Year
          </button>
        </div>

        {/* Date Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filterType === 'day' && (
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          )}

          {filterType === 'month' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">-- Select Month --</option>
                  {months.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">-- Select Year --</option>
                  {getYears().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {filterType === 'year' && (
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">-- Select Year --</option>
                {getYears().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {filteredSales.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Found</h3>
          <p className="text-gray-600">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <>
          {/* By Year View */}
          {(filterType === 'all' || filterType === 'year') && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📅 Yearly Analysis</h2>
              <div className="space-y-4">
                {Object.entries(groupedByYear)
                  .sort((a, b) => b[0] - a[0])
                  .map(([year, data]) => (
                    <div key={year} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900">{year}</h3>
                        <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-semibold">
                          {data.count} Sales
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                          <p className="text-2xl font-bold text-green-600">
                            ${data.totalAmount.toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                          <p className="text-2xl font-bold text-blue-600">
                            ${data.totalPaid.toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Total Due</p>
                          <p className="text-2xl font-bold text-red-600">
                            ${data.totalDue.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* By Month View */}
          {(filterType === 'all' || filterType === 'month') && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📆 Monthly Analysis</h2>
              <div className="space-y-4">
                {Object.entries(groupedByMonth)
                  .sort((a, b) => new Date(b[0]) - new Date(a[0]))
                  .map(([monthYear, data]) => (
                    <div key={monthYear} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900">{monthYear}</h3>
                        <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-semibold">
                          {data.count} Sales
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                          <p className="text-2xl font-bold text-green-600">
                            ${data.totalAmount.toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                          <p className="text-2xl font-bold text-blue-600">
                            ${data.totalPaid.toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Total Due</p>
                          <p className="text-2xl font-bold text-red-600">
                            ${data.totalDue.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* By Day View */}
          {(filterType === 'all' || filterType === 'day') && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Daily Analysis</h2>
              <div className="space-y-4">
                {Object.entries(groupedByDate)
                  .sort((a, b) => new Date(b[0]) - new Date(a[0]))
                  .map(([date, data]) => (
                    <div key={date} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold text-gray-900">{date}</h3>
                          <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold text-sm">
                            {data.count} Sales
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-3">
                          <div>
                            <p className="text-xs text-gray-600">Revenue</p>
                            <p className="text-lg font-bold text-green-600">
                              ${data.totalAmount.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Paid</p>
                            <p className="text-lg font-bold text-blue-600">
                              ${data.totalPaid.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Due</p>
                            <p className="text-lg font-bold text-red-600">
                              ${data.totalDue.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Individual Sales */}
                      <div className="p-6">
                        <div className="space-y-3">
                          {data.sales.map((sale) => (
                            <div
                              key={sale._id}
                              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">
                                  {sale.customer?.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {sale.product?.name} × {sale.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-900">
                                  ${sale.totalAmount.toFixed(2)}
                                </p>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    sale.status === 'Paid'
                                      ? 'bg-green-100 text-green-800'
                                      : sale.status === 'Partially Paid'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {sale.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

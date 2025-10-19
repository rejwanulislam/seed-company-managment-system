import DashboardCard from '@/components/DashboardCard';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import Product from '@/models/Product';
import Sale from '@/models/Sale';
export const revalidate = 0;
async function getDashboardData() {
  await dbConnect();
  
  const totalCustomers = await Customer.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalSales = await Sale.countDocuments();
  
  const sales = await Sale.find({});
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalPaid = sales.reduce((sum, sale) => sum + sale.paidAmount, 0);
  const totalDue = sales.reduce((sum, sale) => sum + sale.dueAmount, 0);
  
  const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10 } });
  
  return {
    totalCustomers,
    totalProducts,
    totalSales,
    totalRevenue,
    totalPaid,
    totalDue,
    lowStockProducts,
  };
}

export default async function Dashboard() {
  const data = await getDashboardData();
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your business operations</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Customers"
          value={data.totalCustomers}
          icon="👥"
          color="indigo"
        />
        <DashboardCard
          title="Total Products"
          value={data.totalProducts}
          icon="📦"
          color="green"
        />
        <DashboardCard
          title="Total Sales"
          value={data.totalSales}
          icon="💰"
          color="yellow"
        />
        <DashboardCard
          title="Low Stock Items"
          value={data.lowStockProducts}
          icon="⚠️"
          color="red"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">${data.totalRevenue.toFixed(2)}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Paid</h3>
          <p className="text-3xl font-bold text-blue-600">${data.totalPaid.toFixed(2)}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Due</h3>
          <p className="text-3xl font-bold text-red-600">${data.totalDue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
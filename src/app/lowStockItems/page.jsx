import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
export const revalidate = 0;
async function getLowStockProducts() {
  await dbConnect();
  

  const lowStockProducts = await Product.find({ stock: { $lt: 10 } }).sort({ stock: 1 });
  
  return lowStockProducts;
}

export default async function LowStockItems() {
  const products = await getLowStockProducts();
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Low Stock Items</h1>
        <p className="text-gray-600 mt-2">
          Products with stock less than 10 units
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Total Low Stock Items: <span className="text-red-600">{products.length}</span>
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-xl text-gray-600 font-medium">Great! All products are well stocked.</p>
            <p className="text-gray-500 mt-2">No items are running low on inventory.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product, index) => (
              <div
                key={product._id}
                className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Category: <span className="font-medium">{product.category}</span>
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Stock</p>
                      <p className="text-2xl font-bold text-red-600">
                        {product.stock}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {products.length > 0 && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">⚠️</div>
              <div>
                <h4 className="font-semibold text-yellow-800">Action Required</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Please restock these items as soon as possible to avoid stock-out situations.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      {products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Critical (Stock &lt; 5)</h3>
            <p className="text-3xl font-bold text-red-600">
              {products.filter(p => p.stock < 5).length}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Warning (Stock 5-9)</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {products.filter(p => p.stock >= 5 && p.stock < 10).length}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Value at Risk</h3>
            <p className="text-3xl font-bold text-gray-900">
              ${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

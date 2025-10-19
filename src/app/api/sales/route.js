import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Sale from '@/models/Sale';
import Product from '@/models/Product';
import Customer from '@/models/Customer';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');


    let filter = {};
    if (customerId) {
      filter.customer = customerId;
    }

    const sales = await Sale.find(filter)
      .populate('customer')
      .populate('product')
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: sales });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// export async function POST(request) {
//   try {
//     await dbConnect();
//     const body = await request.json();

//     // Check product stock
//     const product = await Product.findById(body.product);
//     if (!product) {
//       return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
//     }

//     if (product.stock < body.quantity) {
//       return NextResponse.json({ success: false, error: 'Insufficient stock' }, { status: 400 });
//     }

//     // Calculate amounts
//     const totalAmount = product.price * body.quantity;
//     const paidAmount = body.paidAmount || 0;
//     const dueAmount = totalAmount - paidAmount;

//     let status = 'Due';
//     if (paidAmount >= totalAmount) {
//       status = 'Paid';
//     } else if (paidAmount > 0) {
//       status = 'Partially Paid';
//     }
// const customer = await mongoose.model('Customer').findById(body.customer);
//     // Create sale
//     const sale = await Sale.create({
//       ...body,
//       totalAmount,
//       paidAmount,
//       dueAmount,
//       productName: product?.name,
//       customerName: customer ? customer?.name : '',
//       status,
//       paymentHistory: paidAmount > 0 ? [{ amount: paidAmount, date: new Date() }] : [],
//     });

//     // Decrement product stock
//     await Product.findByIdAndUpdate(body.product, {
//       $inc: { stock: -body.quantity },
//     });

//     const populatedSale = await Sale.findById(sale._id)
//       .populate('customer')
//       .populate('product');

//     return NextResponse.json({ success: true, data: populatedSale }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 400 });
//   }
// }



export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validate required fields
    if (!body.customer || !body.product || !body.quantity) {
      return NextResponse.json({ success: false, error: 'Customer, product and quantity are required' }, { status: 400 });
    }

    // Find product and customer
    const product = await Product.findById(body.product);
    const customer = await Customer.findById(body.customer);

    if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    if (!customer) return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });

    // Check stock
    if (product.stock < body.quantity) {
      return NextResponse.json({ success: false, error: 'Insufficient stock' }, { status: 400 });
    }

    // Calculate amounts
    const totalAmount = product.price * body.quantity;
    const paidAmount = body.paidAmount || 0;
    const dueAmount = totalAmount - paidAmount;

    let status = 'Due';
    if (paidAmount >= totalAmount) status = 'Paid';
    else if (paidAmount > 0) status = 'Partially Paid';

    // Create sale
    const sale = await Sale.create({
      customer: customer._id,
      product: product._id,
      customerName: customer.name,
      productName: product.name,
      quantity: body.quantity,
      totalAmount,
      paidAmount,
      dueAmount,
      status,
      paymentHistory: paidAmount > 0 ? [{ amount: paidAmount, date: new Date() }] : [],
    });

    // Decrement product stock
    await Product.findByIdAndUpdate(product._id, { $inc: { stock: -body.quantity } });

    // Populate before returning
    const populatedSale = await Sale.findById(sale._id)
      .populate('customer', 'name email')
      .populate('product', 'name price');

    return NextResponse.json({ success: true, data: populatedSale }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
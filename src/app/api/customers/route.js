import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import Sale from '@/models/Sale';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');
    const withDue = searchParams.get('withDue'); // Add query param to request due calculation

    // If requesting due calculation
    if (withDue === 'true') {
      let filter = {};
      if (customerId) filter.customer = customerId;

      // Aggregate sales to calculate due per customer
      const dueAggregation = await Sale.aggregate([
        { $match: filter },
        {
          $group: {
            _id: "$customer",
            totalOrder: { $sum: "$totalAmount" },
            totalPaid: { $sum: "$paidAmount" }
          }
        },
        {
          $project: {
            _id: 1,
            due: { $subtract: ["$totalOrder", "$totalPaid"] }
          }
        }
      ]);

      // Single customer or all customers
      if (customerId) {
        return NextResponse.json({ 
          success: true, 
          data: dueAggregation[0] || { due: 0 } 
        });
      }
      return NextResponse.json({ success: true, data: dueAggregation });
    }

    // Default: fetch customers
    if (customerId) {
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return NextResponse.json(
          { success: false, error: 'Customer not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: customer });
    }

    const customers = await Customer.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: customers });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const customer = await Customer.create(body);
    return NextResponse.json({ 
      success: true, 
      data: customer 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 400 });
  }
}
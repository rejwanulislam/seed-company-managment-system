// path: /app/api/payments/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Sale from '@/models/Sale';

export async function POST(request) {
  try {
    await dbConnect();
    const { saleId, amount } = await request.json();
    
    if (!saleId || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment data' },
        { status: 400 }
      );
    }
    
    const sale = await Sale.findById(saleId);
    if (!sale) {
      return NextResponse.json({ success: false, error: 'Sale not found' }, { status: 404 });
    }
    
    // Update payment amounts
    const newPaidAmount = sale.paidAmount + amount;
    const newDueAmount = sale.totalAmount - newPaidAmount;
    
    let status = 'Due';
    if (newDueAmount <= 0) {
      status = 'Paid';
    } else if (newPaidAmount > 0) {
      status = 'Partially Paid';
    }
    
    // Update sale
    sale.paidAmount = newPaidAmount;
    sale.dueAmount = Math.max(0, newDueAmount);
    sale.status = status;
    sale.paymentHistory.push({ amount, date: new Date() });
    
    await sale.save();
    
    const updatedSale = await Sale.findById(saleId)
      .populate('customer')
      .populate('product');
    
    return NextResponse.json({ success: true, data: updatedSale });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
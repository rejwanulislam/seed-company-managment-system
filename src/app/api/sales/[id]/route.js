import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Sale from '@/models/Sale';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const sale = await Sale.findById(params.id)
      .populate('customer')
      .populate('product');
    if (!sale) {
      return NextResponse.json({ success: false, error: 'Sale not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: sale });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const sale = await Sale.findByIdAndDelete(params.id);
    if (!sale) {
      return NextResponse.json({ success: false, error: 'Sale not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
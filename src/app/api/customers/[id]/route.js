import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';


export async function GET(request, { params }) {
    try {
        await dbConnect();
        const customer = await Customer.findById(params.id);
   
        if (!customer) {
            return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: customer });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function PUT(request, { params }) {
    try {
        await dbConnect();
        const body = await request.json();
        const customer = await Customer.findByIdAndUpdate(params.id, body, {
            new: true,
            runValidators: true,
        });
        if (!customer) {
            return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: customer });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const customer = await Customer.findByIdAndDelete(params.id);
        if (!customer) {
            return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}










import mongoose from 'mongoose';

const SaleSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer is required'],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required'],
    },
    customerName: {
      type: String,
      trim: true,
    },
    productName: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: 1,
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: 0,
    },
    paidAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    dueAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Paid', 'Partially Paid', 'Due'],
      default: 'Due',
    },
    saleDate: {
      type: Date,
      default: Date.now,
    },
    paymentHistory: [
      {
        amount: Number,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

SaleSchema.pre('save', async function (next) {
  if (this.isModified('customer')) {
    const customer = await mongoose.model('Customer').findById(this.customer);
    if (customer) this.customerName = customer.name;
  }

  if (this.isModified('product')) {
    const product = await mongoose.model('Product').findById(this.product);
    if (product) this.productName = product.name;
  }

  next();
});

export default mongoose.models.Sale || mongoose.model('Sale', SaleSchema);
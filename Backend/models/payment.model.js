import mongoose from "mongoose";

const PaymentSchema = mongoose.Schema(
  {
    // Request data
    email: {
      type: String,
      required: true
    },
    reference: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    first_name: {
      type: String,
      required: true
    },
    last_name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    
    // Order reference
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    
    // Payment provider data
    payment_provider: {
      type: String,
      default: "pesapal"
    },
    order_id: String, // OrderMerchantReference
    payment_reference: String, // OrderTrackingId from Pesapal
    redirect_url: String,
    error_response: mongoose.Schema.Types.Mixed,
    error_status: Number,
    
    // Payment status
    status: {
      type: String,
      enum: ['initiated', 'completed', 'failed', 'cancelled', 'pending'],
      default: 'initiated'
    },
    payment_status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'cancelled'],
      default: 'pending'
    },
    
    // Additional status details from payment provider
    status_details: mongoose.Schema.Types.Mixed,
    
  },
  {
    timestamps: true,
  }
);

// Update the updated_at field before saving
PaymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;
import mongoose, { Document, Schema } from 'mongoose';

export enum OrderStatus {
  PENDING = 'Pending',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  REJECTED = 'Rejected',
}



export interface IOrder extends Document {
  status: OrderStatus;
  deliveryDate: Date;
  farmer: mongoose.Types.ObjectId;
  transporter?: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
  //quantite:number;
}

const OrderSchema: Schema = new Schema(
  {
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    deliveryDate: { type: Date, required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    transporter: { type: mongoose.Schema.Types.ObjectId, ref: 'Transporter' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Produit', required: true }],
    //quantite: { type: Number, required: true },

  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);

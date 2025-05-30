// models/Expedition.ts
import { Schema, model, Document } from "mongoose";

export interface IExpedition extends Document {
  dateExpedition: Date;
  destination: string;
  produit: Schema.Types.ObjectId; // Si lié à un produit
}

const ExpeditionSchema = new Schema<IExpedition>({
  dateExpedition: { type: Date, required: true },
  destination: { type: String, required: true },
  produit: { type: Schema.Types.ObjectId, ref: "Produit", required: false },
});

export default model<IExpedition>("Expedition", ExpeditionSchema);

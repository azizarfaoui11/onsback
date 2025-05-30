// models/Reclamation.ts
import { Schema, model, Document } from "mongoose";

export interface IReclamation extends Document {
  description: string;
  date: Date;
  user: Schema.Types.ObjectId;
}

const ReclamationSchema = new Schema<IReclamation>({
  description: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default model<IReclamation>("Reclamation", ReclamationSchema);

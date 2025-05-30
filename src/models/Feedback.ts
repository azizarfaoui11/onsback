// models/Feedback.ts
import { Schema, model, Document } from "mongoose";

export interface IFeedback extends Document {
  commentaire: string;
  user: Schema.Types.ObjectId;
  produit: Schema.Types.ObjectId;
}

const FeedbackSchema = new Schema<IFeedback>({
  commentaire: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  produit: { type: Schema.Types.ObjectId, ref: "Produit", required: true },
});

export default model<IFeedback>("Feedback", FeedbackSchema);

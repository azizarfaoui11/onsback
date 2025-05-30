// models/Produit.ts
import mongoose, { Schema, model, Document } from "mongoose";
import { IQRCode } from "./QRCode";


export enum etat {
  DISPONIBLE = 'disponible',
  NONDISPONIBLE = 'nondisponible',
}

export interface IProduit extends Document {
  libelle: string;
  qrCode: mongoose.Types.ObjectId | IQRCode;
  parcel:mongoose.Types.ObjectId;
  image: String;
  user: mongoose.Types.ObjectId;
  etat:etat;
  quantite: Number;
} 

const ProduitSchema = new Schema<IProduit>({
  libelle: { type: String, required: true },
  qrCode: { type: mongoose.Schema.Types.ObjectId, ref: 'QRCode' },
  parcel: { type: mongoose.Schema.Types.ObjectId, ref: 'Parcel' },
  image: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  etat: {
        type: String,
        enum: Object.values(etat),
        default: etat.DISPONIBLE,
      },
  quantite: { type: Number, required: true },

});

export default model<IProduit>("Produit", ProduitSchema);

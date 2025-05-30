// controllers/ProduitController.ts
import { AuthRequest } from "../middleware/auth";
import Produit from "../models/Produit";
import { Request, Response } from "express";
import QRCode from "../models/QRCode";
import crypto from 'crypto'; 
import qrcode from 'qrcode'; 
import { populate } from "dotenv";
import { isQualifiedName } from "typescript";




export const createProduit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { libelle, parcel, etat, quantite  } = req.body;

    // Vérifie que l'utilisateur est bien authentifié
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Authentification requise' });
      return;
    }


    // Génération du QR code
        const hash = crypto.createHash('sha256').update(libelle + Date.now().toString()).digest('hex');
        const qrCode = await QRCode.create({
          hash,
          generationDate: new Date(),
        });

    const image = req.file?.filename; // ou path complet si besoin


    // Création de la parcelle avec l'utilisateur associé
    const produit = await Produit.create({
      libelle,
      qrCode:qrCode._id,
      parcel,
      image,
      user: userId,
      etat, 
      quantite,// ← association de la parcelle à l’utilisateur connecté
    });

    const qrData = {
          libelle,
          parcel,
          etat,
          quantite,

        };
    
        const qrCodeImage = await qrcode.toDataURL(JSON.stringify(qrData));
    

    res.status(201).json( {message: 'Lot créé',
      produit,
      qrCodeImage} );
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/*export const getAllProduits = async (req: Request, res: Response) => {
  try {
    const produits = await Produit.find()
    .populate('parcel')
    .populate('user')
    .populate('qrCode');

    
    res.status(200).json(produits);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
*/


export const getAllProduits = async (req: Request, res: Response) => {
  try {
    const produits = await Produit.find()
      .populate('parcel')
      .populate('user')
      .populate('qrCode');

    // Pour chaque produit, on génère un QR code
    const produitsAvecQr = await Promise.all(
      produits.map(async (produit) => {
        const qrData = {
          libelle: produit.libelle,
          parcelettraitement: produit.parcel ,
          etat: produit.etat,
          quantite:produit.quantite      
          };

        const qrCodeImage = await qrcode.toDataURL(JSON.stringify(qrData));

        return {
          ...produit.toObject(), // convertir le document Mongoose en objet JS simple
          qrCodeImage,
        };
      })
    );

    res.status(200).json(produitsAvecQr);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des produits' });
  }
};


export const getProduitById = async (req: Request, res: Response): Promise<void> => {
  try {
    const produit = await Produit.findById(req.params.id)
    .populate('qrCode')
    .populate('parcel')
    .populate('user');

    if (!produit) 
         res.status(404).json({ message: "Produit not found" });

     const qrData = {
          name: produit?.libelle,
          traitement: produit?.parcel,
          etat: produit?.etat,
          quantite: produit?.quantite
        };
    
        const qrCodeImage = await qrcode.toDataURL(JSON.stringify(qrData));
    res.status(200).json({produit,qrCodeImage});
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const updateProduit = async (req: Request, res: Response) => {
  try {
    const updated = await Produit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const deleteProduit = async (req: Request, res: Response) => {
  try {
    await Produit.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getProduitByUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
  
      if (!userId) {
        res.status(401).json({ message: 'Authentification requise' });
        return;
      }
  
      const prod = await Produit.find({ user: userId })
        .populate({ path: 'parcel', select: 'nom' });

        
  
      res.status(200).json(prod);
    } 
    catch (error) {
      console.error('Erreur lors de la récupération des cultures:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };

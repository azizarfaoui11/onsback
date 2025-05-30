import { Request, Response } from 'express';
import { User } from '../models/user';
import mongoose from 'mongoose';
import {Lot} from '../models/Lot';
import { Parcel } from '../models/Parcels';






export const getAllUsers = async (req: Request, res: Response) => {
    try {
      // Récupérer tous les utilisateurs de la base de données
      const users = await User.find().select('-password'); // Exclure le mot de passe
      res.json(users); // Retourner la liste des utilisateurs
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };


  // Route : /api/users/role/:role
export const getUsersByRoleParam = async (req: Request, res: Response) => {
  try {
    const { role } = req.params;

    const users = await User.find({ role }).select('-password');

    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs par rôle:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};



  
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
  
      // Vérifier si l'ID est un ObjectId valide
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'ID invalide' });
        return;
      }
  
      const user = await User.findById(id);
  
      if (!user) {
        res.status(404).json({ message: 'Utilisateur non trouvé' });
        return;
      }
  
      await user.deleteOne();
      
      res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };



  export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const updates = req.body;
      const user = await User.findById(req.params.id);
  
      if (!user) {
        res.status(404).json({ message: 'Utilisateur non trouvé' });
        return;
      }
  
      Object.keys(updates).forEach((key) => {
        (user as any)[key] = updates[key];
      });
  
      await user.save();
      res.json(user);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };

  // controllers/statisticsController.ts
export const getAdminStatistics = async (req: Request, res: Response) => {
  try {
    const totalLots = await Lot.countDocuments();
    const totalParcels = await Parcel.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'farmer' });

    res.json({
      totalLots,
      totalParcels,
      totalFarmers,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du calcul des statistiques.' });
  }
};


export const lotpermonth = async (req:Request, res:Response) => {
  try {
    const stats = await Lot.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const formatted = stats.map((item) => ({
      month: getMonthName(item._id),
      total: item.total,
    }));

    const prediction = Math.round(
      formatted.reduce((sum, d) => sum + d.total, 0) / formatted.length
    );

    res.json({ stats: formatted, prediction });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

function getMonthName(monthNum: number) {
  const months = [
    "", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  return months[monthNum];
}

  
  
  

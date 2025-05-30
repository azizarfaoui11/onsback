import { Router , Request, Response} from "express";
import { acceptOrder, createOrder, getallOrders, getSellerOrders } from "../controllers/orderController";
import {auth} from "../middleware/auth";


const router = Router();


router.post('/create', auth, createOrder);

// Liste commandes du vendeur
router.get('/mine',auth, getSellerOrders);
router.get('/all',getallOrders);
router.put('/:id/accept', async (req, res) => {
  try {
    const updatedOrder = await acceptOrder(req.params.id);
    res.status(200).json(updatedOrder);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});



export default router ; 
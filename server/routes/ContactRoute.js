import { Router } from "express";
import { searchContacts } from "../controllers/ContactsController.js";
import {verifyToken} from "../middlewares/AuthMiddleware.js";
import { getContactsForDMList } from "../controllers/ContactsController.js";
const contactRoutes = Router();

contactRoutes.post("/search",verifyToken,searchContacts)
contactRoutes.get("/get-contacts-for-dm",verifyToken,getContactsForDMList)
 export default contactRoutes
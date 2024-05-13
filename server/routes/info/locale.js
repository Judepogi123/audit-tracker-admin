import express from "express";
import { database, ref, get } from "../../../firebase/dbConfig.js";

const router = express.Router();

router.get("/locale", async (req, res) => {
  try {
    const localeRef = ref(database, `Municipalities`);
    const snapshot = await get(localeRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      res.status(200).json(Object.values(data));
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    res.status(500).json({message: `Internal server error: ${error}`})
  }
});

export default router

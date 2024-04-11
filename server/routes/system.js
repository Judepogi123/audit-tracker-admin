import express from "express";

import { database } from "../../firebase/dbConfig.js";
import { get,ref } from "firebase/database";

const router = express.Router();

router.get("/system", async (req, res) => {
    const systemDataPath = ref(database, "System/auditInfo");
    const systemDataSnapshot = await get(systemDataPath);
    if (systemDataSnapshot.val()) {
      const data = systemDataSnapshot.val();
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "No system data found!" });
    }

});

export default router
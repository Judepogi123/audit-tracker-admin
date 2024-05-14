import express from "express";
const router = express.Router();

import { firestore,getDoc,doc} from "../../firebase/dbConfig.js";

import argon from "argon2";
import jwt from "jsonwebtoken";

router.use(express.json());

const jwtSecret =
  "84b84c3ee0d05ed64cc56d89dd9f80a6fba0c5fde53dc399a48dfb6629ada8ba69d5eb1b8c61cc18e442534e0d3b495a1f1f5e70ecbb05f80e0e4e30524750b1";

const handleGetUser = async (username, password) => {
  try {
    const userDoc = doc(firestore, "user_data", username);
    const userDocSnapshot = await getDoc(userDoc);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      if (!userData) {
        return "invalidUsername";
      }
      
      const userName = userData.userName;
      const storedHashedPassword = userData.userPassword;
      const passwordMatch = await argon.verify(storedHashedPassword, password);

      if (passwordMatch) {
        const token = jwt.sign({ userName: userName }, jwtSecret, {
          expiresIn: "1h",
        });
        return { username: userName, token };
      } else {
        return "wrongPassword";
      }
    } else {
      return "invalidUsername";
    }
  } catch (error) {
    throw error;
  }
};

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const loginStatus = await handleGetUser(username, password);

    if (loginStatus === "invalidUsername") {
      res.status(200).json({ message: "Invalid username", status: false,target: "username" });
      return;
    }
    if (loginStatus === "wrongPassword") {
      res.status(200).json({ message: "Incorrect password", status: false, target: "password" });
      return;
    }
    if (!loginStatus) {
      res.status(200).json({ message: "Unknown error", status: false });
      return;
    }

    const { username: validUsername, token } = loginStatus;
    res.status(200).json({ message: "Success", username: validUsername, token: token });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

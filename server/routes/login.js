import express from "express";
const router = express.Router();

import { firestore } from "../../firebase/dbConfig.js";
import { getDoc, doc } from "firebase/firestore";

import argon from "argon2";
import jwt from "jsonwebtoken";
//import { redis } from "../api/redis.js";

router.use(express.json());

const jwtSecrect =
  "84b84c3ee0d05ed64cc56d89dd9f80a6fba0c5fde53dc399a48dfb6629ada8ba69d5eb1b8c61cc18e442534e0d3b495a1f1f5e70ecbb05f80e0e4e30524750b1";

const handleGetUser = async (username, password) => {
  try {
    const userDoc = doc(firestore, "user_data", username);
    const userDocSnapshot = await getDoc(userDoc);

    if (userDocSnapshot.exists()) {
      const userName = userDocSnapshot.data().userName;
      const storedHashedPassword = userDocSnapshot.data().userPassword;
      const passwordMatch = await argon.verify(storedHashedPassword, password); // Correct order

      const token = jwt.sign({ userName: userName }, jwtSecrect, {
        expiresIn: "1h",
      });

      if (passwordMatch) {
        return { username: userDocSnapshot.data().userName, token };
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

    if (loginStatus) {
      const { username, token } = loginStatus;
      res
        .status(200)
        .json({ message: "success", username: username, token: token });
    } else {
      res.status(401).send(loginStatus);
    }
  } catch (error) {
    res.status(200).json({ message: "Server error" });
  }
});

export default router;

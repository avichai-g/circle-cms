import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("campaign_manager");

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate site ID
    const siteId = uuidv4();

    // Insert new user
    const result = await db.collection("users").insertOne({
      username,
      email,
      password: hashedPassword,
      siteId,
      createdAt: new Date(),
    });

    if (!result.acknowledged) {
      throw new Error("Failed to insert user into database");
    }

    res.status(201).json({
      message: "User created successfully",
      userId: result.insertedId.toString(),
      siteId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ message: "Error creating user. Please try again later." });
  }
}

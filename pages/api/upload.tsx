// pages/api/upload.js
import { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "../../app/lib/cloudinary";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { file } = req.body;

      // Ensure the file is a base64 string
      if (!file || !file.startsWith("data:image/")) {
        return res.status(400).json({ error: "Invalid file" });
      }

      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(file, {
        upload_preset: "your-upload-preset", // Optional: Set up an upload preset in Cloudinary
      });

      // Send the URL of the uploaded image back to the client
      res.status(200).json({ url: result.secure_url });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Error uploading image" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

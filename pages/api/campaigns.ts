import clientPromise from "../../app/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { Db } from "mongodb";

interface QueryParams {
  [key: string]: string | string[];
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db("campaign_manager");

  try {
    switch (req.method) {
      case "POST":
        await handlePost(req, res, db);
        break;
      case "GET":
        await handleGet(req, res, db);
        break;
      case "PATCH":
        await handlePatch(req, res, db);
        break;
      case "DELETE":
        await handleDelete(req, res, db);
        break;
      default:
        res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({
      error: `Failed to handle ${req.method} request: ${
        (error as Error).message
      }`,
    });
  }
}

// POST handler remains the same
async function handlePost(req: NextApiRequest, res: NextApiResponse, db: Db) {
  const {
    title,
    campaignName,
    campaignId,
    bannerHTML,
    siteId,
    isActive,
    campaignType,
  } = req.body;

  if (!title || !campaignName || !campaignId || !campaignType) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const col = db.collection("campaigns");
  const result = await col.insertOne({
    title,
    campaignName,
    campaignId,
    bannerHTML,
    siteId,
    isActive,
    campaignType,
    createdAt: new Date(),
  });

  res.status(201).json(result.acknowledged);
}

// Updated GET handler
async function handleGet(req: NextApiRequest, res: NextApiResponse, db: Db) {
  const col = db.collection("campaigns");
  const query: QueryParams = {};

  Object.entries(req.query).forEach(([key, value]) => {
    if (typeof value === "string") {
      if (key === "campaignId") {
        query[key] = value;
      } else {
        query[key] = value;
      }
    }
  });

  try {
    if (Object.keys(query).length > 0) {
      const results = await col.find(query).toArray();
      res.status(200).json(results);
    } else {
      const results = await col.find({}).toArray();
      res.status(200).json(results);
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid query parameters" });
  }
}

// Updated generic PATCH handler
async function handlePatch(req: NextApiRequest, res: NextApiResponse, db: Db) {
  const { campaignId } = req.query;
  const updateData = req.body;

  if (!campaignId) {
    return res.status(400).json({ error: "Missing campaignId for update" });
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: "No update data provided" });
  }

  const col = db.collection("campaigns");

  try {
    const result = await col.updateOne(
      { campaignId: campaignId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    res.status(200).json({
      message: "Campaign updated successfully",
      updatedFields: updateData,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update campaign",
      details: (error as Error).message,
    });
  }
}

// Updated DELETE handler
async function handleDelete(req: NextApiRequest, res: NextApiResponse, db: Db) {
  const { campaignId } = req.query;

  if (!campaignId) {
    return res.status(400).json({ error: "Missing campaignId for deletion" });
  }

  const col = db.collection("campaigns");
  const result = await col.deleteOne({ campaignId: campaignId });

  if (result.deletedCount === 0) {
    return res.status(404).json({ error: "Campaign not found" });
  }

  res.status(200).json({ message: "Campaign deleted successfully" });
}

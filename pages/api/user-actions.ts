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
      case "GET":
        await handleGet(req, res, db);
        break;
      default:
        res.setHeader("Allow", ["GET"]);
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

async function handleGet(req: NextApiRequest, res: NextApiResponse, db: Db) {
  const col = db.collection("user_actions");
  const { siteId } = req.query;

  if (!siteId) {
    return res.status(400).json({ error: "siteId is required" });
  }

  try {
    const results = await col.find({ "data.siteId": siteId }).toArray();

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch campaigns",
      details: (error as Error).message,
    });
  }
}

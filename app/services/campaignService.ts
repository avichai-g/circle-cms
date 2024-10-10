import { Campaign } from "../types/campaign";

interface FetchCampaignsProps {
  [key: string]: string;
}

export async function createCampaign(
  campaignData: Campaign
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(campaignData),
    });

    if (res.ok) {
      return { success: true, message: "Campaign saved successfully!" };
    } else {
      const errorData = await res.json();
      return {
        success: false,
        message: `Failed to save campaign: ${errorData.error}`,
      };
    }
  } catch (error) {
    console.error("Error creating campaign:", error);
    return {
      success: false,
      message: "An error occurred while saving the campaign.",
    };
  }
}

export async function fetchCampaigns(
  props: FetchCampaignsProps
): Promise<Campaign[]> {
  const queryString = new URLSearchParams(props).toString();
  const response = await fetch(`/api/campaigns?${queryString}`);
  if (!response.ok) {
    throw new Error("Failed to fetch campaigns");
  }

  return response.json();
}

export async function updateCampaign(
  campaignId: string,
  updateData: Partial<Campaign>
): Promise<void> {
  const response = await fetch(`/api/campaigns?campaignId=${campaignId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw new Error("Failed to update campaign");
  }
}

export async function deleteCampaign(campaignId: string): Promise<void> {
  const response = await fetch(`/api/campaigns?campaignId=${campaignId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete campaign");
  }
}

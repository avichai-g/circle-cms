export interface Campaign {
  _id?: string;
  id: any;
  title: string;
  campaignName: string;
  campaignType: "afterSaleBanner" | "abandonedBanner" | "sideBanner";
  bannerHTML: string;
  siteId: string;
  isActive: boolean;
  campaignId: string;
  createdAt: string;
  url?: string; // Optional
  image?: string;
}

export interface CampaignFormProps {
  onClose: () => void;
}

export interface ImageWithUrl {
  file: File | null;
  url: string;
}

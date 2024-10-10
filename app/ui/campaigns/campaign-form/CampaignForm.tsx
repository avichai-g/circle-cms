import React, { useState, useEffect } from "react";
import generateUUID from "../../../utils/uuid";
import { uploadImageToCloudinary } from "../../../services/cloudinary";
import { generateBannerHTML } from "../../../utils/bannerGenerator";
import { generateAfterSaleBannerHTML } from "../../../utils/afterSalebannerGenerator";
import { generateAbandonedBannerHTML } from "../../../utils/abondenedBannerGenerator";
import { createCampaign } from "../../../services/campaignService";

import {
  CampaignFormProps,
  Campaign,
  ImageWithUrl,
} from "../../../types/campaign";
import styles from "./CampaignForm.module.css";

function generateCampaignId(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const CampaignForm: React.FC<CampaignFormProps> = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [campaignType, setCampaignType] = useState("");
  const [imagesWithUrls, setImagesWithUrls] = useState<ImageWithUrl[]>([
    { file: null, url: "" },
  ]);
  const [uniqueId] = useState(generateUUID());
  const [siteId, setSiteId] = useState("");

  useEffect(() => {
    const storedSiteId = localStorage.getItem("siteId");
    if (storedSiteId) {
      setSiteId(storedSiteId);
    }
  }, []);

  const handleImageChange = (index: number, file: File | null) => {
    const newImagesWithUrls = [...imagesWithUrls];
    newImagesWithUrls[index] = { ...newImagesWithUrls[index], file };
    setImagesWithUrls(newImagesWithUrls);
  };

  const handleUrlChange = (index: number, url: string) => {
    const newImagesWithUrls = [...imagesWithUrls];
    newImagesWithUrls[index] = { ...newImagesWithUrls[index], url };
    setImagesWithUrls(newImagesWithUrls);
  };

  const addImageWithUrl = () => {
    if (imagesWithUrls.length < 3) {
      setImagesWithUrls([...imagesWithUrls, { file: null, url: "" }]);
    }
  };

  const removeImageWithUrl = (index: number) => {
    const newImagesWithUrls = imagesWithUrls.filter((_, i) => i !== index);
    setImagesWithUrls(newImagesWithUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filledImagesWithUrls = imagesWithUrls.filter(
      (item) => item.file && item.url
    );

    if (filledImagesWithUrls.length === 0) {
      alert("At least one image with URL is required");
      return;
    }

    if (
      campaignType === "afterSaleBanner" &&
      (filledImagesWithUrls.length < 1 || filledImagesWithUrls.length > 3)
    ) {
      alert(
        "Please provide between 1 and 3 images with URLs for After Sale Banner"
      );
      return;
    }

    try {
      const uploadedImagesWithUrls = await Promise.all(
        filledImagesWithUrls.map(async (item) => ({
          imageUrl: await uploadImageToCloudinary(item.file!),
          url: item.url,
        }))
      );

      if (uploadedImagesWithUrls.some((item) => !item.imageUrl)) {
        throw new Error("Failed to upload one or more images");
      }

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://circle-pixel-project.vercel.app";

      let bannerHTML;
      const imageUrl = uploadedImagesWithUrls[0].imageUrl || "";
      const url = uploadedImagesWithUrls[0].url || "";

      switch (campaignType) {
        case "sideBanner":
          bannerHTML = generateBannerHTML(
            uniqueId,
            imageUrl,
            url,
            apiUrl,
            siteId
          );
          break;
        case "afterSaleBanner":
          bannerHTML = generateAfterSaleBannerHTML(
            uniqueId,
            uploadedImagesWithUrls,
            apiUrl,
            siteId
          );
          break;
        case "abandonedBanner":
          bannerHTML = generateAbandonedBannerHTML(
            uniqueId,
            imageUrl,
            title,
            url,
            apiUrl,
            siteId
          );
          break;
        default:
          throw new Error("Invalid campaign type");
      }

      const campaignId = generateCampaignId();

      const campaignData: Campaign = {
        id: uniqueId,
        title,
        campaignName,
        campaignType,
        bannerHTML,
        siteId,
        isActive: true,
        campaignId,
        createdAt: new Date().toISOString(),
      };

      const { success, message } = await createCampaign(campaignData);

      if (success) {
        alert("Campaign saved!");
        setCampaignName("");
        setTitle("");
        setImagesWithUrls([{ file: null, url: "" }]);
        setCampaignType("");
        onClose();
      } else {
        alert(`Failed to save campaign: ${message}`);
      }
    } catch (error) {
      alert("An error occurred while saving the campaign.");
      console.error(error);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.formHeading}>Create a New Campaign</h2>
        <form onSubmit={handleSubmit} className={styles.campaignForm}>
          <div className={styles.formGroup}>
            <label>Campaign Name</label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Campaign Type</label>
            <select
              value={campaignType}
              onChange={(e) => setCampaignType(e.target.value)}
              required
            >
              <option value="">Select a type</option>
              <option value="sideBanner">Side Banner</option>
              <option value="afterSaleBanner">After Sale Banner</option>
              <option value="abandonedBanner">Abandoned Banner</option>
            </select>
          </div>
          {imagesWithUrls.map((item, index) => (
            <div key={index} className={styles.imageUrlGroup}>
              <div className={styles.formGroup}>
                <label>Image {index + 1}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageChange(index, e.target.files?.[0] || null)
                  }
                  required={index === 0}
                />
              </div>
              <div className={styles.formGroup}>
                <label>URL for Image {index + 1}</label>
                <input
                  type="url"
                  value={item.url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  required={index === 0}
                />
              </div>
              {index > 0 && (
                <button type="button" onClick={() => removeImageWithUrl(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          {campaignType === "afterSaleBanner" && imagesWithUrls.length < 3 && (
            <button type="button" onClick={addImageWithUrl}>
              Add Another Image
            </button>
          )}
          <button type="submit" className={styles.submitButton}>
            Publish
          </button>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CampaignForm;

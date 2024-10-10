"use client";

import React, { useState, useEffect } from "react";
import styles from "./campaigns.module.css";
import CampaignForm from "@/app/ui/campaigns/campaign-form/CampaignForm";
import Switch from "../../../components/Switch/Switch";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import {
  fetchCampaigns,
  updateCampaign,
  deleteCampaign,
} from "../../../services/campaignService";

interface Campaign {
  id: string;
  title: string;
  url: string;
  campaignName: string;
  image: string;
  bannerHTML: string;
  siteId: string;
  isActive: boolean;
  createdAt: string;
  campaignId: string;
  campaignType: string;
}

function CampaignDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(
    null
  );

  useEffect(() => {
    const siteId = localStorage.getItem("siteId");
    if (siteId) {
      fetchCampaigns({ siteId })
        .then((data) => {
          setCampaigns(data as any);
          setIsLoading(false);
        })
        .catch((err) => {
          setError("Failed to load campaigns");
          setIsLoading(false);
        });
    } else {
      setError("No site ID found");
      setIsLoading(false);
    }
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleToggleActive = async (campaign: Campaign) => {
    try {
      await updateCampaign(campaign.campaignId, {
        isActive: !campaign.isActive,
      });
      setCampaigns((prevCampaigns) =>
        prevCampaigns.map((c) =>
          c.campaignId === campaign.campaignId
            ? { ...c, isActive: !c.isActive }
            : c
        )
      );
    } catch (error) {
      console.error("Failed to update campaign status:", error);
      // Optionally, show an error message to the user
    }
  };

  const handleDeleteClick = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (campaignToDelete) {
      try {
        await deleteCampaign(campaignToDelete.campaignId);
        setCampaigns((prevCampaigns) =>
          prevCampaigns.filter(
            (c) => c.campaignId !== campaignToDelete.campaignId
          )
        );
        setIsDeleteModalOpen(false);
        setCampaignToDelete(null);
      } catch (error) {
        console.error("Failed to delete campaign:", error);
        // Optionally, show an error message to the user
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.campaignsDashboard}>
      <h1 className={styles.heading}>Campaign Management</h1>
      <button className={styles.newCampaignButton} onClick={openModal}>
        + New Campaign
      </button>
      <table className={styles.campaignsTable}>
        <thead>
          <tr>
            <th>Active</th>
            <th>Campaign Id</th>
            <th>Campaign Name</th>
            <th>Campaign Type</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.campaignId}>
              <td>
                <Switch
                  checked={campaign.isActive}
                  onChange={() => handleToggleActive(campaign)}
                />
              </td>
              <td>{campaign.campaignId}</td>
              <td>{campaign.campaignName}</td>
              <td>{campaign.campaignType}</td>
              <td
                className={`${styles.status} ${
                  campaign.isActive ? styles.active : styles.paused
                }`}
              >
                {campaign.isActive ? "Active" : "Paused"}
              </td>
              <td>{new Date(campaign.createdAt).toLocaleDateString()}</td>
              <td>
                <button className={`${styles.actionButton} ${styles.edit}`}>
                  ✏️
                </button>
                <button className={`${styles.actionButton} ${styles.copy}`}>
                  📋
                </button>
                <button
                  className={`${styles.actionButton} ${styles.delete}`}
                  onClick={() => handleDeleteClick(campaign)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && <CampaignForm onClose={closeModal} />}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete the campaign "${campaignToDelete?.campaignName}"?`}
      />
    </div>
  );
}

export default CampaignDashboard;

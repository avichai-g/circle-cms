"use client";
import { useEffect, useState } from "react";
import { Card } from "@/app/ui/dashboard/cards";
import { lusitana } from "@/app/ui/fonts";

type UserAction = {
  actionType: string;
  data: {
    campaignType?: string;
    siteId: string;
    trackingId: string;
    url: string;
  };
  timestamp: string;
  origin?: string;
  _id?: string;
};

type DashboardData = {
  afterSaleBanner: UserAction[];
  abandonedBanner: UserAction[];
  sideBanner: UserAction[];
  purchases: UserAction[];
};

async function fetchUserActions(siteId: string): Promise<UserAction[]> {
  const response = await fetch(`/api/user-actions?siteId=${siteId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export default function Page() {
  const [siteId, setSiteId] = useState<string>("");
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    afterSaleBanner: [],
    abandonedBanner: [],
    sideBanner: [],
    purchases: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const storedSiteId = localStorage.getItem("siteId");
      setSiteId(storedSiteId || "");
    } catch (e) {
      console.error("Error accessing localStorage:", e);
      setError(
        "Unable to access local storage. Some features may not work properly."
      );
    }
  }, []);

  useEffect(() => {
    async function loadUserActions() {
      if (!siteId) return;

      try {
        const data = await fetchUserActions(siteId);

        const processedData: DashboardData = {
          afterSaleBanner: [],
          abandonedBanner: [],
          sideBanner: [],
          purchases: [],
        };

        data.forEach((action) => {
          if (action.actionType === "purchase") {
            processedData.purchases.push(action);
          } else if (
            action.actionType === "banner_click" &&
            action.data &&
            action.data.campaignType
          ) {
            let campaignType = action.data.campaignType;

            // Handle the typo in 'abondenedBanner'
            if (campaignType === "abondenedBanner") {
              campaignType = "abandonedBanner";
            }

            if (campaignType in processedData) {
              processedData[campaignType as keyof DashboardData].push(action);
            }
          }
        });

        setDashboardData(processedData);
        setError("");
      } catch (error) {
        console.error("Error fetching user actions:", error);
        setError("Failed to fetch data. Please try again later.");
      }
    }

    loadUserActions();
  }, [siteId]);

  const ActionTable = ({ actions }: { actions: UserAction[] }) => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
            Tracking ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
            URL
          </th>
          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
            Timestamp
          </th>
          {actions[0]?.origin && (
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Origin
            </th>
          )}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {actions.map((action, index) => (
          <tr
            key={action._id || index}
            className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
          >
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {action.data.trackingId}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <a
                href={action.data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                {action.data.url}
              </a>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {new Date(action.timestamp).toLocaleString()}
            </td>
            {action.origin && (
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {action.origin}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className={`${lusitana.className} text-xl md:text-2xl`}>
          User Actions Dashboard
        </h1>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-1">
        <Card
          title="Purchases"
          value={dashboardData.purchases.length.toString()}
          type="collected"
        >
          <ActionTable actions={dashboardData.purchases} />
        </Card>

        <Card
          title="After Sale Banner Clicks"
          value={dashboardData.afterSaleBanner.length.toString()}
          type="collected"
        >
          <ActionTable actions={dashboardData.afterSaleBanner} />
        </Card>

        <Card
          title="Abandoned Banner Clicks"
          value={dashboardData.abandonedBanner.length.toString()}
          type="pending"
        >
          <ActionTable actions={dashboardData.abandonedBanner} />
        </Card>

        <Card
          title="Side Banner Clicks"
          value={dashboardData.sideBanner.length.toString()}
          type="invoices"
        >
          <ActionTable actions={dashboardData.sideBanner} />
        </Card>
      </div>
    </main>
  );
}

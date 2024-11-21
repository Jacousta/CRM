"use client";

import { useState, useEffect } from "react";
import CampaignCard from "../../components/CampaignCard";
import { fetchCampaigns } from "../../utils/api";
import { toast } from "react-toastify";

interface AudienceRule {
  field: string;
  operator: string;
  value: string;
  condition: string;
}

interface Campaign {
  _id: string;
  campaignName: string;
  campaignMessage: string;
  audienceRules: AudienceRule[];
  audienceSize: number;
  deliveryStatus: string;
  sentCount: number;
  failedCount: number;
  createdAt: string;
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedRules, setSelectedRules] = useState<AudienceRule[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const getCampaigns = async () => {
    try {
      setLoading(true)
      const data = await fetchCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    getCampaigns();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
          Campaigns
        </h1>
        <button
          onClick={() => {
            toast.success("Campaigns refreshed");
            getCampaigns();
          }}
          className="flex items-center px-5 py-2 bg-xenoBlue text-white font-medium rounded-lg shadow-md hover:bg-indigo-600 transition-all duration-300 ease-in-out"
        >
          <svg className="w-5 h-5 mx-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" />
          </svg>
          <span className="mx-1">Refresh</span>
        </button>
      </div>

      {loading ? (
        <div role="status" className="flex justify-center items-center py-10">
          <svg
            aria-hidden="true"
            className="w-12 h-12 text-blue-600 animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No past campaigns found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full table-auto bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700 text-left">Campaign Name</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700 text-left">Campaign Message</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700 text-left">Audience</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700 text-left">Status</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700 text-left">Audience Rules</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-600">
              {campaigns.map((campaign) => (
                <CampaignCard
                  key={campaign._id}
                  campaign={campaign}
                  onViewRules={setSelectedRules}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedRules && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative transition-all transform scale-95 hover:scale-100 duration-300 ease-in-out">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Audience Rules</h3>
            {selectedRules.length === 0 ? (
              <p className="text-gray-700 font-medium">All customers</p>
            ) : (
              <ul className="space-y-4">
                {selectedRules.map((rule, index) => (
                  <li key={index} className="p-4 border rounded-lg bg-gray-100">
                    <p className="text-gray-700 font-medium">
                      {rule.field} {rule.operator} {rule.value} ({rule.condition})
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setSelectedRules(null)}
              className="absolute -top-4 -right-4 bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
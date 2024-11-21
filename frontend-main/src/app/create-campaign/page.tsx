"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createCampaign, checkAudienceSize } from "../../utils/api";
import { toast } from "react-toastify";

interface Rule {
  field: string;
  operator: string;
  value: string;
  condition: "AND" | "OR"; // Updated to match expected type
}

interface Audience {
  campaignName: string;
  campaignMessage: string;
  rules: Rule[];
}

const availableFields = [
  { label: "Total Spends", value: "total_spends" },
  { label: "Visits", value: "visits" },
  { label: "Last Visit", value: "last_visit" },
];

const operators = [
  { label: "Equals", value: "=" },
  { label: "Not Equals", value: "!=" },
  { label: "Greater Than", value: ">" },
  { label: "Less Than", value: "<" },
  { label: "Greater or Equals", value: ">=" },
  { label: "Less or Equals", value: "<=" },
];

export default function CreateAudience() {
  const [audience, setAudience] = useState<Audience>({
    campaignName: "",
    campaignMessage: "",
    rules: [],
  });
  const [audienceSize, setAudienceSize] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAudienceSize = async () => {
      try {
        const size = await checkAudienceSize(audience);
        setAudienceSize(size);
      } catch (error) {
        console.error("Failed to check audience size:", error);
      }
    };

    fetchAudienceSize();
  }, [audience]);

  const addRule = () => {
    setAudience({
      ...audience,
      rules: [
        ...audience.rules,
        {
          field: availableFields[0].value,
          operator: operators[0].value,
          value: "",
          condition: "AND", // Default value as "AND"
        },
      ],
    });
  };

  const removeRule = (index: number) => {
    const rules = [...audience.rules];
    rules.splice(index, 1);
    setAudience({ ...audience, rules });
  };

  const handleChange =
    (index: number, field: keyof Rule) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const rules = [...audience.rules];
      rules[index] = { ...rules[index], [field]: e.target.value };
      setAudience({ ...audience, rules });
    };

  const handleCampaignNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAudience({ ...audience, campaignName: e.target.value });
  };

  const handleCampaignMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAudience({ ...audience, campaignMessage: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createCampaign(audience);
    } catch (error) {
      console.error("Error creating campaign:", error);
    } finally {
      toast.success("Campaign created successfully");
      router.push("/campaigns");
    }
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-semibold mb-6 text-gray-800">Create Campaign</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white p-8 shadow-lg rounded-xl border border-gray-200"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="campaignName"
              className="block text-gray-700 font-medium mb-2"
            >
              Campaign Name
            </label>
            <input
              type="text"
              id="campaignName"
              placeholder="Enter Campaign Name"
              value={audience.campaignName}
              onChange={handleCampaignNameChange}
              className="w-full p-4 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            />
          </div>
          <div>
            <label
              htmlFor="campaignMessage"
              className="block text-gray-700 font-medium mb-2"
            >
              Campaign Message
            </label>
            <input
              type="text"
              id="campaignMessage"
              placeholder="Enter Campaign Message"
              value={audience.campaignMessage}
              onChange={handleCampaignMessageChange}
              className="w-full p-4 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Audience Rules</h2>
          {audience.rules.length === 0 ? (
            <div className="p-4 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg">
              <p>All customers will be included if no rules are added.</p>
            </div>
          ) : (
            audience.rules.map((rule, index) => (
              <div key={index} className="flex flex-wrap space-x-6 items-center">
                <select
                  value={rule.field}
                  onChange={handleChange(index, "field")}
                  className="w-full sm:w-auto p-4 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                >
                  {availableFields.map((field) => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ))}
                </select>
                <select
                  value={rule.operator}
                  onChange={handleChange(index, "operator")}
                  className="w-full sm:w-auto p-4 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                >
                  {operators.map((operator) => (
                    <option key={operator.value} value={operator.value}>
                      {operator.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Value"
                  value={rule.value}
                  onChange={handleChange(index, "value")}
                  className="w-full sm:w-auto p-4 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                />
                {index > 0 && (
                  <select
                    value={rule.condition}
                    onChange={handleChange(index, "condition")}
                    className="w-full sm:w-auto p-4 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                  >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                )}
                <button
                  type="button"
                  onClick={() => removeRule(index)}
                  className="p-3 text-red-600 hover:text-red-800 transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6"
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
            ))
          )}
          <button
            type="button"
            onClick={addRule}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            Add Rule
          </button>
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Create Campaign
          </button>
          <div className="bg-gray-50 p-4 rounded-lg shadow-md w-1/3">
            <p className="text-lg font-semibold text-gray-800">
              Audience Size:{" "}
              {audienceSize !== null ? audienceSize : "Calculating..."}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
import React, { useState } from "react";
import { api } from "@/services/api"; // Assuming you have an API service

interface CashCountEntry {
  currency: string;
  nos: string;
  amount: string;
  created_date: string; // Correct field name
}

interface CashCountSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialEntries: CashCountEntry[] = [
  { currency: "500", nos: "", amount: "", created_date: new Date().toISOString().split("T")[0] },
  { currency: "200", nos: "", amount: "", created_date: new Date().toISOString().split("T")[0] },
  { currency: "100", nos: "", amount: "", created_date: new Date().toISOString().split("T")[0] },
  { currency: "50", nos: "", amount: "", created_date: new Date().toISOString().split("T")[0] },
  { currency: "10", nos: "", amount: "", created_date: new Date().toISOString().split("T")[0] },
  { currency: "5", nos: "", amount: "", created_date: new Date().toISOString().split("T")[0] },
  { currency: "1", nos: "", amount: "", created_date: new Date().toISOString().split("T")[0] },
];

const CashCountSheetModal: React.FC<CashCountSheetModalProps> = ({ isOpen, onClose }) => {
  const [entries, setEntries] = useState<CashCountEntry[]>(initialEntries);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update all entries' date when the first entry's date changes
  const handleDateChange = (index: number, value: string) => {
    const newEntries = entries.map((entry, i) => {
      if (i === index) {
        return { ...entry, created_date: value }; // Updated field name
      }
      return { ...entry, created_date: value }; // Update all entries' dates
    });
    setEntries(newEntries);
  };

  const handleInputChange = (index: number, field: keyof CashCountEntry, value: string) => {
    const newEntries = entries.map((entry, i) => {
      if (i === index) {
        const updatedEntry = { ...entry, [field]: value };

        // Auto-calculate amount when currency and nos are both filled
        if (field === "nos" || field === "currency") {
          const calculatedAmount = Number(updatedEntry.currency) * Number(updatedEntry.nos);
          updatedEntry.amount = isNaN(calculatedAmount) ? "" : String(calculatedAmount);
        }
        return updatedEntry;
      }
      return entry;
    });
    setEntries(newEntries);
  };

  const handleSubmit = () => {
    // Filter out entries where nos is not greater than 0
    const filteredEntries = entries.filter(entry => Number(entry.nos) > 0);

    if (filteredEntries.length === 0) {
      setError("At least one 'Nos' field must be greater than 0.");
      return;
    }

    setIsSubmitting(true);

    // Send the filtered entries to the backend
    api
      .post("/cashcount-sheet/", { entries: filteredEntries }) // Sending only valid entries
      .then(() => {
        onClose();
      })
      .catch((error) => {
        setError("Failed to create cash count sheet. Please try again.");
        console.error(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
console.log('entries',entries);

  // Calculate grand total
  const calculateGrandTotal = () => {
    return entries.reduce((total, entry) => total + Number(entry.amount || 0), 0);
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black bg-opacity-50">
      <div className="bg-blue-100 p-6 rounded-lg shadow-lg w-full max-w-5xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Create Cash Count Sheet</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Render static entries with borders */}
        {entries.map((entry, index) => (
          <div
            key={index}
            className="mb-4 border border-gray-300 rounded-lg p-4 grid grid-cols-4 gap-4 items-end"
          >
            {/* Date Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={entry.created_date} // Updated field name
                onChange={(e) => handleDateChange(index, e.target.value)}
                className="block w-full py-2 px-4 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none"
                placeholder="Enter date"
              />
            </div>

            {/* Currency Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Currency</label>
              <input
                type="number"
                value={entry.currency}
                readOnly
                className="block w-full py-2 px-4 border border-gray-300 bg-gray-100 rounded-lg shadow-sm focus:outline-none"
                placeholder="Enter currency (e.g., 1000)"
              />
            </div>

            {/* Nos Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nos</label>
              <input
                type="number"
                value={entry.nos}
                onChange={(e) => handleInputChange(index, "nos", e.target.value)}
                className="block w-full py-2 px-4 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none"
                placeholder="Enter count of currency"
                min="1"
              />
            </div>

            {/* Amount Display (auto-calculated) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                value={entry.amount}
                readOnly
                className="block w-full py-2 px-4 border border-gray-300 bg-gray-100 rounded-lg shadow-sm focus:outline-none"
                placeholder="Calculated amount"
              />
            </div>
          </div>
        ))}

        {/* Grand Total */}
        <div className="border-t border-gray-300 mt-4 pt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total Amount:</span>
            <span>{calculateGrandTotal().toFixed(2)}</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-sm transition duration-300 ease-in-out disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
          <button
            onClick={onClose}
            className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-6 rounded-lg shadow-sm transition duration-300 ease-in-out"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default CashCountSheetModal;

import React from "react";

// Define types inside the component file
interface ShareUser {
    id: number;
    name: string;
    category: string;
}

interface ShareUserTransaction {
    share_user_data: ShareUser; // Change to match ProfitLoseShareReport.tsx
    profit_lose: string;
    percentage: number;
    amount: string;
}

interface ShareUserTransactionsModalProps {
    transactions: ShareUserTransaction[];
    onClose: () => void;
}

const ShareUserTransactionsModal: React.FC<ShareUserTransactionsModalProps> = ({
    transactions,
    onClose,
}) => {
    // Calculate total amount
    const totalAmount = transactions.reduce(
        (sum, transaction) => sum + parseFloat(transaction.amount),
        0
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl relative overflow-x-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
                >
                    &times;
                </button>
                <h2 className="text-xl font-bold mb-4">Share User Transactions</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 mt-4">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit/Loss</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map((transaction, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.share_user_data.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.share_user_data.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.profit_lose}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.percentage}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{transaction.amount}</td>
                                </tr>
                            ))}
                            <tr>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-700">Total Amount</td>
                                <td colSpan={4} className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                                    {totalAmount.toFixed(2)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ShareUserTransactionsModal;

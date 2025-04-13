import React from "react";

const DonationRequests = ({
  donations,
  isUpdating,
  handleUpdateStatus,
}) => {
  // Get pending donations only
  const pendingDonations = donations.filter(d => d.status === "pending");
  
  return (
    <div className="border-t-2 border-gray-300 py-3 mb-6">
      <h2 className="text-xl font-semibold mb-2">Received Donation Requests</h2>
      {pendingDonations.length === 0 ? (
        <p className="text-gray-600 p-4 bg-gray-50 rounded">No pending donation requests received yet.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          {pendingDonations.map((donation) => (
            <div key={donation._id} className="p-4 border-b last:border-b-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="mb-1">
                    <span className="font-semibold">Donor:</span>{" "}
                    {donation.donor_id?.name || "Unknown"}
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold">Email:</span>{" "}
                    {donation.donor_id?.email || "Unknown"}
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold">Phone:</span>{" "}
                    {donation.donor_id?.phone || "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="mb-1">
                    <span className="font-semibold">Blood Group:</span>{" "}
                    <span className="text-red-600 font-semibold">
                      {donation.request_id?.blood_group || "Unknown"}
                    </span>
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold">Units Needed:</span>{" "}
                    {donation.request_id?.units_needed || "Unknown"}
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold">Status:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-sm font-medium ${
                        donation.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : donation.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {donation.status || "Unknown"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="mt-3 flex justify-end space-x-2">
                <button
                  onClick={() =>
                    handleUpdateStatus(
                      donation._id,
                      "completed",
                      donation.request_id?._id
                    )
                  }
                  disabled={isUpdating}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  Accept Donation
                </button>
                <button
                  onClick={() =>
                    handleUpdateStatus(donation._id, "cancelled")
                  }
                  disabled={isUpdating}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationRequests;
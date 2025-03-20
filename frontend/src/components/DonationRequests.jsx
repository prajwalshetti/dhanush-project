// DonationRequests.jsx
import React from "react";

const DonationRequests = ({
  donations,
  isUpdating,
  handleUpdateStatus,
}) => {
  return (
    <div className="border-t-2 border-gray-300 py-3 mb-4">
      <h2 className="text-xl font-semibold mb-2">Received Donation Requests</h2>
      {donations.length === 0 ? (
        <p className="text-gray-600">No donation requests received yet.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          {donations
            .filter((d) => d.status === "pending")
            .map((donation) => (
              <div key={donation._id} className="p-4 border-b last:border-b-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <p className="mb-1">
                      <span className="font-semibold">Donor:</span>{" "}
                      {donation.donor_id.name}
                    </p>
                    <p className="mb-1">
                      <span className="font-semibold">Email:</span>{" "}
                      {donation.donor_id.email}
                    </p>
                    <p className="mb-1">
                      <span className="font-semibold">Phone:</span>{" "}
                      {donation.donor_id.phone}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1">
                      <span className="font-semibold">Blood Group:</span>{" "}
                      {donation.request_id.blood_group}
                    </p>
                    <p className="mb-1">
                      <span className="font-semibold">Units Needed:</span>{" "}
                      {donation.request_id.units_needed}
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
                        {donation.status}
                      </span>
                    </p>
                  </div>
                </div>
                {donation.status === "pending" && (
                  <div className="mt-3 flex justify-end space-x-2">
                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          donation._id,
                          "completed",
                          donation.request_id._id
                        )
                      }
                      disabled={isUpdating}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      Accept
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
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default DonationRequests;

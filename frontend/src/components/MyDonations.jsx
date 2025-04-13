import React from "react";

const MyDonations = ({ myDonations, isLoading }) => {
  // Early return if loading
  if (isLoading) {
    return (
      <div className="border-t-2 border-gray-300 py-3 mb-6">
        <h2 className="text-xl font-semibold mb-2">My Donations</h2>
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading your donations...</p>
        </div>
      </div>
    );
  }

  // Group donations by status
  const pendingDonations = myDonations.filter(d => d.status === "pending");
  const completedDonations = myDonations.filter(d => d.status === "completed");
  const rejectedDonations = myDonations.filter(d => d.status === "cancelled");

  return (
    <div className="border-t-2 border-gray-300 py-3 mb-6">
      <h2 className="text-xl font-semibold mb-2">My Donations</h2>
      
      {myDonations.length === 0 ? (
        <p className="text-gray-600 p-4 bg-gray-50 rounded">You haven't made any donation offers yet.</p>
      ) : (
        <>
          {/* Pending Donations */}
          {pendingDonations.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2 text-blue-600">Pending Donations ({pendingDonations.length})</h3>
              <div className="bg-white rounded-lg shadow-md mb-4">
                {pendingDonations.map((donation) => (
                  <DonationCard key={donation._id} donation={donation} />
                ))}
              </div>
            </div>
          )}

          {/* Completed Donations */}
          {completedDonations.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2 text-green-600">Completed Donations ({completedDonations.length})</h3>
              <div className="bg-white rounded-lg shadow-md mb-4">
                {completedDonations.map((donation) => (
                  <DonationCard key={donation._id} donation={donation} />
                ))}
              </div>
            </div>
          )}

          {/* Rejected Donations */}
          {rejectedDonations.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2 text-red-600">Rejected Donations ({rejectedDonations.length})</h3>
              <div className="bg-white rounded-lg shadow-md">
                {rejectedDonations.map((donation) => (
                  <DonationCard key={donation._id} donation={donation} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Individual donation card component
const DonationCard = ({ donation }) => {
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Handle missing data gracefully
  const requestInfo = donation.request_id || {};
  const requesterInfo = donation.requester_id || {};

  return (
    <div className="p-4 border-b last:border-b-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="mb-1">
            <span className="font-semibold">Requester:</span>{" "}
            {requesterInfo.name || "Unknown"}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Contact:</span>{" "}
            {requesterInfo.phone || requesterInfo.email || "Not available"}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Date Offered:</span>{" "}
            {formatDate(donation.createdAt)}
          </p>
        </div>
        <div>
          <p className="mb-1">
            <span className="font-semibold">Blood Group:</span>{" "}
            <span className="text-red-600 font-semibold">
              {requestInfo.blood_group || "Unknown"}
            </span>
          </p>
          <p className="mb-1">
            <span className="font-semibold">Units Needed:</span>{" "}
            {requestInfo.units_needed || "Unknown"}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Location:</span>{" "}
            {requestInfo.location || "Unknown"}
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
      
      {/* Show details for completed donations */}
      {donation.status === "completed" && donation.completed_date && (
        <div className="mt-2 p-2 bg-green-50 rounded">
          <p className="text-sm text-green-700">
            <span className="font-semibold">Donation completed on:</span>{" "}
            {formatDate(donation.completed_date)}
          </p>
        </div>
      )}
      
      {/* Show message for rejected donations */}
      {donation.status === "cancelled" && (
        <div className="mt-2 p-2 bg-red-50 rounded">
          <p className="text-sm text-red-700">
            This donation request was declined by the requester.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyDonations;
// CurrentRequests.jsx
import React from "react";

const CurrentRequests = ({ userRequests }) => {
  return (
    <div className="border-t-2 border-gray-300 py-3 mb-4">
      <h2 className="text-xl font-semibold mb-2">Current Request</h2>
      {userRequests.length > 0 ? (
        <div className="bg-white rounded-lg p-4 shadow-md">
          {userRequests.map((request) => (
            <div key={request._id} className="mb-2 last:mb-0">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold mr-2">
                    Blood Type: {request.blood_group}
                  </span>
                  <span className="text-gray-600">
                    Location: {request.location}
                  </span>
                </div>
                <div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                    {request.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">You have no active requests.</p>
      )}
    </div>
  );
};

export default CurrentRequests;

// PastRequests.jsx
import React from "react";

const PastRequests = ({ pastRequests, completedDonations, viewDonorInfo }) => {
  return (
    <div className="border-t-2 border-gray-300 py-3 mb-4">
      <h2 className="text-xl font-semibold mb-2">Past Requests</h2>
      {pastRequests.length > 0 ? (
        <div className="bg-white rounded-lg p-4 shadow-md">
          {pastRequests.map((request) => (
            <div
              key={request._id}
              className="mb-2 last:mb-0 p-2 border-b last:border-b-0"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold mr-2">
                    Blood Type: {request.blood_group}
                  </span>
                  <span className="text-gray-600">
                    Location: {request.location}
                  </span>
                </div>
                <div className="flex items-center">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      request.status === "fulfilled"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {request.status}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {request.status === "fulfilled" &&
                completedDonations[request._id] && (
                  <div className="mt-2">
                    <button
                      onClick={() => viewDonorInfo(request._id)}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      View Donor Info
                    </button>
                  </div>
                )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">You have no past requests.</p>
      )}
    </div>
  );
};

export default PastRequests;

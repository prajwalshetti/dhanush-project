import React from "react";

const PastRequests = ({ pastRequests, completedDonations, viewDonorInfo }) => {
  return (
    <div className="border-t-2 border-gray-300 py-3">
      <h2 className="text-xl font-semibold mb-2">Past Requests</h2>
      {pastRequests.length === 0 ? (
        <p className="text-gray-600">You have no past requests.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          {pastRequests.map((request) => {
            const hasDonorInfo = completedDonations && completedDonations[request._id];
            
            return (
              <div key={request._id} className="p-4 border-b last:border-b-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <p className="mb-1">
                      <span className="font-semibold">Blood Type:</span>{" "}
                      <span className="text-red-600">{request.blood_group}</span>
                    </p>
                    <p className="mb-1">
                      <span className="font-semibold">Units:</span>{" "}
                      {request.units_needed}
                    </p>
                    <p className="mb-1">
                      <span className="font-semibold">Location:</span>{" "}
                      {request.location}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1">
                      <span className="font-semibold">Created:</span>{" "}
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                    <p className="mb-1">
                      <span className="font-semibold">Status:</span>{" "}
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === "fulfilled" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                      }`}>
                        {request.status}
                      </span>
                    </p>
                    {request.status === "fulfilled" && (
                      <div className="mt-2">
                        <button
                          onClick={() => viewDonorInfo(request._id)}
                          className={`px-3 py-1 text-sm rounded ${
                            hasDonorInfo
                              ? "bg-blue-500 text-white hover:bg-blue-600"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                          disabled={!hasDonorInfo}
                        >
                          View Donor Info
                        </button>
                        {!hasDonorInfo && (
                          <p className="text-xs text-gray-500 mt-1">
                            Donor information not available
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PastRequests;
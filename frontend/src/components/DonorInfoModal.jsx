import React, { useEffect } from "react";
import { toast } from "react-toastify";

const DonorInfoModal = ({ currentDonorInfo, onClose }) => {
  if (!currentDonorInfo) return null;
  
  useEffect(() => {
    // Show toast notification when the modal is opened
    toast.success("Donor and requester information exchanged. Check SMS for details.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-green-600">
          Donation Information
        </h2>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Donor Information</h3>
          <p>
            <span className="font-medium">Name:</span> {currentDonorInfo.donor.name}
          </p>
          <p>
            <span className="font-medium">Email:</span> {currentDonorInfo.donor.email}
          </p>
          <p>
            <span className="font-medium">Phone:</span>{" "}
            {currentDonorInfo.donor.phone || "N/A"}
          </p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Request Details</h3>
          <p>
            <span className="font-medium">Blood Group:</span>{" "}
            {currentDonorInfo.donation.request_id?.blood_group || "N/A"}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            {currentDonorInfo.donation.status}
          </p>
        </div>
        <div className="text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonorInfoModal;
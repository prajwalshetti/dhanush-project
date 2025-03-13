import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Make sure axios is installed

const RequestForm = () => {
    const [formData, setFormData] = useState({
        blood_group: "",
        units_needed: "",
        hospital: "",
        location: "",
        urgency_level: "normal",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            // Send the request to your backend API
            const response = await axios.post(
                "http://localhost:8000/api/bloodrequest/create", 
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        // Include the auth token from localStorage
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            
            console.log("Blood request created:", response.data);
            
            // Successful request - now navigate to donors list
            navigate(`/donors?blood_group=${formData.blood_group}&location=${formData.location}`);
        } catch (err) {
            console.error("Error creating blood request:", err);
            setError(err.response?.data?.message || "Failed to create blood request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Request Blood</h2>
            
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium">Blood Group</label>
                    <select
                        name="blood_group"
                        className="w-full p-2 border rounded-md focus:ring focus:ring-red-300"
                        onChange={handleChange}
                        value={formData.blood_group}
                        required
                    >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Units Needed</label>
                    <input
                        type="number"
                        name="units_needed"
                        className="w-full p-2 border rounded-md focus:ring focus:ring-red-300"
                        onChange={handleChange}
                        value={formData.units_needed}
                        required
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Hospital</label>
                    <input
                        type="text"
                        name="hospital"
                        className="w-full p-2 border rounded-md focus:ring focus:ring-red-300"
                        onChange={handleChange}
                        value={formData.hospital}
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Location</label>
                    <input
                        type="text"
                        name="location"
                        className="w-full p-2 border rounded-md focus:ring focus:ring-red-300"
                        onChange={handleChange}
                        value={formData.location}
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Urgency Level</label>
                    <select
                        name="urgency_level"
                        className="w-full p-2 border rounded-md focus:ring focus:ring-red-300"
                        onChange={handleChange}
                        value={formData.urgency_level}
                        required
                    >
                        <option value="normal">Normal</option>
                        <option value="urgent">Urgent</option>
                        <option value="emergency">Emergency</option>
                    </select>
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 disabled:bg-red-300"
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit Request"}
                </button>
            </form>
        </div>
    );
};

export default RequestForm;
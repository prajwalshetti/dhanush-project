import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

const RequestForm = () => {
    const [formData, setFormData] = useState({
        blood_group: "",
        units_needed: "",
        hospital: "",
        location: "",
        latitude: null,
        longitude: null,
        urgency_level: "normal",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [locationStatus, setLocationStatus] = useState("idle"); // idle, loading, success, error

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    function gotLocation(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        
        // Store latitude and longitude as separate fields
        setFormData(prevState => ({
            ...prevState,
            latitude: latitude,
            longitude: longitude
        }));
        
        // Update the location status to show success
        setLocationStatus("success");
        
        // Debug logs
        console.log("Location fetched:", { latitude, longitude });
        console.log("Updated formData:", {
            ...formData,
            latitude: latitude,
            longitude: longitude
        });
    }
    
    const getLocation = () => {
        setLocationStatus("loading");
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                gotLocation,
                (error) => {
                    console.error("Error getting location:", error);
                    setLocationStatus("error");
                    setError("Could not get your location. Please check your browser permissions.");
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
            );
        } else {
            setLocationStatus("error");
            setError("Geolocation is not supported by your browser.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage("");
        
        // Double check that latitude and longitude exist before submitting
        if (formData.latitude === null || formData.longitude === null) {
            setError("Please get your GPS location before submitting");
            setLoading(false);
            return;
        }
        
        console.log("Submitting data:", formData);
        
        try {
            // Send the request using cookies-based authentication
            const response = await axios.post(
                "http://localhost:8000/api/bloodrequest/create", 
                formData,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true // This enables sending cookies with cross-origin requests
                }
            );
            
            console.log("Blood request created:", response.data);
            setSuccessMessage("Blood request created successfully! Redirecting to donors list...");
            
            // Add a slight delay before redirecting to show the success message
            setTimeout(() => {
                // Successful request - now navigate to donors list
                navigate(`/`);
            }, 1500);
        } catch (err) {
            console.error("Error creating blood request:", err);
            
            // More specific error handling
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(err)
                if (err.response.status === 401) {
                    setError("Authentication error: Please log in again");
                } else {
                    setError(err.response.data?.message || "Server error: Please try again");
                }
            } else if (err.request) {
                // The request was made but no response was received
                setError("Network error: Could not connect to server");
            } else {
                // Something happened in setting up the request
                setError("Application error: Please try again");
            }
        } finally {
            setLoading(false);
        }
    };

    // Simple validation check
    const isFormValid = () => {
        return (
            formData.blood_group && 
            formData.units_needed && 
            formData.hospital && 
            formData.location &&
            formData.urgency_level &&
            formData.latitude !== null &&
            formData.longitude !== null
        );
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Request Blood</h2>
            
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}
            
            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                    {successMessage}
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
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="location"
                            className="flex-1 p-2 border rounded-md focus:ring focus:ring-red-300"
                            onChange={handleChange}
                            value={formData.location}
                            required
                            placeholder="Enter your location"
                        />
                        <button
                            type="button"
                            onClick={getLocation}
                            className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 flex-shrink-0"
                            disabled={locationStatus === "loading"}
                        >
                            {locationStatus === "loading" ? "Getting..." : "Get GPS"}
                        </button>
                    </div>
                    {locationStatus === "success" && (
                        <div className="mt-1 text-sm text-green-600">
                            ✓ GPS location detected
                        </div>
                    )}
                    {locationStatus === "error" && (
                        <div className="mt-1 text-sm text-red-600">
                            Could not get location. Please try again.
                        </div>
                    )}
                    {formData.latitude !== null && formData.longitude !== null && (
                        <div className="mt-1 text-xs text-gray-500">
                            Coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                        </div>
                    )}
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
                    disabled={loading || !isFormValid()}
                >
                    {loading ? "Submitting..." : "Submit Request"}
                </button>
            </form>
        </div>
    );
};

export default RequestForm;
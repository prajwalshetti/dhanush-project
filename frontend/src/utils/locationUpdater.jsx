import axios from 'axios';

/**
 * Updates the user's location using the device's geolocation
 * @param {Function} onSuccess - Callback function called on successful location update
 * @param {Function} onError - Callback function called on location update error
 * @param {Function} onPermissionDenied - Callback function called when location permission is denied
 * @returns {Promise<void>}
 */
export const updateUserLocation = (onSuccess, onError, onPermissionDenied) => {
  // Check if geolocation is available
  if (!navigator.geolocation) {
    onError(new Error("Your browser doesn't support geolocation"));
    return Promise.reject(new Error("Geolocation not supported"));
  }
  
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          console.log("[LocationUpdater] Got coordinates:", { latitude, longitude });
          
          // Make API call to update location
          const response = await axios.patch(
            'http://localhost:8000/api/auth/update-location',
            { latitude, longitude },
            { withCredentials: true }
          );
          
          console.log("[LocationUpdater] Server response:", response.data);
          
          if (response.data.success) {
            if (onSuccess) onSuccess(response.data.location);
            resolve(response.data.location);
          } else {
            const error = new Error(response.data.message || "Failed to update location");
            if (onError) onError(error);
            reject(error);
          }
        } catch (err) {
          console.error("[LocationUpdater] Error:", err);
          if (onError) onError(err);
          reject(err);
        }
      },
      (error) => {
        console.log("[LocationUpdater] Geolocation error:", error);
        // Handle permission denied specially
        if (error.code === 1) {
          if (onPermissionDenied) onPermissionDenied();
          reject(new Error("Location permission denied"));
        } else {
          if (onError) onError(error);
          reject(error);
        }
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 0 
      }
    );
  });
};
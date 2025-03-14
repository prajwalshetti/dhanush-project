import React,{useState , useEffect} from 'react'
import axios from 'axios'


function Donation() {
    
    const [bloodRequests, setBloodRequests] = useState([]);
    const [loading , setLoading] = useState(true)
    const [error , setError] = useState(null)

    const fetchBloodRequests = async()=>{
        try{
            const response = await axios.get("http://localhost:8000/api/bloodrequest/eligible" , {
                withCredentials : true
            })
            console.log(response)
            setBloodRequests(response.data.requests)

        }
        catch(err)
        {
            setError("Failed to load blood requests. Please try again.");
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchBloodRequests()
    } , [])


    
  return (
    <div className="max-w-3xl mx-auto p-6">
    <h2 className="text-2xl font-bold mb-4 text-center">Available Blood Requests</h2>

    {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
    ) : error ? (
        <p className="text-center text-red-500">{error}</p>
    ) : bloodRequests.length === 0 ? (
        <p className="text-center text-gray-600">No blood requests available.</p>
    ) : (
        <ul className="space-y-4">
            {bloodRequests.map((request) => (
                <li key={request._id} className="p-4 border rounded-lg">
                    <p><strong>Blood Group:</strong> {request.blood_group}</p>
                    <p><strong>Units Needed:</strong> {request.units_needed}</p>
                    <p><strong>City:</strong> {request.location}</p>

                    <p><strong>Status:</strong> <span className="text-blue-600">{request.status}</span></p>
                    <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
                        Donate Now
                    </button>
                </li>
            ))}
        </ul>
    )}
</div>
  )
}

export default Donation


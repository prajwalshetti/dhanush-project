import { useState } from 'react';

const Donation = () => {
    const [donationDate, setDonationDate] = useState('');
    const [status, setStatus] = useState('pending');
    const [requestId, setRequestId] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleRegisterDonation = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token'); // Assuming token is stored after login

            const response = await fetch('http://localhost:8000/api/donations/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    request_id: requestId,
                    donation_date: donationDate,
                    status
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to register donation');
            }

            setMessage('Donation registered successfully!');
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-center text-red-500 mb-4">Register a Donation</h2>
                
                {message && (
                    <div className={`text-center ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'} mb-4`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleRegisterDonation} className="space-y-4">
                    {/* Request ID */}
                    <div>
                        <label className="block text-gray-600 mb-1">Request ID (Optional)</label>
                        <input
                            type="text"
                            value={requestId}
                            onChange={(e) => setRequestId(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                        />
                    </div>

                    {/* Donation Date */}
                    <div>
                        <label className="block text-gray-600 mb-1">Donation Date</label>
                        <input
                            type="date"
                            value={donationDate}
                            onChange={(e) => setDonationDate(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                            required
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-gray-600 mb-1">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-red-500 text-white font-bold py-2 rounded hover:bg-red-600 transition"
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register Donation'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Donation;

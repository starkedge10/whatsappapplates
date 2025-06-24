import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { deleteCampaign, fetchCampaigns } from '../redux/Campaign/campaignThunks';







function CampaignList({ onEdit, broadcast }) {
    const dispatch = useDispatch();
    const campaigns = useSelector((state) => state.campaign.campaigns);

    const [limit, setLimit] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(fetchCampaigns());
    }, [dispatch]);

    const totalPages = Math.ceil(campaigns.length / limit);
    const currentData = campaigns.slice((currentPage - 1) * limit, currentPage * limit);

    const handleNext = () => currentPage < totalPages && setCurrentPage((prev) => prev + 1);
    const handlePrev = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);

    const handleEdit = (item) => {
        onEdit(item);
    };

    const handleBroadCast = (item) => {
        broadcast(item);
    };

    const handleCampaignDelete = (_id) => {
        toast.promise(
            dispatch(deleteCampaign(_id)).unwrap(),
            {
                pending: 'Deleting campaign...',
                success: 'Campaign deleted!',
                error: 'Failed to delete campaign',
            }
        );
    };








    
    return (
        <div className='mt-[20px] rounded-md p-[0px] bg-white text-gray-600 flex flex-col justify-between'>
            <div className='min-h-[40vh] max-h-[40vh] px-2 overflow-auto'>
                <table className='table-auto w-full'>
                    <thead>
                        <tr className='sticky top-0 z-10 bg-white border-b border-gray-300 text-nowrap text-center'>
                            <th className='pb-4 text-left'>Campaign Name</th>
                            <th className='pb-4'>Contacts</th>
                            <th className='pb-4'>Total Delivered</th>
                            <th className='pb-4'>Read Count</th>
                            <th className='pb-4'>Failed Count</th>
                            <th className='pb-4 text-right'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500">No campaigns found.</td>
                            </tr>
                        ) : (
                            currentData.map((item) => (
                                <tr key={item._id} className="text-center font-semibold">
                                    <td
                                        className="text-left py-4 text-blue-500 hover:underline cursor-pointer"
                                        onClick={() => handleEdit(item)}
                                    >
                                        {item.campaignName || '-'}
                                    </td>
                                    <td>{item.contactList?.length || '-'}</td>
                                    <td>{item.totalCount || 0}</td>
                                    <td>{item.readCount || 0}</td>
                                    <td>{item.failedCount || 0}</td>
                                    <td className="text-right">
                                        <div className='flex items-center gap-2 justify-end'>
                                            <button
                                                type='button'
                                                className='px-2 py-1 border rounded-lg text-green-600 text-sm font-medium bg-green-50 hover:bg-green-100 border-green-600'
                                                onClick={() => handleBroadCast(item)}
                                            >
                                                Send Broadcast
                                            </button>
                                            <i
                                                className="fa-solid fa-pen-to-square bg-gray-100 p-2 rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-100 cursor-pointer"
                                                onClick={() => handleEdit(item)}
                                            />
                                            <i
                                                className="fa-solid fa-trash bg-gray-100 p-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-100 cursor-pointer"
                                                onClick={() => handleCampaignDelete(item._id)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className='flex items-center justify-between mt-4 px-2 py-2 text-gray-700'>
                <div className='flex items-center font-semibold text-gray-600 gap-2'>
                    <span>Items per page:</span>
                    <select
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="border focus:outline-none border-gray-300 rounded px-1 py-1"
                    >
                        {[2, 3, 10, 20, 50].map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                </div>

                <div className='flex items-center font-semibold text-gray-600 gap-4'>
                    <span className='mr-4'>Page {currentPage} of {totalPages}</span>
                    <button onClick={handlePrev} disabled={currentPage === 1}>
                        <i className={`fas fa-angle-left text-lg ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 cursor-pointer'}`} />
                    </button>
                    <button onClick={handleNext} disabled={currentPage === totalPages}>
                        <i className={`fas fa-angle-right text-lg ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 cursor-pointer'}`} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CampaignList;

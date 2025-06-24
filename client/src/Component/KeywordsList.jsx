import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { fetchKeywords, deleteKeywords } from '../redux/Keywords/keywordThunk';




function KeywordsList({ onOpen, onEdit, onSearch }) {

    const dispatch = useDispatch();
    const [limit, setLimit] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);



    const keywords = useSelector(state => state.keywords.keywords)

    useEffect(() => {
        if (keywords.length === 0) {
            dispatch(fetchKeywords());
        }
    })




    const filteredKeywords = keywords.filter((keyword) => {
        if (!onSearch) return true;

        const search = onSearch.toLowerCase();

        const replyMaterialText = keyword.replyMaterial
            .map((item) =>
                Object.values(item)
                    .map((v) => (typeof v === 'string' ? v : ''))
                    .join(' ')
            )
            .join(' ')
            .toLowerCase();

        return (
            keyword.keywords.some((kw) => kw.toLowerCase().includes(search)) ||
            keyword.matchingMethod.toLowerCase().includes(search) ||
            replyMaterialText.includes(search) ||
            keyword.triggered?.toString().includes(search) ||
            keyword.fuzzyThreshold.toString().includes(search)
        );
    });



    const totalPages = Math.ceil(filteredKeywords.length / limit);
    const currentData = filteredKeywords.slice((currentPage - 1) * limit, currentPage * limit);

    const handleNext = () => currentPage < totalPages && setCurrentPage((prev) => prev + 1);
    const handlePrev = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);





    const handleEdit = (id) => {
        onOpen(true);
        const keywordToEdit = keywords.find(k => k._id === id);
        if (keywordToEdit) {
            onEdit(keywordToEdit);
        } else {
            console.warn(`Keyword with id ${id} not found.`);
        }
    };


    const handleDelete = (id) => {




        toast.promise(
            dispatch(deleteKeywords(id)),
            {
                pending: 'deleting keywords...',
                success: 'Keywords deleted!',
                error: 'Failed to add keywords',
            }
        );
    };




    return (
        <div className='flex flex-col justify-between h-[calc(100vh-192px)] text-gray-600'>
            <div className='mt-0 px-8 flex flex-col justify-between overflow-auto'>
                <table className='table-auto w-full   '>
                    <thead className='text-xl '>
                        <tr className="sticky top-0 z-10 border-b border-gray-300 bg-white text-center text-nowrap ">
                            <th className="py-10 pr-22 text-left font-semibold">Keyword</th>
                            <th className='py-10 pr-22 text-center font-semibold'>Triggered</th>
                            <th className='py-10 pr-22 text-center font-semibold'>Matching method</th>
                            <th className='py-10 pr-22 text-center font-semibold'>Reply material</th>
                            <th className='py-10 text-right font-semibold'>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentData.length > 0 ? (
                            currentData.map((kw) => (
                                <tr key={kw._id} className=' text-center text-lg'>
                                    <td className='py-6 pr-1 text-left max-w-[400px]'>
                                        {Array.isArray(kw.keywords) && kw.keywords.length > 0 ? (
                                            <div className="flex flex-wrap  gap-2">
                                                {kw.keywords.map((word, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-block bg-green-100 text-green-600  font-medium px-3 py-1 rounded-full truncate max-w-[150px]"
                                                    >
                                                        {word}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>

                                    <td className='py-6 pr-22'>{kw.triggered || 0}</td>
                                    <td className='py-6 pr-22'>
                                        {kw.matchingMethod
                                            ? `${kw.matchingMethod.charAt(0).toUpperCase()}${kw.matchingMethod.slice(1).toLowerCase()}${kw.matchingMethod.toLowerCase() === 'fuzzy' && kw.fuzzyThreshold ? ` (${kw.fuzzyThreshold}%)` : ''
                                            }`
                                            : 'Fuzzy'}
                                    </td>


                                    <td className='py-6 pr-22 text-sm flex flex-wrap gap-2 justify-center'>
                                        {Array.isArray(kw.replyMaterial) && kw.replyMaterial.length > 0 ? (
                                            kw.replyMaterial.map((item, index) => (
                                                <div key={index} className='border border-[FF9933] bg-[#FFFAF5] text-nowrap rounded-md inline p-2 text-[#FF9933]'>
                                                    <strong>{item.replyType}</strong>: <span className='truncate inline-block overflow-hidden whitespace-nowrap text-ellipsis max-w-[60px] align-bottom'>{item.name || item.currentReply?.name}</span>
                                                </div>
                                            ))
                                        ) : (
                                            'None'
                                        )}
                                    </td>


                                    <td className='py-6 text-right'>
                                        <div className='flex gap-4 justify-end'>
                                            <i className="fa-solid fa-pen-to-square bg-gray-100 p-2 rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-100 cursor-pointer" onClick={() => handleEdit(kw._id)} ></i>
                                            <i className="fa-solid fa-trash bg-gray-100 p-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-100 cursor-pointer" onClick={() => handleDelete(kw._id)}></i>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className='py-10 text-center text-gray-500'>
                                    No keywords found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>











            <div className='flex items-center justify-between px-8 py-5 text-sm bg-gray-100'>
                <div className='flex items-center text-lg font-semibold text-gray-600 gap-2'>
                    <span>Items per page:</span>
                    <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="border focus:outline-none border-gray-300 rounded px-2 py-1">
                        {[2, 3, 10, 20, 50].map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                </div>

                <div className='flex items-center text-lg font-semibold text-gray-600 gap-4'>
                    <span className='mr-4'>Page {currentPage} of {totalPages}</span>
                    <button onClick={handlePrev} disabled={currentPage === 1}><i className={`fas fa-angle-left text-lg  ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 cursor-pointer'}`} /></button>
                    <button onClick={handleNext} disabled={currentPage === totalPages}><i className={`fas fa-angle-right text-lg  ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 cursor-pointer'}`} /></button>
                </div>
            </div>
        </div>
    );
}

export default KeywordsList;

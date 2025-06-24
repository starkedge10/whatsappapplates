import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { deleteChatbot, getChatbots } from '../../redux/Chatbot/chatbotsThunk.js';
import { useEffect } from 'react';
import { fetchChatbotReply, deleteReplyMaterial, fetchReplyMaterial } from '../../redux/ReplyMaterial/ReplyMaterialThunk.js';
import { fetchKeywords } from '../../redux/Keywords/keywordThunk.js';




function ChatbotList({ onSearch }) {

    const dispatch = useDispatch();




    const Chatbots = useSelector((state) => state.chatbots.chatbots)


    useEffect(() => {
        if (Chatbots.length == 0) {
            dispatch(getChatbots())
        }
    }, [])


    const replyMaterial = useSelector((state) => state.replyMaterial.replyMaterial);

    useEffect(() => {
        if (replyMaterial.length === 0) {
            dispatch(fetchReplyMaterial());
        }
    }, []);




    const keywords = useSelector(state => state.keywords.keywords)

    useEffect(() => {
        if (keywords.length === 0) {
            dispatch(fetchKeywords());
        }
    })


    const navigate = useNavigate();




    const filteredChatbots = Chatbots.filter((chatbot) => {
        if (!onSearch) return true;

        const search = onSearch.toLowerCase();
        return (
            chatbot.name.toLowerCase().includes(search) ||
            chatbot.triggered.toString().includes(search) ||
            chatbot.finished.toString().includes(search) ||
            chatbot.lastUpdated.toString().includes(search)
        )
    });





    const [limit, setLimit] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(filteredChatbots.length / limit);
    const currentData = filteredChatbots.slice((currentPage - 1) * limit, currentPage * limit);

    const handleNext = () => currentPage < totalPages && setCurrentPage((prev) => prev + 1);
    const handlePrev = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);








    const handleDelete = (chatbot) => {

        console.log("Deleting template: ", chatbot);

        const replyMaterialToDelete = replyMaterial
            .filter(reply => reply.content.materialId === chatbot._id)


        console.log(replyMaterialToDelete);



        const isUsedInKeywords = keywords.some(keyword =>
            keyword.replyMaterial.some(material => material.name === chatbot.name)
        );

        console.log(isUsedInKeywords);

        if (isUsedInKeywords) {
            toast.warning("Reply material is in use");
            return;
        }


        dispatch(deleteChatbot(chatbot._id))
            .then(() => {
                if (replyMaterialToDelete.length > 0) {
                    dispatch(deleteReplyMaterial(replyMaterialToDelete[0]._id));

                }

            });
    };







    const handleEdit = (chatbotId) => {
        navigate('/chatbot/flowbuilder', { state: { chatbotId } });
    };



    return (
        <>
            <div className='flex flex-col justify-between h-[calc(100vh-175px)] text-gray-500'>
                <div className='mt-0 px-8 flex flex-col justify-between h-full overflow-auto'>
                    <table className='table-auto w-full   '>
                        <thead className='text-lg text-gray-600'>
                            <tr className="sticky top-0 z-10 border-b border-gray-300 bg-white text-center text-nowrap ">
                                <th className="py-6 pr-22 text-left font-semibold">Name</th>
                                <th className='py-6 pr-22 text-center font-semibold'>Triggered</th>
                                <th className='py-6 pr-22 text-center font-semibold'>Finished</th>
                                <th className='py-6 pr-22 text-center font-semibold'>Last Updated</th>
                                <th className='py-6 text-right font-semibold'>Actions</th>
                            </tr>
                        </thead>

                        <tbody className=' font-semibold '>
                            {currentData.length > 0 ? (
                                currentData.map((chatbot) => (
                                    <tr key={chatbot._id} className=' text-center '>
                                        <td className='py-4 pr-1 text-left text-blue-600 max-w-[400px]'>
                                            <div className='cursor-pointer hover:underline' onClick={() => handleEdit(chatbot._id)}>{chatbot.name}</div>
                                        </td>

                                        <td className='py-4 pr-22'>{chatbot.triggered}</td>
                                        <td className='py-4 pr-22'>{chatbot.finished}</td>
                                        <td className='py-4 pr-22'>
                                            {chatbot.lastUpdated
                                                ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', }).format(new Date(chatbot.lastUpdated))
                                                : 'N/A'}
                                        </td>




                                        <td className='py-4 text-right'>
                                            <div className='flex gap-4 justify-end'>
                                                <i className="fa-solid fa-pen-to-square bg-gray-100 p-2 rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-100 cursor-pointer" onClick={() => handleEdit(chatbot._id)} ></i>
                                                <i className="fa-solid fa-trash bg-gray-100 p-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-100 cursor-pointer" onClick={() => handleDelete(chatbot)}></i>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className='py-10 text-center text-gray-500'>
                                        No Chatbot found.
                                    </td>
                                </tr>
                            )}



                        </tbody>


                    </table>
                </div>








                <div className='flex items-center justify-between px-8 py-5 text-sm bg-gray-100'>
                    <div className='flex items-center text-lg font-semibold text-gray-500 gap-2'>
                        <span>Items per page:</span>
                        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="border focus:outline-none border-gray-300 rounded px-2 py-1">
                            {[2, 3, 10, 20, 50].map((n) => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </div>

                    <div className='flex items-center text-lg font-semibold text-gray-500 gap-4'>
                        <span className='mr-4'>Page {currentPage} of {totalPages}</span>
                        <button onClick={handlePrev} disabled={currentPage === 1}><i className={`fas fa-angle-left text-lg  ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 cursor-pointer'}`} /></button>
                        <button onClick={handleNext} disabled={currentPage === totalPages}><i className={`fas fa-angle-right text-lg  ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 cursor-pointer'}`} /></button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatbotList
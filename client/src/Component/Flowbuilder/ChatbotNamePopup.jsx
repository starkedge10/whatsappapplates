import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateChatbotName } from '../../redux/Chatbot/chatbotsThunk.js';
import { toast } from 'react-toastify';







function ChatbotNamePopup({ onClose, chatbotId, initialName }) {
    const dispatch = useDispatch();
    const [chatbotName, setChatbotName] = useState(initialName || '');

    const formRef = useRef(null);

    const handleClickOutside = (event) => {

        if (formRef.current && !formRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (chatbotName.trim()) {

            toast.promise(
                dispatch(updateChatbotName({ id: chatbotId, newName: chatbotName.trim() })),
                {
                    pending: 'updating chatbot name...',
                    success: 'Chatbot name updated successfully!',
                    error: 'Failed to update chatbot name',
                }
            );
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div ref={formRef} className="p-4 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[330px]">
                <div className="flex justify-between border-b border-gray-300 items-center pb-2">
                    <h4 className="font-semibold text-gray-800 text-lg">Update Chatbot Name</h4>
                    <i
                        className="fa-solid fa-xmark text-xl cursor-pointer hover:scale-110 text-red-600"
                        onClick={onClose}
                    ></i>
                </div>

                <form onSubmit={handleSubmit}>
                    <h5 className="font-semibold text-sm mt-8">Chatbot Name</h5>
                    <input
                        required
                        type="text"
                        className="w-full text-sm bg-gray-100 px-2 py-2 mt-1 rounded-md focus:outline-none"
                        placeholder="Enter new name"
                        value={chatbotName}
                        onChange={(e) => setChatbotName(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="bg-green-600 text-sm hover:bg-green-700 rounded-lg px-2 py-2 text-white mt-8 float-end cursor-pointer"
                    >
                        Update Chatbot Name
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatbotNamePopup;

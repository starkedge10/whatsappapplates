import React, { useEffect, useRef, useState } from 'react';
import { TextField, Button } from '@mui/material';

function MessageNodeForm({ onClose, node, updateNodeData }) {
    const [showMessageInput, setShowMessageInput] = useState(false);
    const [showImageInput, setShowImageInput] = useState(false);
    const [message, setMessage] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);


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




    useEffect(() => {
        const content = node?.data?.content || {};
        if (content.message) {
            setMessage(content.message);
            setShowMessageInput(true);
        }

        if (content.image) {
            if (typeof content.image === 'string') {
                setImageFile(content.image);    // Now imageFile is base64 string or URL string
                setImagePreview(content.image);
            }
        }
    }, [node]);



    const handleMessage = () => {
        setShowMessageInput(true);
    };

    const handleImage = () => {
        setShowImageInput(true);
    };


    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };



    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await fileToBase64(file);  // Convert to base64 string
            setImageFile(base64); // Save base64 string instead of File object
            setImagePreview(base64); // Show preview using base64 string
        }
    };



    const handleSubmit = () => {
        const updatedNode = {
            ...node,
            data: {
                ...node.data,
                content: {
                    ...node.data.content,
                    message: message,
                    image: imageFile, // base64 string
                },
            },
        };

        updateNodeData(node.id, updatedNode.data);
        onClose();

    }




    return (
        <div className='fixed inset-0 bg-black/70 z-50 flex items-center justify-center'>
            <div ref={formRef} className='p-4 bg-white rounded-lg shadow-lg border border-gray-200 w-[350px] relative z-50 max-h-[90vh] overflow-y-auto'>
                <div className='flex justify-between items-center pb-4'>
                    <h4 className='font-semibold text-lg'>Set a message</h4>
                    <i
                        className='fa-solid fa-xmark text-2xl cursor-pointer hover:scale-110 text-red-600'
                        onClick={onClose}
                    ></i>
                </div>

                <div className='flex flex-col gap-5 mt-4'>

                    {showMessageInput && (
                        <div className='relative'>
                            <TextField
                                required
                                name="messageContent"
                                label="Message Content"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                multiline
                                rows={5}
                                fullWidth
                                size="small"
                                variant="outlined"
                                sx={{
                                    mt: 2,
                                    backgroundColor: '#f9fafb',
                                    borderRadius: '4px',
                                    '& label.Mui-focused': {
                                        color: '#00A63E',
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#00A63E',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#00A63E',
                                        },
                                        borderRadius: '10px',
                                    },
                                }}
                            />
                            <i
                                className="float-right fa-solid fa-trash text-xs bg-gray-100 p-2 rounded-full text-red-500 hover:text-red-600 hover:bg-red-100 cursor-pointer"
                                onClick={() => setShowMessageInput(false)}
                            ></i>
                        </div>
                    )}

                    {showImageInput && (
                        <div className='relative'>

                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className='mt-2  rounded w-full h-auto '
                                />
                            )}
                            <Button
                                variant="outlined"
                                component="label"
                                size="small"
                                className='!border-green-600 !text-green-600 !mt-2'
                            >
                                Upload Image
                                <input
                                    type="file"
                                    name="headerImage"
                                    accept="image/*"
                                    hidden
                                    onChange={handleFileChange}
                                />
                            </Button>



                            <i
                                className="float-right fa-solid fa-trash text-xs bg-gray-100 p-2 rounded-full text-red-500 hover:text-red-600 hover:bg-red-100 cursor-pointer"
                                onClick={() => {
                                    setShowImageInput(false);
                                    setImageFile(null);
                                    setImagePreview(null);
                                }}
                            ></i>
                        </div>
                    )}
                </div>

                <div className='flex items-center flex-wrap gap-2 mt-8'>
                    <button
                        type='button'
                        className={`text-sm px-2 py-1 rounded-md bg-green-50 cursor-pointer hover:bg-green-100 border border-green-600 text-green-600 ${showMessageInput && 'bg-green-100'}`}
                        onClick={handleMessage}
                    >
                        Message
                    </button>
                    <button
                        type='button'
                        className={`text-sm px-2 py-1 rounded-md bg-green-50 cursor-pointer hover:bg-green-100 border border-green-600 text-green-600 ${showImageInput && 'bg-green-100'}`}
                        onClick={handleImage}
                    >
                        Image
                    </button>
                    <button type='button' className='text-sm px-2 py-1 rounded-md bg-green-50 cursor-pointer hover:bg-green-100 border border-green-600 text-green-600'>Video</button>
                    <button type='button' className='text-sm px-2 py-1 rounded-md bg-green-50 cursor-pointer hover:bg-green-100 border border-green-600 text-green-600'>Document</button>
                </div>


                <div className='mt-6 flex gap-4 items-center justify-end'>
                    <button type='button' className='px-3 py-1 rounded-md bg-gray-100 cursor-pointer hover:bg-gray-200' onClick={() => onClose()}>Cancel</button>
                    <button type='submit' className='px-3 py-1 rounded-md bg-green-600 cursor-pointer hover:bg-green-700 text-white' onClick={handleSubmit} >Save</button>
                </div>
            </div>
        </div>
    );
}

export default MessageNodeForm;

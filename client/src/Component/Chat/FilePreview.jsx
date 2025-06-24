import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import EmojiPicker from 'emoji-picker-react';
import socket from './socket';






function FilePreview({ files, setFiles, onClose, selectedUser }) {
    const [previewFiles, setPreviewFiles] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const fileInputRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const inputRef = useRef(null);
    const modalRef = useRef(null);



    const accessToken = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;
    const businessId = import.meta.env.VITE_WHATSAPP_BUSINESS_ID;
    const PHONE_NUMBER_ID = import.meta.env.VITE_PHONE_NUMBER_ID;






    useEffect(() => {
        const previews = [];

        if (files.length === 0) {
            setPreviewFiles([]);
            setSelectedIndex(0);
            return;
        }

        let loaded = 0;

        Array.from(files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = () => {
                previews[index] = {
                    name: file.name,
                    url: reader.result,
                    type: file.type,
                    caption: ''
                };
                loaded++;
                if (loaded === files.length) {
                    setPreviewFiles(previews);
                }
            };

            if (
                file.type.startsWith('image/') ||
                file.type.startsWith('video/') ||
                file.type.startsWith('audio/') ||
                file.type === 'application/pdf' ||
                file.type.startsWith('text/')
            ) {
                reader.readAsDataURL(file);
            } else {
                previews[index] = {
                    name: file.name,
                    url: null,
                    type: file.type,
                    caption: ''
                };
                loaded++;
                if (loaded === files.length) {
                    setPreviewFiles(previews);
                }
            }
        });
    }, [files]);

    const getFileType = (type, name) => {
        if (type?.startsWith('image/')) return 'image';
        if (type?.startsWith('video/')) return 'video';
        if (type?.startsWith('audio/')) return 'audio';
        if (type === 'application/pdf') return 'document';
        if (type?.startsWith('text/')) return 'document';

        if (name && name.includes('.')) {
            const ext = name.split('.').pop().toLowerCase();
            if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)) return 'document';
        }

        return 'unknown';
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        if (showEmojiPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showEmojiPicker]);



    const handleToggleEmojiPicker = () => {
        setShowEmojiPicker((prev) => !prev);
    };

    const handleEmojiClick = ({ emoji }) => {
        const input = inputRef.current;
        if (!input) return;

        const start = input.selectionStart;
        const end = input.selectionEnd;

        const currentCaption = previewFiles[selectedIndex]?.caption || '';
        const newCaption =
            currentCaption.slice(0, start) + emoji + currentCaption.slice(end);

        const updatedPreviews = [...previewFiles];
        updatedPreviews[selectedIndex].caption = newCaption;
        setPreviewFiles(updatedPreviews);

        // Wait for the state to update before restoring focus and cursor
        setTimeout(() => {
            input.focus();
            const cursorPosition = start + emoji.length;
            input.setSelectionRange(cursorPosition, cursorPosition);
        }, 0);
    };



    const handleClose = () => {
        setFiles([]);
        setPreviewFiles([]);
        setSelectedIndex(0);
    };

    const handleCaptionChange = (e) => {
        const updatedPreviews = [...previewFiles];
        updatedPreviews[selectedIndex].caption = e.target.value;
        setPreviewFiles(updatedPreviews);
    };

    const handleAddMoreClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleAddMoreFiles = (e) => {
        const newFiles = Array.from(e.target.files);
        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
        e.target.value = '';
    };



    const getAcceptTypes = () => {
        if (!files || typeof files !== 'object') return '';

        const acceptTypes = new Set();

        Array.from(files).forEach(file => {
            const type = file.type;
            if (type) {
                acceptTypes.add(type);
            } else {
                const ext = file.name.split('.').pop().toLowerCase();
                acceptTypes.add(`.${ext}`);
            }
        });

        return Array.from(acceptTypes).join(',');
    };




    const handleSubmit = () => {
        const fileArray = Array.from(files); 

        if (fileArray.length === 0) {
            return alert('No files selected.');
        }

        const filePayload = fileArray.map((file, i) => ({
            file,
            caption: previewFiles[i]?.caption || ''
        }));


        console.log(filePayload);


        socket.emit("sendMediaMessage", {
            files: filePayload,
            selectedUser,
        });

        setFiles([]);
        setPreviewFiles([]);
        setSelectedIndex(0);
        onClose();
    };






    const selectedFile = previewFiles[selectedIndex];
    const fileType = getFileType(selectedFile?.type, selectedFile?.name);






    return (
        <div className="bg-white rounded-lg border border-gray-200 w-[900px] max-h-[90vh] overflow-y-auto p-4 pb-8 relative">
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold">Preview</h3>
                <i
                    className='fa-solid fa-xmark text-3xl cursor-pointer hover:scale-110 text-red-600 absolute top-4 right-4'
                    onClick={handleClose}
                ></i>
            </div>

            {selectedFile && (
                <div className="flex flex-col items-center">
                    {fileType === 'image' && (
                        <div className="h-[400px] w-[400px] rounded flex items-center justify-center">
                            <img
                                src={selectedFile.url}
                                alt={selectedFile.name}
                                className="max-h-full max-w-full object-contain rounded-md"
                            />
                        </div>

                    )}
                    {fileType === 'video' && (
                        <video controls className="h-[400px] w-[80%]">
                            <source src={selectedFile.url} type={selectedFile.type} />
                            Your browser does not support the video tag.
                        </video>
                    )}
                    {fileType === 'audio' && (
                        <div className="h-[400px] w-[80%]  bg-gray-50  rounded-md flex items-center justify-center">
                            <audio controls className="w-[80%]">
                                <source src={selectedFile.url} type={selectedFile.type} />
                                Your browser does not support the audio tag.
                            </audio>
                        </div>
                    )}
                    {(fileType === 'pdf' || fileType === 'document') && (
                        // <iframe src={selectedFile.url} title={selectedFile.name} className="h-[400px] w-[80%]" />
                        <div className="h-[400px] w-[80%] bg-gray-100 rounded-md flex flex-col items-center justify-center">

                            <div>
                                <svg width="70" height="70" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="preview__file"><path d="M7.5 7.5H10.8333M7.5 12.5H10M7.5 10H12.5" stroke="#666666" stroke-width="1.25" stroke-linecap="round"></path><path d="M2.79406 7.45869C3.33698 5.14417 5.14417 3.33698 7.45869 2.79406C9.13021 2.40198 10.8698 2.40198 12.5413 2.79406C14.8558 3.33698 16.663 5.14418 17.2059 7.4587C17.598 9.13021 17.598 10.8698 17.2059 12.5413C16.663 14.8558 14.8558 16.663 12.5413 17.2059C10.8698 17.598 9.13021 17.598 7.4587 17.2059C5.14418 16.663 3.33698 14.8558 2.79406 12.5413C2.40198 10.8698 2.40198 9.13021 2.79406 7.45869Z" stroke="#666666" stroke-width="1.25"></path></svg>
                            </div>
                            <p className='text-gray-700 font-semibold text-sm'>

                                No preview available for this file type.</p>
                        </div>
                    )}
                    {fileType === 'office' || fileType === 'unknown' ? (
                        // <a
                        //     href={selectedFile.url || '#'}
                        //     target="_blank"
                        //     rel="noopener noreferrer"
                        //     className="text-blue-600 underline mt-4"
                        // >
                        //     {selectedFile.name}
                        // </a>


                        <div className="h-[400px] w-[80%]  bg-gray-100  rounded-md flex items-center justify-center">
                            <p className='text-gray-700 font-semibold text-sm'>No preview available for this file type.</p>
                        </div>

                    ) : (
                        <div className='relative w-[80%] '>
                            <input
                                type="text"
                                ref={inputRef}
                                placeholder="Add Caption"
                                value={selectedFile.caption}
                                onChange={handleCaptionChange}
                                className=" px-3 py-2 bg-gray-100 rounded-md text-sm focus:outline-none mt-4 w-full"
                            />

                            <div className='absolute right-2  top-[50%]  cursor-pointer' onClick={handleToggleEmojiPicker}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M8.49999 16.2083C12.7572 16.2083 16.2083 12.7572 16.2083 8.49996C16.2083 4.24276 12.7572 0.791626 8.49999 0.791626C4.24279 0.791626 0.791656 4.24276 0.791656 8.49996C0.791656 12.7572 4.24279 16.2083 8.49999 16.2083Z" stroke="#353735" stroke-width="1.25" stroke-miterlimit="10"></path><path d="M6.62498 5.79163H4.95831" stroke="#353735" stroke-width="1.25" stroke-miterlimit="10" stroke-linecap="round"></path><path d="M12.0417 5.79163H10.375" stroke="#353735" stroke-width="1.25" stroke-miterlimit="10" stroke-linecap="round"></path><path d="M12.0416 9.125C12.0416 11.0808 10.4558 12.875 8.49998 12.875C6.54415 12.875 4.95831 11.0808 4.95831 9.125C6.62498 9.125 9.95831 9.125 12.0416 9.125Z" stroke="#353735" stroke-width="1.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            </div>

                            {showEmojiPicker && (
                                <div ref={modalRef} className="absolute bottom-[38px] right-[0px] z-10">
                                    <EmojiPicker onEmojiClick={handleEmojiClick} previewConfig={{ showPreview: false }} skinTonesDisabled={true} />
                                </div>
                            )}
                        </div>
                    )}




                </div>
            )}

            {previewFiles.length > 0 && (
                <div className="flex gap-4 mt-8 flex-wrap w-[80%] mx-auto  justify-between">


                    <div className='flex gap-3 items-center  '>
                        {previewFiles.map((file, idx) => {
                            const type = getFileType(file.type, file.name);
                            return (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedIndex(idx)}
                                    className={`cursor-pointer border-2 rounded-md ${idx === selectedIndex ? 'border-green-600' : 'border-gray-100'}`}
                                >
                                    {type === 'image' && (
                                        <img src={file.url} alt={file.name} className="h-12 w-12 object-contain rounded" />
                                    )}
                                    {type === 'video' && (
                                        <div className="h-12 w-12 bg-black text-white text-xs flex items-center justify-center rounded">
                                            🎥 Video
                                        </div>
                                    )}
                                    {type === 'audio' && (
                                        <div className="h-12 w-12 bg-gray-700 text-white text-xs flex items-center justify-center rounded">
                                            🔊 Audio
                                        </div>
                                    )}
                                    {type === 'document' && (
                                        <div className="h-12 w-12 bg-gray-100 text-white text-[10px] flex items-center justify-center rounded">
                                            <svg width="25" height="25" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="preview__file"><path d="M7.5 7.5H10.8333M7.5 12.5H10M7.5 10H12.5" stroke="#666666" stroke-width="1.25" stroke-linecap="round"></path><path d="M2.79406 7.45869C3.33698 5.14417 5.14417 3.33698 7.45869 2.79406C9.13021 2.40198 10.8698 2.40198 12.5413 2.79406C14.8558 3.33698 16.663 5.14418 17.2059 7.4587C17.598 9.13021 17.598 10.8698 17.2059 12.5413C16.663 14.8558 14.8558 16.663 12.5413 17.2059C10.8698 17.598 9.13021 17.598 7.4587 17.2059C5.14418 16.663 3.33698 14.8558 2.79406 12.5413C2.40198 10.8698 2.40198 9.13021 2.79406 7.45869Z" stroke="#666666" stroke-width="1.25"></path></svg>
                                        </div>
                                    )}
                                    {/* {type === 'document' && (
                                        <div className="h-12 w-12 bg-green-500 text-white text-xs flex items-center justify-center rounded">
                                            📄 Text
                                        </div>
                                    )} */}
                                    {(type === 'office' || type === 'unknown') && (
                                        <div className="h-12 w-12 bg-gray-300 text-xs flex items-center justify-center rounded">
                                            📁 {file.name.split('.').pop()}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        <div
                            className="h-12 w-12 bg-gray-100 text-2xl font-bold flex items-center justify-center rounded cursor-pointer"
                            onClick={handleAddMoreClick}
                        >
                            <i className="fa-solid fa-plus"></i>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleAddMoreFiles}
                            multiple
                            accept={getAcceptTypes()}
                        />

                    </div>


                    <div>
                        <button className=" cursor-pointer p-3 bg-green-600 hover:bg-green-700 rounded-full text-white flex items-center justify-center" onClick={handleSubmit}>
                            <svg
                                className="w-6 h-6"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" />
                            </svg>
                        </button>
                    </div>


                </div>
            )}
        </div>
    );
}

export default FilePreview;

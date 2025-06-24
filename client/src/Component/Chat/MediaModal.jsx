import React, { useRef, useState } from 'react'
import FilePreview from './FilePreview';











function MediaModal({ onClose, selectedUser }) {

    const [selectedMediaType, setSelectedMediaType] = useState('Images');
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState([]);







    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = e.dataTransfer.files;
        setFiles(droppedFiles);

    };



    const getAcceptedFileTypes = () => {
        switch (selectedMediaType) {
            case 'Images':
                return '.jpg,.jpeg,.png';
            case 'Videos':
                return '.mp4,.3gp, .mp3';
            case 'Documents':
                return '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt';
            case 'Audio':
                return '.mp3,.aac, .m4a,.wav';
            default:
                return '';
        }
    };




    const handleClose = () => {

        onClose();
    }

    const fileInputRef = useRef(null);

    const handleBrowseClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        setFiles((files));

    };





    return (
        <>
            <div className='fixed inset-0  bg-black/70   z-50 flex items-center justify-center'>


                {files.length <= 0 && (
                    <div className=' bg-white rounded-lg  border border-gray-200 min-w-[300px] max-w-[800px] flex  '>


                        <div className='bg-gray-100 text-sm flex-[30%] rounded-lg font-semibold text-gray-600 w-[800px] '>
                            <ul className=''>
                                <li className={`p-4 cursor-pointer hover:bg-green-100 rounded-tl-lg flex items-center gap-2 ${selectedMediaType == 'Images' ? 'bg-green-100' : ""}`} onClick={() => setSelectedMediaType('Images')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" className=""><path d="M6.10413 11.25H14.6666L12.0208 7.4375L9.68746 10.625L8.06246 8.60417L6.10413 11.25ZM4.52079 15.1458C4.11297 15.1458 3.75755 14.9921 3.45452 14.6846C3.15148 14.3772 2.99996 14.024 2.99996 13.625V1.875C2.99996 1.47604 3.15148 1.12283 3.45452 0.815374C3.75755 0.507902 4.11297 0.354166 4.52079 0.354166H16.2708C16.6698 0.354166 17.023 0.507902 17.3304 0.815374C17.6379 1.12283 17.7916 1.47604 17.7916 1.875V13.625C17.7916 14.024 17.6379 14.3772 17.3304 14.6846C17.023 14.9921 16.6698 15.1458 16.2708 15.1458H4.52079ZM4.52079 13.625H16.2708V1.875H4.52079V13.625ZM1.74996 17.9167C1.34214 17.9167 0.986716 17.7629 0.683688 17.4555C0.380647 17.148 0.229126 16.7948 0.229126 16.3958V3.125H1.74996V16.3958H15.0208V17.9167H1.74996Z" fill="#666666"></path></svg>
                                    Images</li>
                                <li className={`p-4  cursor-pointer hover:bg-green-100  flex items-center gap-2  ${selectedMediaType == 'Videos' ? 'bg-green-100' : ''}`} onClick={() => setSelectedMediaType('Videos')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M7.62496 11.9583L13.4583 8.20833L7.62496 4.45833V11.9583ZM4.52079 15.6458C4.11297 15.6458 3.75755 15.4921 3.45452 15.1846C3.15148 14.8772 2.99996 14.524 2.99996 14.125V2.375C2.99996 1.97604 3.15148 1.62283 3.45452 1.31537C3.75755 1.0079 4.11297 0.854166 4.52079 0.854166H16.2708C16.6698 0.854166 17.023 1.0079 17.3304 1.31537C17.6379 1.62283 17.7916 1.97604 17.7916 2.375V14.125C17.7916 14.524 17.6379 14.8772 17.3304 15.1846C17.023 15.4921 16.6698 15.6458 16.2708 15.6458H4.52079ZM4.52079 14.125H16.2708V2.375H4.52079V14.125ZM1.74996 18.4167C1.34214 18.4167 0.986716 18.2629 0.683688 17.9555C0.380647 17.648 0.229126 17.2948 0.229126 16.8958V3.625H1.74996V16.8958H15.0208V18.4167H1.74996Z" fill="#666666"></path></svg>
                                    Videos</li>
                                <li className={`p-4 cursor-pointer hover:bg-green-100  flex items-center gap-2 ${selectedMediaType == 'Documents' ? 'bg-green-100' : ''}`} onClick={() => setSelectedMediaType('Documents')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" class=""><path d="M5.95829 10.5625H6.79163V8.8125H7.74996C7.9819 8.8125 8.18225 8.73073 8.351 8.56718C8.51975 8.40364 8.60413 8.20764 8.60413 7.97916V7.04166C8.60413 6.80972 8.51975 6.60937 8.351 6.44062C8.18225 6.27187 7.9819 6.1875 7.74996 6.1875H5.95829V10.5625ZM6.79163 7.97916V7.04166H7.74996V7.97916H6.79163ZM9.49996 10.5625H11.2609C11.4897 10.5625 11.6909 10.4826 11.8645 10.3229C12.0382 10.1632 12.125 9.96528 12.125 9.72916V7.04166C12.125 6.80972 12.0372 6.60937 11.8617 6.44062C11.6862 6.27187 11.4892 6.1875 11.2708 6.1875H9.49996V10.5625ZM10.3333 9.72916V7.04166H11.2708V9.72916H10.3333ZM13.0833 10.5625H13.9166V8.8125H14.875V7.97916H13.9166V7.04166H14.875V6.1875H13.0833V10.5625ZM4.52079 15.6458C4.11297 15.6458 3.75755 15.4921 3.45452 15.1846C3.15148 14.8772 2.99996 14.524 2.99996 14.125V2.375C2.99996 1.97604 3.15148 1.62283 3.45452 1.31537C3.75755 1.0079 4.11297 0.854164 4.52079 0.854164H16.2708C16.6698 0.854164 17.023 1.0079 17.3304 1.31537C17.6379 1.62283 17.7916 1.97604 17.7916 2.375V14.125C17.7916 14.524 17.6379 14.8772 17.3304 15.1846C17.023 15.4921 16.6698 15.6458 16.2708 15.6458H4.52079ZM4.52079 14.125H16.2708V2.375H4.52079V14.125ZM1.74996 18.4167C1.34214 18.4167 0.986716 18.2629 0.683688 17.9555C0.380647 17.648 0.229126 17.2948 0.229126 16.8958V3.625H1.74996V16.8958H15.0208V18.4167H1.74996Z" fill="#666666"></path></svg>
                                    Documents</li>
                                <li className={`p-4 cursor-pointer hover:bg-green-100  flex items-center gap-2 ${selectedMediaType == 'Audio' ? 'bg-green-100' : ''}`} onClick={() => setSelectedMediaType('Audio')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" class=""><path d="M9.21006 12.7292C9.80611 12.7292 10.3229 12.5177 10.7604 12.0948C11.1979 11.6719 11.4166 11.1542 11.4166 10.5417V5.3125H13.9375V3.91666H10.5208V8.83333C10.3492 8.70833 10.1463 8.61111 9.91183 8.54166C9.6774 8.47222 9.43962 8.4375 9.19848 8.4375C8.60863 8.4375 8.11558 8.64172 7.71933 9.05016C7.32308 9.45862 7.12496 9.95862 7.12496 10.5502C7.12496 11.1417 7.32326 11.6528 7.71986 12.0833C8.11644 12.5139 8.61317 12.7292 9.21006 12.7292ZM4.52079 15.6458C4.11297 15.6458 3.75755 15.4921 3.45452 15.1846C3.15148 14.8772 2.99996 14.524 2.99996 14.125V2.375C2.99996 1.97604 3.15148 1.62283 3.45452 1.31537C3.75755 1.0079 4.11297 0.854164 4.52079 0.854164H16.2708C16.6698 0.854164 17.023 1.0079 17.3304 1.31537C17.6379 1.62283 17.7916 1.97604 17.7916 2.375V14.125C17.7916 14.524 17.6379 14.8772 17.3304 15.1846C17.023 15.4921 16.6698 15.6458 16.2708 15.6458H4.52079ZM4.52079 14.125H16.2708V2.375H4.52079V14.125ZM1.74996 18.4167C1.34214 18.4167 0.986716 18.2629 0.683688 17.9555C0.380647 17.648 0.229126 17.2948 0.229126 16.8958V3.625H1.74996V16.8958H15.0208V18.4167H1.74996Z" fill="#666666"></path></svg>
                                    Audio</li>

                            </ul>
                        </div>


                        <div className='flex-[70%] p-4 relative'
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}>
                            <i
                                className='fa-solid fa-xmark text-2xl cursor-pointer hover:scale-110 text-red-600 absolute top-2 right-2'
                                onClick={handleClose}
                            ></i>



                            <div className='flex flex-col items-center justify-center h-full py-14'>

                                <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72" fill="none"><path d="M19.0789 58.125C15.0827 58.125 11.6913 56.7458 8.9048 53.9875C6.11825 51.2291 4.72498 47.8544 4.72498 43.8635C4.72498 40.2126 5.99708 37.0008 8.54128 34.2282C11.0855 31.4556 14.0884 29.9442 17.55 29.6942C18.2884 25.1288 20.4137 21.3538 23.9259 18.3692C27.4381 15.3846 31.4936 13.8923 36.0923 13.8923C41.172 13.8923 45.4659 15.6513 48.9742 19.1691C52.4824 22.687 54.3865 26.9665 54.6865 32.0077V35.8846H56.5326C59.5788 35.9961 62.1307 37.0865 64.1884 39.1558C66.2461 41.225 67.275 43.8192 67.275 46.9385C67.275 50.0263 66.2018 52.6627 64.0553 54.8476C61.9088 57.0325 59.2917 58.125 56.2039 58.125H39.525C38.104 58.125 36.8939 57.6175 35.8948 56.6024C34.8957 55.5874 34.3961 54.3853 34.3961 52.9962V34.8116L27.7961 41.3942L25.4538 39.1097L36 28.5635L46.6212 39.1097L44.2789 41.3942L37.6789 34.8116V52.9962C37.6789 53.4577 37.8712 53.8808 38.2558 54.2654C38.6404 54.65 39.0634 54.8423 39.525 54.8423H56.0524C58.2495 54.8423 60.1221 54.0599 61.6702 52.4951C63.2183 50.9303 63.9923 49.0846 63.9923 46.958C63.9923 44.8269 63.2136 42.9806 61.6562 41.419C60.0989 39.8573 58.2382 39.0765 56.0743 39.0765H51.3838V32.9393C51.3838 28.6306 49.8849 24.926 46.8874 21.8256C43.8897 18.7252 40.2318 17.175 35.9137 17.175C31.5957 17.175 27.9357 18.7239 24.9337 21.8216C21.9317 24.9193 20.4307 28.6205 20.4307 32.9254H18.8276C15.9083 32.9254 13.3751 33.975 11.2282 36.0742C9.08115 38.1734 8.00765 40.7926 8.00765 43.9319C8.00765 46.9467 9.07805 49.5188 11.2189 51.6482C13.3597 53.7776 15.9797 54.8423 19.0789 54.8423H27.5884V58.125H19.0789Z" fill="#07B723"></path></svg>

                                <h2 className='text-lg font-bold mt-2'>Drop and Drag Files Here</h2>

                                <p className='text-sm mt-2 text-gray-600'>
                                    {selectedMediaType == "Images" && ("(Supported file types are jpeg and png). ")}
                                    {selectedMediaType == "Videos" && ("(Supported file types are mp4 and 3gp). ")}
                                    {selectedMediaType == "Documents" && ("(Supported file types are pdf, word, powerpoint and others). ")}
                                    {selectedMediaType == "Audio" && ("(Supported file types are aac, mp4, mpeg and others). ")}

                                </p>

                                <p className='text-sm mt-4 text-gray-600'>-Or-</p>



                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept={getAcceptedFileTypes()}
                                    multiple
                                    style={{ display: 'none' }}
                                />


                                <button type="button" className=" cursor-pointer hover:bg-green-50 mt-4 py-2 px-4 border rounded-md border-green-600 text-green-600" onClick={handleBrowseClick}>Browse Files</button>
                            </div>

                        </div>



                    </div>
                )}


                {files.length > 0 && (
                    <FilePreview files={files} setFiles={setFiles} onClose={handleClose} selectedUser={selectedUser} />
                )}

            </div>
        </>
    )
}

export default MediaModal
import React, { useEffect, useRef } from 'react'

function DeleteEdgeModel({ open, onClose, onConfirm }) {

    if (!open) return null;
    const nodeRef = useRef(null);
    console.log(onClose);

     const handleClickOutside = (event) => {
    
            console.log(event.target);
            if (nodeRef.current && !nodeRef.current.contains(event.target)) {
                onClose();
            }
        };
    
        useEffect(() => {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, []);

        

    return (
        <>
            <div className="fixed inset-0 bg-black/80 bg-opacity-40 flex items-center justify-center z-50">
                <div ref={nodeRef} className="bg-white rounded-lg p-6 w-80 shadow-lg">
                    <p className="mb-6 font-semibold text-gray-800">Are you sure you want to delete this connection?</p>
                    <div className="flex justify-end gap-4">
                        <button
                            className="px-4 py-1 cursor-pointer bg-gray-200 rounded hover:bg-gray-300"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-1 cursor-pointer bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={onConfirm}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DeleteEdgeModel
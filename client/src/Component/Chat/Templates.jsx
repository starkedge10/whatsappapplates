import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTemplates } from '../../redux/templateThunks.js'
import TemplatePreview from '../Chat/TemplatesPreview.jsx';
import { useNavigate } from 'react-router-dom';


function templates({ onClose, selectedUser }) {

    const [selectedTemplateId, setSelectedTemplateId] = useState(null);
    const modalRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');







    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };


    const dispatch = useDispatch()
    const { templates, loading } = useSelector((state) => state.templates)

    const navigate = useNavigate();


    useEffect(() => {
        if (templates.length === 0) {
            dispatch(fetchTemplates());
        }
    }, []);


    const filteredTemplates = [...templates].reverse().filter((template) => {
        const search = searchTerm.toLowerCase();
        return (
            template.name?.toLowerCase().includes(search) ||
            template.category?.toLowerCase().includes(search)

        );
    });



    return (
        <>

            {!selectedTemplateId && (
                <>
                    <div ref={modalRef}>
                        <div className='flex items-center justify-between border-b pb-2 border-gray-300'>
                            <div className='flex items-center'>
                                <h4 className='font-semibold text-lg'>Choose A Template</h4>
                                <div className="pb-2 p-[10px]">
                                    <input
                                        type="text"
                                        placeholder="Search here..."
                                        className="w-full ml-2 max-w-md px-3 py-1 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className='flex items-center gap-6'>
                                <button type='button ' className='bg-green-600 cursor-pointer text-white  px-2 py-1 rounded-md hover:bg-green-700 transition duration-200' onClick={() => {
                                    navigate("/manageTemplates", { state: { openForm: true } });
                                }}>
                                    Add template
                                </button>

                                <i
                                    className='fa-solid fa-xmark text-2xl cursor-pointer hover:scale-110 text-red-600 ' onClick={() => onClose()}

                                ></i>
                            </div>
                        </div>


                        <div className='mt-4 max-h-[300px] min-h-[100px] overflow-y-auto'>

                            <ul>
                                {loading ? (
                                    <div className='flex items-center justify-center'>
                                        <i className="fa-solid fa-spinner animate-spin text-2xl text-gray-500"></i>
                                    </div>
                                ) : (
                                    filteredTemplates.map((template) => (
                                        <li key={template.id} className='flex items-center justify-between px-2 py-3  hover:bg-green-50 cursor-pointer' onClick={() => setSelectedTemplateId(template)}>
                                            <div className='flex items-center gap-4'>
                                                <h4 className='font-semibold'>{template.name}</h4>
                                            </div>
                                            <p className='text-gray-500 text-sm'>{template.category}</p>
                                        </li>
                                    ))
                                )}
                            </ul>


                        </div>
                    </div>
                </>
            )}



            {selectedTemplateId && (
                <TemplatePreview
                    template={selectedTemplateId}
                    onClose={onClose}
                    onBack={(setSelectedTemplateId)}
                    selectedUser={selectedUser}

                />
            )}
        </>
    )
}

export default templates
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTemplates } from '../../redux/templateThunks.js';
import { deleteTemplate } from '../../redux/templateThunks.js';
import Skeleton from '@mui/material/Skeleton';
import { toast } from 'react-toastify';
import Checkbox from '@mui/material/Checkbox';
import { grey } from '@mui/material/colors';
import { fetchReplyMaterial, fetchTemplateReply, deleteReplyMaterial } from '../../redux/ReplyMaterial/ReplyMaterialThunk.js';
import { addKeyword, updateKeyword } from '../../redux/Keywords/keywordThunk.js';






function Templates({ onClose, Keywords, selectedReplies, setSelectedReplies }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;

    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const { keywords: allKeywords } = useSelector((state) => state.keywords);
    
    const { replyMaterial, templateReplyMaterial: templateReplys } = useSelector((state) => state.replyMaterial);
    const { templates } = useSelector((state) => state.templates);

    const isLoading = loading;

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);

                if (replyMaterial.length === 0) {
                    await dispatch(fetchReplyMaterial()).unwrap();
                }


                await dispatch(fetchTemplateReply()).unwrap();

                if (templates.length === 0) {
                    await dispatch(fetchTemplates()).unwrap();
                }

            } catch (err) {
                console.error("Fetching failed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);


    const languageMap = {
        en: 'English',
        en_US: 'English (US)',
        hi: 'Hindi',
    };




    console.log(templateReplys);


    const filteredTemplates = [...templateReplys]
        .reverse()
        .filter((template) => {
            const search = searchTerm.toLowerCase();
            return (
                template.status !== 'REJECTED' &&
                (
                    template.name?.toLowerCase().includes(search) ||
                    template.content?.materialId?.category?.toLowerCase().includes(search) ||
                    template.content?.materialId?.status?.toLowerCase().includes(search) ||
                    languageMap[template.language]?.toLowerCase().includes(search) ||
                    template.id?.toLowerCase().includes(search) ||
                    template._id?.toLowerCase().includes(search)
                )
            );
        });

    const handleDelete = (e, template) => {
        e.stopPropagation();
        const replyToDelete = template.content.materialId;

        const isUsedInKeywords = allKeywords.some(keyword =>
            keyword.replyMaterial?.some(material => material.name === replyToDelete.name)
        );

        if (isUsedInKeywords) {
            toast.warning("Reply material is in use");
            return;
        }

        dispatch(deleteReplyMaterial(template._id));
        dispatch(deleteTemplate({ id: replyToDelete.id, name: replyToDelete.name }))
            .then(() => dispatch(fetchTemplateReply()));
    };

    const handleTemplateAdd = () => {
        navigate("/manageTemplates", { state: { openForm: true } });
    };


    
    const handleFinalSubmit = () => {
        const updatedKeywords = {
            ...Keywords,
            replyMaterial: selectedReplies,
        };

        if (selectedReplies.length === 0) {
            toast.info("Please select at least one material");
            return;
        }

        const existingKeywordIndex = allKeywords.findIndex((kw) => kw._id === Keywords._id);

        if (existingKeywordIndex !== -1) {
            const id = allKeywords[existingKeywordIndex]._id;
            toast.promise(
                dispatch(updateKeyword({ id, updatedKeyword: updatedKeywords })),
                {
                    pending: 'Updating keywords...',
                    success: 'Keyword updated successfully!',
                    error: {
                        render({ data }) {
                            return typeof data === 'string' ? data : 'Failed to update';
                        }
                    }
                }
            );
        } else {
            toast.promise(
                dispatch(addKeyword(updatedKeywords)),
                {
                    pending: 'Adding keywords...',
                    success: 'Keywords added!',
                    error: 'Failed to add keywords',
                }
            );
        }

        onClose(true);
    };



    return (
        <>


            <div>
                <div className='flex px-4 mt-4 items-center  justify-between'>
                    <div className='flex items-center gap-6'>
                        <form action="" className='min-w-[150px]'>
                            <div className='search-bar w-full flex items-center max-w-[500px]  relative'>

                                <i className="fa-solid fa-magnifying-glass absolute right-4 text-gray-400"></i>
                                <input type="text" className='w-full bg-white rounded-md pl-[10px] pr-[40px] py-[10px] focus:outline-none !font-medium' placeholder='Search here ... ' value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />

                            </div>

                        </form>

                        {path === '/keywordAction' && (
                            <div className="text-gray-500 font-semibold flex items-center flex-wrap gap-2">
                                Selected Material:
                                {selectedReplies?.map((selectedId, i) => {
                                    const reply = replyMaterial.find(r => r._id === selectedId);

                                    if (!reply) return null;

                                    return (
                                        <div
                                            key={i}
                                            className="text-xs border text-nowrap border-[#FF9933] bg-[#FFFAF5] rounded-md p-2 text-[#FF9933] max-w-[150px] overflow-hidden"
                                        >
                                            <span>{reply.replyType}</span>:{" "}
                                            <span className="truncate inline-block overflow-hidden whitespace-nowrap text-ellipsis max-w-[70px] align-bottom">
                                                {reply.name}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}




                    </div>


                    <div className='flex gap-4'>
                        {path == '/keywordAction' && (<>
                            <button type='button ' className='bg-red-50 border border-red-600 cursor-pointer text-red-600  px-4 py-1 rounded-md hover:bg-red-100 transition duration-200' onClick={onClose}>
                                Cancel
                            </button>
                            <button type='button ' className='bg-green-50 border border-green-600 cursor-pointer text-green-600  px-4 py-1 rounded-md hover:bg-green-100 transition duration-200' onClick={handleFinalSubmit}>
                                Save
                            </button></>)}
                        <button type='button ' className='bg-green-600 cursor-pointer text-white  px-4 py-2 rounded-md hover:bg-green-700 transition duration-200' onClick={handleTemplateAdd}>
                            Add
                        </button>
                    </div>
                </div>
            </div>



            <div className='mt-6 px-4'>

                <div className='p-4 bg-white rounded-lg min-h-[70vh] overflow-auto text-gray-600'>

                    <table className='table-auto w-full'>

                        <thead className="text-md">
                            <tr className="sticky top-0 z-10 border-b border-gray-300 bg-white text-center text-nowrap">
                                <th className="px-[10px] pb-4 text-left">Name</th>
                                <th className="px-[10px] pb-4">Category</th>
                                <th className="px-[10px] pb-4">Language</th>
                                <th className="px-[10px] pb-4">Status</th>
                                <th className="px-[10px] pb-4 ">Last Edited</th>
                                <th className="px-[10px] pb-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>


                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, index) => (
                                    <tr key={index}>
                                        <td className="px-[10px] py-4 text-left">
                                            <Skeleton variant="text" animation="wave" width="100%" height={20} />
                                        </td>
                                        <td className="px-[10px]  py-4 text-center">
                                            <Skeleton variant="text" animation="wave" width="50%" className='mx-auto' height={20} />
                                        </td>
                                        <td className="px-[10px] py-4 text-center">
                                            <Skeleton variant="text" animation="wave" width="50%" className='mx-auto' height={20} />
                                        </td>
                                        <td className="px-[10px] py-4 text-center">
                                            <Skeleton variant="rectangular" animation="wave" width="50%" className='mx-auto' height={20} />
                                        </td>
                                        <td className="px-[10px] py-4 text-center">
                                            <Skeleton variant="text" animation="wave" width="30%" className='mx-auto' height={20} />
                                        </td>

                                        <td className="px-[10px] py-4 text-right">
                                            <Skeleton variant="text" animation="wave" width="30%" className='float-right' height={20} />
                                        </td>
                                    </tr>
                                ))
                            ) :



                                (filteredTemplates.map((reply) => (
                                    <tr key={reply._id} className="text-center hover:bg-green-50 font-semibold cursor-pointer text-sm">
                                        <td className="px-[10px] py-4 text-left text-blue-600 flex gap-2 items-center">
                                            {path === '/keywordAction' && (
                                                <Checkbox
                                                    color="success"
                                                    checked={selectedReplies.some(item => item === reply._id)}
                                                    onChange={(e) => {
                                                        const isChecked = e.target.checked;
                                                        const currentReply = reply;


                                                        if (isChecked) {
                                                            setSelectedReplies(prev => [...prev, currentReply._id]);

                                                        } else {
                                                            setSelectedReplies(prev => prev.filter(item => item !== currentReply._id));
                                                        }
                                                    }}

                                                    sx={{
                                                        padding: 0,
                                                        '& svg': {
                                                            fontSize: 28,
                                                        },
                                                        color: grey[500],
                                                    }}
                                                />

                                            )}
                                            {reply.name}
                                        </td>

                                        <td className="px-[10px]  py-4 text-center">{reply.content?.materialId.category}</td>
                                        <td className="px-[10px] py-4 text-center">{languageMap[reply.content?.materialId.language] || reply.content?.materialId.language}</td>
                                        <td className="px-[10px] py-4 text-center"> <span
                                            className={`rounded-2xl py-1 text-white text-center w-[95px] inline-block
                                                ${reply.content.materialId.status === 'APPROVED'
                                                    ? 'bg-green-100 !text-green-700'
                                                    : reply.content.materialId.status === 'PENDING'
                                                        ? 'bg-orange-100 !text-orange-500'
                                                        : 'bg-red-100 !text-red-700'
                                                }`}
                                        >
                                            {reply.content.materialId.status}
                                        </span></td>
                                        <td className="px-[10px] py-3 text-gray-400 italic ">

                                            {reply.content?.materialId?.createdAt
                                                ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
                                                    new Date(reply.content?.materialId?.createdAt)
                                                )
                                                : 'N/A'}

                                        </td>
                                        <td className="px-[10px] py-4 text-right">
                                            <button className='text-blue-500 hover:text-blue-700'>Edit</button>
                                            <i
                                                className="fa-solid fa-trash text-red-400 bg-white ml-2 p-2 rounded-full text-lg cursor-pointer hover:scale-105"
                                                onClick={(e) => handleDelete(e, reply)}
                                            />
                                        </td>
                                    </tr>
                                )))}
                        </tbody>

                    </table>

                </div>

            </div>


        </>
    )
}

export default Templates
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTemplates, deleteTemplate, } from '../redux/templateThunks.js';
import { toast } from 'react-toastify';
import Skeleton from '@mui/material/Skeleton';

import { fetchKeywords } from '../redux/Keywords/keywordThunk';
import { fetchReplyMaterial, deleteReplyMaterial } from '../redux/ReplyMaterial/ReplyMaterialThunk.js';





function MessageTemplateList({ onSuccess, onSelectTemplateId, selectedTemplateId }) {
  const dispatch = useDispatch();

  const [limit, setLimit] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');




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




  const { templates, loading, deleteStatus } = useSelector((state) => state.templates);


  useEffect(() => {

    if (templates.length === 0) {
      dispatch(fetchTemplates());
    }

  }, []);



  console.log(templates);




  useEffect(() => {
    setCurrentPage(1);
  }, [limit, searchTerm]);

  const languageMap = {
    en: 'English',
    en_US: 'English (US)',
    hi: 'Hindi',
  };

  const filteredTemplates = [...templates].reverse().filter((template) => {
    const search = searchTerm.toLowerCase();
    return (
      template.name?.toLowerCase().includes(search) ||
      template.category?.toLowerCase().includes(search) ||
      template.status?.toLowerCase().includes(search) ||
      languageMap[template.language]?.toLowerCase().includes(search) ||
      template.id?.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(filteredTemplates.length / limit);
  const currentData = filteredTemplates.slice((currentPage - 1) * limit, currentPage * limit);

  const handleNext = () => currentPage < totalPages && setCurrentPage((prev) => prev + 1);
  const handlePrev = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);




  useEffect(() => {
    if (deleteStatus === 'success') {
      onSelectTemplateId(null);
    }
  }, [deleteStatus]);




  const handleDelete = (e, template) => {
    e.stopPropagation();


    const replyMaterialToDelete = replyMaterial
      .filter(reply => reply.content.materialId === template._id)

      console.log(replyMaterialToDelete);
      console.log(replyMaterial)





    const isUsedInKeywords = keywords.some(keyword =>
      keyword.replyMaterial.some(material => material.name === template.name)
    );


    if (isUsedInKeywords) {
      toast.warning("Reply material is in use");
      return;
    }


    dispatch(deleteTemplate({ id: template.id, name: template.name }))
      .then(() => {
        if (replyMaterialToDelete.length > 0) {
          dispatch(deleteReplyMaterial(replyMaterialToDelete[0]._id));

        }

      });
  };


  const handleEdit = (e, template) => {
    e.stopPropagation();
    onSuccess(template);
  };



  return (
    <div className="mt-[30px] rounded-md h-[calc(100vh-210px)]  flex flex-col text-gray-600 justify-between">
      <div>
        <div className="pb-2 p-[10px]">
          <input
            type="text"
            placeholder="Search by name, category, status, ID, or language..."
            className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-auto max-h-[64vh] mt-4">
          <table className="table-auto w-full">
            <thead className="text-lg">
              <tr className="sticky top-0 z-10 border-b border-gray-300 bg-white text-center text-nowrap">
                <th className="px-[10px] pb-4 text-left">Name</th>
                <th className="px-[10px] pb-4">Category</th>
                <th className="px-[10px] pb-4">Language</th>
                <th className="px-[10px] pb-4">Status</th>
                <th className="px-[10px] pb-4 text-right">Last Edited</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
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
                    <td className="px-[10px] py-4 text-right">
                      <Skeleton variant="text" animation="wave" width="30%" className='float-right' height={20} />
                    </td>
                  </tr>
                ))
              ) : (
                currentData.map((template) => (
                  <tr
                    key={template.id}
                    onClick={() => { onSelectTemplateId?.(template.id); }}
                    className={`group text-nowrap text-center hover:bg-green-50 font-semibold cursor-pointer text-sm ${selectedTemplateId === template.id ? 'bg-green-50' : ''
                      }`}
                  >
                    <td className="px-[10px] py-4 text-left text-blue-500 cursor-pointer hover:underline" onClick={(e) => handleEdit(e, template)}>{template.name}</td>
                    <td className="px-[10px] py-4">{template.category}</td>
                    <td className="px-[10px] py-4">{languageMap[template.language] || template.language}</td>
                    <td className="px-[10px] py-4">
                      <span
                        className={`rounded-2xl py-1 text-white text-center w-[95px] inline-block
                          ${template.status === 'APPROVED'
                            ? 'bg-green-100 !text-green-700'
                            : template.status === 'PENDING'
                              ? 'bg-orange-100 !text-orange-500'
                              : 'bg-red-100 !text-red-700'
                          }`}
                      >
                        {template.status}
                      </span>
                    </td>
                    <td className="px-[10px] py-3 text-gray-400 italic relative text-right">
                      <span
                        className={`group-hover:hidden ${selectedTemplateId === template.id ? 'hidden' : 'text-nowrap'
                          }`}
                      >
                        {template.createdAt
                          ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
                            new Date(template.createdAt)
                          )
                          : 'N/A'}
                      </span>
                      <div
                        className={`absolute px-[10px] top-1/2 left-0 right-0 transform -translate-y-1/2 gap-6 justify-end items-center ${selectedTemplateId === template.id ? 'flex' : 'hidden group-hover:flex'
                          }`}
                      >
                        <i
                          className="fa-solid fa-pen-to-square text-blue-500 bg-white p-2 rounded-full text-lg cursor-pointer hover:scale-105"
                          onClick={(e) => handleEdit(e, template)}
                        />
                        <i
                          className="fa-solid fa-trash text-red-400 bg-white p-2 rounded-full text-lg cursor-pointer hover:scale-105"
                          onClick={(e) => handleDelete(e, template)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-1 px-[10px] py-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <span>Items per page:</span>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border cursor-pointer px-2 py-1 rounded"
          >
            {[2, 3, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={handlePrev} disabled={currentPage === 1}>
            <i
              className={`fas fa-angle-left text-lg ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 cursor-pointer'
                }`}
            />
          </button>
          <button onClick={handleNext} disabled={currentPage === totalPages}>
            <i
              className={`fas fa-angle-right text-lg ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 cursor-pointer'
                }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageTemplateList;

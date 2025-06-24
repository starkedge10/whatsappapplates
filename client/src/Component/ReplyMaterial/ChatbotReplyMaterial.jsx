import React, { useEffect, useState } from 'react'
import Checkbox from '@mui/material/Checkbox';
import { grey } from '@mui/material/colors';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
// import { removeChatbot } from '../../redux/Chatbot/ChatbotSlice..js';
import { toast } from 'react-toastify';
// import { addKeyword } from '../../redux/Keywords/keywordsSlice.js';
// import { updateKeyword } from '..//../redux/Keywords/keywordsSlice.js'
import { addKeyword, updateKeyword } from '../../redux/Keywords/keywordThunk.js';
import { deleteChatbot, } from '../../redux/Chatbot/chatbotsThunk.js';
import { fetchReplyMaterial, fetchChatbotReply, deleteReplyMaterial } from '../../redux/ReplyMaterial/ReplyMaterialThunk.js';



function ChatbotReplyMaterial({ onClose, Keywords, selectedReplies, setSelectedReplies }) {



  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);


  const Chatbots = useSelector((state) => state.chatbots.chatbots)

  const location = useLocation();
  const path = location.pathname;

  const { keywords: allKeywords } = useSelector((state) => state.keywords);

  const { replyMaterial, chatbotReplyMaterial: chatbotReplys } = useSelector((state) => state.replyMaterial);

  const isLoading = loading;


  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        if (replyMaterial.length === 0) {
          await dispatch(fetchReplyMaterial()).unwrap();
        }


        await dispatch(fetchChatbotReply()).unwrap();

        if (chatbotReplys.length === 0) {
          await dispatch(fetchChatbotReply()).unwrap();
        }

      } catch (err) {
        console.error("Fetching failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);



  const filteredChatbots = [...chatbotReplys].reverse().filter((chatbot) => {
    console.log(chatbot);
    const search = searchTerm.toLowerCase();
    return (
      chatbot.name.toLowerCase().includes(search) ||
      chatbot.content?.materialId?.triggered.toString().includes(search) ||
      chatbot.content?.materialId?.finished.toString().includes(search) ||
      chatbot.content?.materialId?.lastUpdated.toString().includes(search)
    )
  });

  const handleTemplateAdd = () => {
    navigate("/chatbot");
  }


  const handleEdit = (chatbotId) => {
    navigate('/chatbot/flowbuilder', { state: { chatbotId } });
  };


  const handleDelete = (chatbot) => {
    const replyToDelete = chatbot.content.materialId
    console.log(replyToDelete);


    const isUsedInKeywords = allKeywords.some(keyword =>
      keyword.replyMaterial?.some(material => material.name === replyToDelete.name)
    );

    if (isUsedInKeywords) {
      toast.warning("Reply material is in use");
      return;
    }

    toast.promise(
      dispatch(deleteReplyMaterial(chatbot._id)),
      {
        pending: 'Deleting reply material...',
        success: 'Reply material deleted successfully!',
        error: 'Failed to delete reply material',
      }
    );


    dispatch(deleteChatbot(replyToDelete._id,))
      .then(() => dispatch(fetchChatbotReply()));


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
    console.log(existingKeywordIndex);

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
              <button type='button ' className='bg-red-50 border border-red-600 cursor-pointer text-red-600  px-4 py-1 rounded-md hover:bg-red-100 transition duration-200' onClick={onClose} >
                Cancel
              </button>
              <button type='button ' className='bg-green-50 border border-green-600 cursor-pointer text-green-600  px-4 py-1 rounded-md hover:bg-green-100 transition duration-200' onClick={handleFinalSubmit} >
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
          <table className='table-auto w-full   '>
            <thead className='text-md '>
              <tr className="sticky top-0 z-10 border-b border-gray-300 bg-white text-center text-nowrap">
                <th className="py-6 pr-22 text-left font-semibold">Name</th>
                <th className='py-6 pr-22 text-center font-semibold'>Triggered</th>
                <th className='py-6 pr-22 text-center font-semibold'>Finished</th>
                <th className='py-6 pr-22 text-center font-semibold'>Last Updated</th>
                <th className='py-6 text-right font-semibold'>Actions</th>
              </tr>
            </thead>

            <tbody className=' font-semibold '>
              {filteredChatbots.length > 0 ? (
                filteredChatbots.map((chatbot) => (
                  <tr key={chatbot._id} className=' text-center '>
                    <td className='px-[0px] py-4 text-left text-blue-600 flex gap-2 items-center'>
                      {path === '/keywordAction' && (
                        <Checkbox
                          color="success"
                          checked={selectedReplies.some(item => item === chatbot._id)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            const currentReply = chatbot;


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
                      <div className='cursor-pointer hover:underline' onClick={() => handleEdit(chatbot._id)}>{chatbot.name}</div>
                    </td>

                    <td className='py-4 pr-22'>{chatbot.content.materialId?.triggered}</td>
                    <td className='py-4 pr-22'>{chatbot.content.materialId?.finished}</td>
                    <td className='py-4 pr-22'>
                      {chatbot.content.materialId?.lastUpdated
                        ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', }).format(new Date(chatbot.content.materialId?.lastUpdated))
                        : 'N/A'}
                    </td>




                    <td className='py-4 text-right'>
                      <div className='flex gap-4 justify-end'>
                        <i className="fa-solid fa-pen-to-square bg-gray-100 p-2 rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-100 cursor-pointer" onClick={() => handleEdit(chatbot.content.materialId._id)} ></i>
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
      </div>
    </>
  )
}

export default ChatbotReplyMaterial
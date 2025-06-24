import React, { useEffect, useRef, useState } from 'react'
import ChatbotList from '../ChatbotComponents/ChatbotList.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import { addChatbot } from '../../redux/Chatbot/chatbotsThunk.js';



function Chatbot() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [popUp, setPopUp] = useState(false);

  const [chatbot, setChatbot] = useState({
    name: '',
    triggered: 0,
    finished: 0,
    lastUpdated: new Date().toISOString(),
    flow: {
      nodes: [],
      edges: [],
    }
  })

  const [searchTerm, setSearchTerm] = useState('');
  const [showFlowbuilder, setShowFlowbuilder] = useState(false);

  const chatbots = useSelector(state => state.chatbots.chatbots);

  const handleClose = () => {
    setPopUp(false);
    setChatbot({
      name: '',
      triggered: 0,
      finished: 0,
      lastUpdated: new Date().toISOString(),
    })

  }


  const formRef = useRef(null);

  const handleClickOutside = (event) => {

    if (formRef.current && !formRef.current.contains(event.target)) {
      setPopUp(false);
    }
  };


  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  const handleSubmit = async(e) => {
    e.preventDefault();

    const newChatbot = {
      ...chatbot,
      lastUpdated: new Date().toISOString()
    };

    const exists = chatbots.some(bot => bot.name === newChatbot.name);

    if (exists) {
      toast.error('Chatbot with this name already exists!');
      return;
    }

    const res = await dispatch(addChatbot(newChatbot));
    console.log(res.payload._id);

    setPopUp(false);

    navigate('/chatbot/flowbuilder', {
      state: {
        chatbotId: res.payload._id,
      },
    });
  };

  const handleFlowChange = (updatedFlow) => {
    setChatbot(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString(),
      flow: {
        ...prev.flow,
        ...updatedFlow,
      },
    }));
  };





  return (
    <>

      {showFlowbuilder === false && (
        <>
          <div className='p-6 py-[23px]  mb-[4px] bg-gray-100 flex items-center text-gray-600 justify-between'>
            <div className='flex items-center gap-12'>
              <div>
                <h2 className='text-3xl font-semibold'>Chatbots</h2>
                <p className='text-xs mt-2 font-semibold text-gray-600'><span className='font-semibold text-sm text-gray-600'>Note: </span>Select a chatbot below and make it your own by customising it.
                </p>
              </div>

              <div>
                <form action="" className=''>
                  <div className='search-bar w-full flex items-center max-w-[500px] relative'>

                    <i className="fa-solid fa-magnifying-glass absolute right-4 text-gray-400"></i>
                    <input type="text" required className='w-full bg-white rounded-md pl-[10px] pr-[40px] py-[10px] focus:outline-none !font-medium' placeholder='Search here ... '
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />

                  </div>
                </form>
              </div>
            </div>

            <div>
              <button type='button ' className='bg-green-600 cursor-pointer text-white text-lg px-4 py-2 rounded-md hover:bg-green-700 transition duration-200' onClick={() => { setPopUp(true) }}>
                Add Chatbot
              </button>
            </div>




            {popUp && (
              <div className='fixed inset-0 bg-black/70 z-50 flex items-center justify-center'>
                <div ref={formRef} className='p-4 bg-white rounded-lg shadow-lg border border-gray-20 min-w-[330px]'>

                  <div className='flex justify-between items-center border-b border-gray-300 pb-2'>
                    <h4 className='font-semibold text-gray-800 text-lg'>Add Chatbot</h4>
                    <i className="fa-solid fa-xmark text-xl cursor-pointer hover:scale-110 text-red-600" onClick={handleClose}></i>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <h5 className='font-semibold text-sm mt-6'>Chatbot Name</h5>

                    <input required type="text" className='w-full text-sm bg-gray-100 px-2 py-2 mt-1 rounded-md focus:outline-none ' placeholder='Please input a chatbot name' value={chatbot.name} onChange={(e) => setChatbot({ ...chatbot, name: e.target.value })} />


                    <button className='bg-green-600 text-sm hover:bg-green-700 rounded-lg px-2 py-2 text-white mt-8 float-end cursor-pointer' >
                      Add Chatbot
                    </button>

                  </form>
                </div>

              </div>
            )}


          </div>

          <ChatbotList onSearch={searchTerm} />
        </>

      )}


    </>
  )
}

export default Chatbot
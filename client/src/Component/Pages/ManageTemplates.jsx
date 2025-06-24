import React, { useEffect, useState } from 'react';
import MessageTemplateList from '../MessageTemplateList.jsx';
import CreateTemplate from '../CreateTemplarte.jsx';
import TemplatePreview from '../TemplatePreview.jsx';
import { useLocation } from 'react-router-dom';

function ManageTemplates() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [liveTemplateData, setLiveTemplateData] = useState({});
  const location = useLocation();




  const handleFormModel = () => {
    if (isOpen) {

      setLiveTemplateData(null);
      setEditingTemplate(null);
      setSelectedTemplateId(null);
    }
    setIsOpen(!isOpen);
  };

  const handleEdit = (template) => {

    setEditingTemplate(template);
    setIsOpen(true);
  };



  useEffect(() => {
    if (location.state?.openForm) {
      setIsOpen(true);
    }
  }, [location.state]);


  return (
    <div className='bg-gray-100 px-[10px] py-[10px] '>
      <div className='flex justify-between gap-[10px] items-stretch'>
        <div className='bg-white p-[15px]  rounded-md flex-[66%] '>
          <div className='flex mt-4 p-[10px] justify-between items-center'>
            <h2 className='font-bold text-xl'>Message Templates</h2>
            {!isOpen && (
              <button
                type='button'
                className='bg-green-600 hover:bg-green-700 cursor-pointer  text-white font-semibold py-[5px] px-[12px] rounded'
                onClick={handleFormModel}
              >
                Create Template
              </button>
            )}
            {isOpen && (
              <button
                type='button'
                className='bg-red-500 hover:bg-red-600 cursor-pointer text-white font-semibold py-[5px] px-[12px] rounded-md'
                onClick={handleFormModel}
              >
                Close
              </button>
            )}
          </div>

          {isOpen && (
            <CreateTemplate templateData={editingTemplate} onSuccess={() => setIsOpen(false)} onTemplateChange={setLiveTemplateData} />
          )}

          {!isOpen && (
            <MessageTemplateList
              onSuccess={handleEdit}
              onSelectTemplateId={setSelectedTemplateId}
              selectedTemplateId={selectedTemplateId}
            />
          )}
        </div>



        {/* Template Preview */}
        <div className='bg-white p-[15px] rounded-md flex-[33%] '>
          <h2 className='font-bold text-xl mt-4'>Your Template</h2>
          <p className='font-semibold text-md mt-[5px] text-gray-600'>
            Here you can see the selected message content body
          </p>


          <TemplatePreview templateId={selectedTemplateId} liveTemplateData={liveTemplateData} />

        </div>
      </div>
    </div>
  );
}

export default ManageTemplates;

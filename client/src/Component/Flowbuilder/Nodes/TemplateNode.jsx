import React from 'react'
import { Handle, Position } from 'reactflow';




function TemplateNode({ data }) {
  console.log(data);

  const template = data?.content?.template || {};


  const header = template?.components?.find((comp) => comp.type === 'HEADER');
  const body = template?.components?.find((comp) => comp.type === 'BODY');
  const footer = template?.components?.find((comp) => comp.type === 'FOOTER');
  const buttonComponent = template?.components?.find((comp) => comp.type === 'BUTTONS');
  const buttons = buttonComponent?.buttons || [];

  const renderTextWithNewlines = (text) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  console.log(template);



  return (
    <>
      {template && (
        <div className=' p-2 bg-white max-w-[300px] min-w-[300px] rounded-md'>

          {header && header.format === 'TEXT' && (
            <h2 className='font-bold text-md mb-2 break-words'>
              {header.text}
            </h2>
          )}

          {header && header.format === 'IMAGE' && (
            <div className=' overflow-hidden mb-2'>
              <img
                src={header.imagePreview || header.example?.header_handle?.[0] || ''}
                alt="Header"
                className="w-full  rounded-sm"
              />
            </div>
          )}


          {body && (
            <p className='mb-2 text-sm text-black break-words'>
              {renderTextWithNewlines(body.text)}
            </p>
          )}



          {footer && <p className='text-gray-500 text-xs break-words'>{footer.text}</p>}

          {buttons.length > 0 && (
            <div className='mt-3'>
              {buttons.map((btn, index) => {
                if (btn.type === 'PHONE_NUMBER') {
                  return (
                    <div key={index} className='text-center py-2 border-t-2 border-gray-100'>
                      <a
                        href={`tel:${btn.phone_number}`}
                        className='text-blue-500 font-semibold text-sm py-1 px-2 mt-2 rounded text-center'
                      >
                        <i className="fa-solid fa-phone text-blue-500 text-sm mr-2 font-semibold"></i>
                        {btn.text}
                      </a>
                    </div>
                  );
                } else if (btn.type === 'URL') {
                  return (
                    <div key={index} className='text-center py-2 border-t-2 border-gray-100'>
                      <a
                        href={btn.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className='text-blue-500 font-semibold py-1 px-2 mt-2 rounded text-center text-sm'
                      >
                        <i className="fa-solid fa-arrow-up-right-from-square text-blue-500 text-sm mr-2 font-semibold"></i>
                        {btn.text}
                      </a>
                    </div>
                  );
                } else {
                  return (
                    <div key={index} className='text-center py-2 border-t-2 border-gray-100'>
                      <button className='text-blue-500 font-semibold py-1 px-2 rounded text-sm text-center cursor-pointer'>
                        <i className="fa-solid fa-reply text-blue-500 text-sm mr-2 font-semibold"></i>
                        {btn.text}
                      </button>
                    </div>
                  );
                }
              })}
            </div>
          )}











          <Handle
            type="target"
            position={Position.Left}
            className='!bg-[#4A5565] !w-[10px] !h-[10px] '

          />
          <Handle
            type="source"
            position={Position.Right}
            style={{ background: '#00A63E', width: 12, height: 12, borderRadius: '50%' }}
            className='bg-[#00A63E] !w-[12px] !h-[12px]'
          />
        </div>
      )}
    </>
  )
}

export default TemplateNode
import React, { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';




function MessageNode({ data }) {
    const content = data?.content || {};
    const message = content?.message;
    const image = content?.image || null;

    const [imageSrc, setImageSrc] = useState(null);




    console.log(data);

    useEffect(() => {
        if (image instanceof File) {
            const objectUrl = URL.createObjectURL(image);
            setImageSrc(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        } else if (typeof image === 'string') {
            setImageSrc(image);
        } else {

            setImageSrc(null);
        }
    }, [image]);





    return (
        <>
            <div className='p-2'>
                <div className="whitespace-pre-line text-sm text-gray-800">
                    {message}
                </div>

                {imageSrc && (
                    <div className="mt-3">
                        <img
                            src={imageSrc}
                            alt="Message Attachment"
                            className="w-full"
                        />
                    </div>
                )}

            </div>


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
        </>
    );
}

export default MessageNode;

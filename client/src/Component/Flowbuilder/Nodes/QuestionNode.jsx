import React from 'react';
import { Handle, Position } from 'reactflow';

function QuestionNode({ data }) {
    const { content } = data || {};
    const message = content?.message || '';
    const buttons = content?.buttons || [];

    return (
        <div className="question-node p-2">
            <div className='whitespace-pre-line text-sm text-gray-800'>{message}</div>

            <div className="buttons mt-4">

                {buttons.map((btn) => (
                    <div key={btn.id} className="mb-2 relative">
                        <button
                            className="bg-green-600 text-white px-3 py-2 rounded text-lg w-full"
                            type="button"
                        >
                            {btn.text}
                        </button>

                        <Handle
                            type="source"
                            position={Position.Right}
                            id={`btn-${btn.id}`} 
                            style={{
                              background: '#00A63E',
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              top: '50%',
                              transform: 'translateY(-50%)',
                            }}
                            className='bg-[#00A63E] !w-[12px] !h-[12px]'
                        />
                    </div>
                ))}
            </div>

            <Handle
                type="target"
                position={Position.Left}
                className='!bg-[#4A5565] !w-[10px] !h-[10px]'
            />
        </div>
    );
}

export default QuestionNode;

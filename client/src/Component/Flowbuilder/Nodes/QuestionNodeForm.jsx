import React, { useEffect, useRef, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';








function QuestionNodeForm({ onClose, node, updateNodeData }) {
    const formRef = useRef(null);
    const [question, setQuestion] = useState('');
    const [buttons, setButtons] = useState([]);





    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (formRef.current && !formRef.current.contains(event.target)) {
            onClose();
        }
    };

    const handleAddButton = () => {
        if (buttons.length < 3) {
            setButtons([...buttons, { id: uuidv4(), text: '' }]);
        }
    };

    const handleButtonTextChange = (index, value) => {
        const updated = [...buttons];
        updated[index].text = value;
        setButtons(updated);
    };

    const handleRemoveButton = (index) => {
        const updated = buttons.filter((_, i) => i !== index);
        setButtons(updated);
    };




    const handleSubmit = (e) => {
        e.preventDefault();

        const validButtons = buttons.filter(btn => btn.text.trim() !== '');

        if (validButtons.length === 0) {
            toast.error("Add atleast one button");
            return;
        }

        const updatedNodeData = {
            ...node.data,
            type: 'question',
            content: {
                message: question,
                buttons: validButtons,
            },
        };

        updateNodeData(node.id, updatedNodeData);
        onClose();
    };




    useEffect(() => {
        if (node?.data?.content?.message) {
            setQuestion(node.data.content.message);
        }
        if (node?.data?.content?.buttons) {
            setButtons(node.data.content.buttons);
        }
    }, [node]);



    return (
        <div className='fixed inset-0 bg-black/70 z-50 flex items-center justify-center'>
            <div
                ref={formRef}
                className='p-4 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[350px] relative z-50'
            >
                <div className='flex justify-between items-center pb-4'>
                    <h4 className='font-semibold text-lg'>Set a question</h4>
                    <i
                        className='fa-solid fa-xmark text-2xl cursor-pointer hover:scale-110 text-red-600'
                        onClick={onClose}
                    ></i>
                </div>

                <form onSubmit={(e) => handleSubmit(e)} >
                    <TextField
                        required
                        name="questionContent"
                        label="Question Content"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        multiline
                        rows={5}
                        fullWidth
                        size="small"
                        variant="outlined"
                        sx={{
                            mt: 2,
                            backgroundColor: '#f9fafb',
                            borderRadius: '4px',
                            '& label.Mui-focused': { color: '#00A63E' },
                            '& .MuiOutlinedInput-root': {
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00A63E' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00A63E' },
                                borderRadius: '10px',
                            },
                        }}
                    />

                    <div className="mt-8">
                        {buttons.map((btn, index) => (
                            <div key={btn.id} className="flex items-center gap-2 mt-4">
                                <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    label={`Button ${index + 1}`}
                                    value={btn.text}
                                    onChange={(e) => handleButtonTextChange(index, e.target.value)}
                                    sx={{
                                        backgroundColor: '#f9fafb',
                                        borderRadius: '4px',
                                        '& label.Mui-focused': { color: '#00A63E' },
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00A63E' },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00A63E' },
                                            borderRadius: '10px',
                                        },
                                    }}
                                />
                                <i
                                    className="fa-solid fa-trash text-xs bg-gray-100 p-2 rounded-full text-red-500 hover:text-red-600 hover:bg-red-100 cursor-pointer"
                                    onClick={() => handleRemoveButton(index)}
                                ></i>
                            </div>
                        ))}

                        <div className='mt-4'>
                            <Button
                                variant="outlined"
                                size="small"
                                className='!border-green-600 !text-green-600 float-right'
                                onClick={handleAddButton}
                                disabled={buttons.length >= 3}
                            >
                                Add button
                            </Button>
                        </div>
                    </div>

                    <div className='mt-22 flex gap-4 items-center justify-end'>
                        <button type='button' className='px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer' onClick={onClose}>Cancel</button>
                        <button type='submit' className='px-3 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white cursor-pointer' >Save</button>
                    </div>
                </form>


            </div>
        </div>
    );
}

export default QuestionNodeForm;

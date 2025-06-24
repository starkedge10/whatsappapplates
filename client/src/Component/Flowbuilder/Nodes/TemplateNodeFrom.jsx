import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTemplates } from '../../../redux/templateThunks';
import { TextField, Autocomplete } from '@mui/material';





function TemplateNodeFrom({ onClose, node, updateNodeData }) {
    const dispatch = useDispatch();



    const [formInput, setFormInput] = useState({
        template: '',
    });

    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const templates = useSelector((state) => state.templates.templates);

    useEffect(() => {
        dispatch(fetchTemplates());
    }, [dispatch]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    useEffect(() => {
        if (node?.data?.content?.template?.id) {
            setFormInput({
                template: node.data.content.template.id,
            });
        }
    }, [node]);




    const formRef = useRef(null);

    const handleClickOutside = (event) => {
        const autocompletePopup = document.querySelector('[role="presentation"]');

        if (
            formRef.current &&
            !formRef.current.contains(event.target) &&
            !(autocompletePopup && autocompletePopup.contains(event.target))
        ) {
            onClose();
        }
    };


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);



    useEffect(() => {
        const selected = templates.find((t) => t.id === formInput.template) || null;
        setSelectedTemplate(selected);
    }, [templates, formInput.template]);




    const header = selectedTemplate?.components.find((comp) => comp.type === 'HEADER');
    const body = selectedTemplate?.components.find((comp) => comp.type === 'BODY');
    const footer = selectedTemplate?.components.find((comp) => comp.type === 'FOOTER');
    const buttonComponent = selectedTemplate?.components.find((comp) => comp.type === 'BUTTONS');
    const buttons = buttonComponent?.buttons || [];

    const renderTextWithNewlines = (text) => {
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };




    const handleSubmit = () => {
        const updatedNode = {
            ...node,
            data: {
                ...node.data,
                content: {
                    ...node.data.content,
                    template: selectedTemplate,
                }
            }
        };

        updateNodeData(node.id, updatedNode.data);

        onClose();
    };






    return (
        <div className='fixed inset-0 bg-black/70 z-50 flex items-center justify-center'>
            <div ref={formRef} className='p-4 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[330px] relative z-50 max-h-[90vh] overflow-y-auto'>
                <div className='flex justify-between items-center  pb-4'>
                    <h4 className='font-semibold text-lg'>Set a Template</h4>
                    <i
                        className='fa-solid fa-xmark text-2xl cursor-pointer hover:scale-110 text-red-600'
                        onClick={onClose}
                    ></i>
                </div>

                <div className='mt-4'>
                    <Autocomplete
                        size="small"
                        fullWidth
                        options={templates}
                        getOptionLabel={(option) => option.name}
                        value={templates.find((t) => t.id === formInput.template) || null}
                        onChange={(event, newValue) => {
                            handleChange({
                                target: {
                                    name: 'template',
                                    value: newValue?.id || '',
                                },
                            });
                        }}
                        sx={{

                            '& label.Mui-focused': {
                                color: '#00A63E',
                            },
                            '& .MuiOutlinedInput-root': {
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#00A63E',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#00A63E',
                                },
                                borderRadius: '10px',
                            },
                            '& .MuiSelect-select': {
                                '&:focus': {
                                    backgroundColor: 'transparent',
                                },
                            },
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Template"
                                required
                            />
                        )}
                        ListboxProps={{
                            sx: {
                                '& .MuiAutocomplete-option': {
                                    transition: 'background-color 0.2s',
                                    '&:hover': {
                                        backgroundColor: '#DBFCE7',
                                    },
                                    '&[aria-selected="true"]': {
                                        backgroundColor: '#DBFCE7',
                                    },
                                    '&[aria-selected="true"]:hover': {
                                        backgroundColor: '#DBFCE7',
                                    },
                                },
                            },
                            style: {
                                maxHeight: 200,
                            },
                        }}
                    />
                </div>



                {formInput.template && (
                    <div className='mt-6 bg-[url("./assets/whatsapp-bg.jpg")] p-4 bg-gray-50 rounded-lg'>


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
                        </div>


                    </div>
                )}





                <div className='mt-6 flex gap-4 items-center justify-end'>
                    <button type='button' className='px-3 py-1 rounded-md bg-gray-100 cursor-pointer hover:bg-gray-200' onClick={onClose}>Cancel</button>
                    <button type='submit' className='px-3 py-1 rounded-md bg-green-600 cursor-pointer hover:bg-green-700 text-white' onClick={handleSubmit}>Save</button>
                </div>
            </div>





        </div>
    );
}

export default TemplateNodeFrom;

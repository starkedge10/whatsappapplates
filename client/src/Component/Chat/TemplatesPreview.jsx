import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { TextField } from '@mui/material';
import socket from './socket';








function TemplatesPreview({ template, onClose, onBack, selectedUser }) {

    // const [template, setTemplate] = useState(null);
    const [variableInputs, setVariableInputs] = useState({});





    useEffect(() => {
        socket.on('newTemplateMessage', (data) => {
            console.log('New message received from socket:', data);

        });

        return () => {
            socket.off('newMessage');
        };
    }, [selectedUser]);



    const replaceVariables = (text, component, parameterFormat) => {
        if (!text) return text;

        if (parameterFormat === 'POSITIONAL') {
            return text.replace(/{{(\d+)}}/g, (match, index) => {
                const key = `${component.type}-${index}`;
                return variableInputs[key] !== undefined ? variableInputs[key] : match;
            });
        }

        if (parameterFormat === 'NAMED') {
            return text.replace(/{{(\w+)}}/g, (match, key) => {
                const variableKey = `${component.type}-${key}`;
                return variableInputs[variableKey] !== undefined ? variableInputs[variableKey] : match;
            });
        }

        return text;
    };


    useEffect(() => {

        if (template) {




            const inputFields = {};

            template.components.forEach((component) => {
                if (component.type === "HEADER" || component.type === "BODY") {
                    const text = component.text || '';

                    if (template.parameter_format === "POSITIONAL") {
                        const matches = [...text.matchAll(/{{(\d+)}}/g)];

                        let values = [];

                        if (component.type === 'HEADER') {
                            const headerValues = component.example?.header_text || [];
                            values = Array.isArray(headerValues[0]) ? headerValues[0] : headerValues;
                        } else if (component.type === 'BODY') {
                            const bodyValues = component.example?.body_text || [];
                            values = Array.isArray(bodyValues[0]) ? bodyValues[0] : bodyValues;
                        }

                        matches.forEach((match) => {
                            const index = parseInt(match[1], 10); // {{1}} becomes index 1
                            inputFields[`${component.type}-${index}`] = values?.[index - 1] || '';
                        });

                    } else if (template.parameter_format === "NAMED") {
                        const matches = [...text.matchAll(/{{(\w+)}}/g)];

                        let namedValues = [];

                        if (component.type === 'HEADER') {
                            namedValues = component.example?.header_text_named_params || [];
                        } else if (component.type === 'BODY') {
                            namedValues = component.example?.body_text_named_params || [];
                        }

                        matches.forEach((match) => {
                            const paramName = match[1];
                            const param = namedValues.find(p => p.param_name === paramName);
                            inputFields[`${component.type}-${paramName}`] = param?.example || '';
                        });
                    }
                }
            });

            setVariableInputs(inputFields);


        }
    }, [template]);

    const header = template?.components.find((comp) => comp.type === 'HEADER');
    const body = template?.components.find((comp) => comp.type === 'BODY');
    const footer = template?.components.find((comp) => comp.type === 'FOOTER');
    const buttonComponent = template?.components.find((comp) => comp.type === 'BUTTONS');
    const buttons = buttonComponent?.buttons || [];

    const renderTextWithNewlines = (text) => {
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    const modalRef = useRef(null);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        onClose();
        const payload = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: selectedUser.phone,
            type: "template",
            template: {
                name: template?.name || '',
                language: {
                    code: template?.language || 'en_US'
                },
                components: []
            }
        };

        if (template?.components) {
            template.components.forEach(component => {
                if (component.type === "HEADER") {
                    const headerParams = [];

                    if (template.parameter_format === "POSITIONAL") {
                        Object.entries(variableInputs).forEach(([key, val]) => {
                            if (key.startsWith("HEADER-")) {
                                headerParams.push({
                                    type: "text",
                                    text: val
                                });
                            }
                        });
                    } else if (template.parameter_format === "NAMED") {
                        Object.entries(variableInputs).forEach(([key, val]) => {
                            if (key.startsWith("HEADER-")) {
                                headerParams.push({
                                    type: "text",
                                    text: val,
                                    parameter_name: key.split("-")[1]
                                });
                            }
                        });
                    }

                    if (headerParams.length > 0) {
                        payload.template.components.push({
                            type: "HEADER",
                            parameters: headerParams
                        });
                    }
                }

                if (component.type === "BODY") {
                    const bodyParams = [];

                    if (template.parameter_format === "POSITIONAL") {
                        Object.entries(variableInputs).forEach(([key, val]) => {
                            if (key.startsWith("BODY-")) {
                                bodyParams.push({
                                    type: "text",
                                    text: val
                                });
                            }
                        });
                    } else if (template.parameter_format === "NAMED") {
                        Object.entries(variableInputs).forEach(([key, val]) => {
                            if (key.startsWith("BODY-")) {
                                bodyParams.push({
                                    type: "text",
                                    text: val,
                                    parameter_name: key.split("-")[1]
                                });
                            }
                        });
                    }

                    if (bodyParams.length > 0) {
                        payload.template.components.push({
                            type: "BODY",
                            parameters: bodyParams
                        });
                    }
                }
            });
        }

        try {
            socket.emit('sendTemplateMessage', payload);

        } catch (error) {
            console.error(error);
            toast.error("Failed to send template");
        }
    };




    return (
        <>
            <div ref={modalRef}>

                <div className='p-2 bg-white rounded-md   '>

                    {template && (
                        <div className='flex items-center justify-between mb-8 pb-2 border-b border-gray-300'>
                            <h4 className='font-semibold text-lg'>{template.name}</h4>

                            <i
                                className='fa-solid fa-xmark text-2xl cursor-pointer hover:scale-110 text-red-600'
                                onClick={() => onClose()}
                            ></i>
                        </div>
                    )}

                    <div className='max-h-[300px] overflow-y-auto'>
                        {/* Header */}
                        {header && header.format === 'TEXT' && (
                            <h2 className='font-bold text-md mb-2 break-words'>
                                {replaceVariables(header.text, header, template.parameter_format)}
                            </h2>
                        )}
                        {header && header.format === 'IMAGE' && (
                            <div className='overflow-hidden mb-2'>
                                <img
                                    src={header.imagePreview || header.example?.header_handle?.[0] || ''}
                                    alt="Header"
                                    className="w-full rounded-sm"
                                />
                            </div>
                        )}

                        {/* Body */}
                        {body && (
                            <p className='mb-2 text-sm text-black break-words'>
                                {renderTextWithNewlines(
                                    replaceVariables(body.text, body, template.parameter_format)
                                )}
                            </p>
                        )}

                        {/* Footer */}
                        {footer && <p className='text-gray-500 text-xs break-words'>{footer.text}</p>}

                        {/* Buttons */}
                        {buttons.length > 0 && (
                            <div className='mt-3 flex'>
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

                        {/* Inputs */}
                        <div className="mt-10">
                            {Object.entries(variableInputs).map(([key, value]) => (
                                <div key={key} className="mb-6">
                                    <TextField
                                        fullWidth
                                        label={key}
                                        variant="outlined"
                                        value={value}
                                        size="small"
                                        onChange={(e) =>
                                            setVariableInputs((prev) => ({ ...prev, [key]: e.target.value }))
                                        }
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                height: 32,
                                                fontSize: '0.75rem',
                                                '& fieldset': {
                                                    borderColor: '#00A63E',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#00A63E',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#00A63E',
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: '#00A63E',
                                                fontSize: '0.75rem',
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#00A63E',
                                            },
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='mt-6 flex gap-4 items-center justify-end'>
                        <button type='button' className='px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer font-semibold' onClick={() => onBack()}>Back</button>
                        <button type='submit' className='px-3 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white cursor-pointer font-semibold' onClick={handleSubmit} >Send</button>
                    </div>


                </div>
            </div>
        </>
    );
}

export default TemplatesPreview;

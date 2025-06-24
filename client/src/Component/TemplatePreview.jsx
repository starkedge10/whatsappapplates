import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchTemplates } from '../redux/templateThunks.js';
import { useDispatch } from 'react-redux';


function TemplatePreview({ templateId, liveTemplateData }) {
    const [template, setTemplate] = useState(null);

    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(fetchTemplates());
    }, []);


    const { templates, loading, deleteStatus } = useSelector((state) => state.templates);




    const sampleTemplate = {
        parameter_format: 'POSITIONAL',
        components: [
            {
                type: 'HEADER',
                format: 'TEXT',
                text: 'Hi {{1}}, welcome to our service!',
                example: {
                    header_text: [['Shubham']]
                }
            },
            {
                type: 'BODY',
                text: 'Hello {{1}},\nThanks for choosing {{2}}!',
                example: {
                    body_text: [['Shubham', 'OpenAI']]
                }
            },
            {
                type: 'FOOTER',
                text: 'This is an example footer.'
            },
            {
                type: 'BUTTONS',
                buttons: [
                    {
                        type: 'PHONE_NUMBER',
                        text: 'Call Support',
                        phone_number: '+911234567890'
                    }
                ]
            }
        ]
    };

    useEffect(() => {
        if (liveTemplateData && Array.isArray(liveTemplateData.components)) {
            setTemplate(liveTemplateData);
        } else {
            const storedTemplates = templates;
            if (storedTemplates && templateId) {
                const templates = storedTemplates;
                const matched = templates.find((t) => t.id === templateId);
                setTemplate(matched || sampleTemplate);
            } else {
                setTemplate(sampleTemplate);
            }
        }
    }, [templateId, liveTemplateData]);


    const replaceVariables = (text, component, parameterFormat) => {
        if (!text || !component.example) return text;

        if (parameterFormat === 'POSITIONAL') {
            let values = [];

            if (component.type === 'HEADER') {
                const headerValues = component.example?.header_text;
                values = Array.isArray(headerValues[0]) ? headerValues[0] : headerValues;
            } else if (component.type === 'BODY') {
                const bodyValues = component.example?.body_text;
                values = Array.isArray(bodyValues[0]) ? bodyValues[0] : bodyValues;
            }

            return text.replace(/{{(\d+)}}/g, (match, index) => values?.[parseInt(index) - 1] || match);
        }

        if (parameterFormat === 'NAMED') {
            let namedValues = [];

            // Support both header and body
            if (component.type === 'HEADER') {
                namedValues = component.example?.header_text_named_params || [];
            } else if (component.type === 'BODY') {
                namedValues = component.example?.body_text_named_params || [];
            }

            return text.replace(/{{(\w+)}}/g, (match, key) => {
                const param = namedValues.find((p) => p.param_name === key);
                return param?.example || match;
            });
        }

        return text;
    };



    if (!template || !template.components) {
        return <p className="text-gray-500 mt-5">Loading template preview...</p>;
    }

    const header = template.components.find((comp) => comp.type === 'HEADER');
    const body = template.components.find((comp) => comp.type === 'BODY');
    const footer = template.components.find((comp) => comp.type === 'FOOTER');
    const buttonComponent = template.components.find((comp) => comp.type === 'BUTTONS');
    const buttons = buttonComponent?.buttons || [];

    const renderTextWithNewlines = (text) => {
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };


    return (
        <div className='mt-4 bg-[url("./assets/whatsapp-bg.jpg")] rounded-md bg-no-repeat bg-center bg-cover opacity-70 p-4 pb-8 min-h-[calc(100vh-200px)]'>
            <div className='mt-5 p-2 bg-white max-w-[300px] min-w-[300px] rounded-md'>

                {/* Header */}
                {header && header.format === 'TEXT' && (
                    <h2 className='font-bold text-md mb-2 break-words  '>
                        {replaceVariables(header.text, header, template.parameter_format)}
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
    );
}

export default TemplatePreview;

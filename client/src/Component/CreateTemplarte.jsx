import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { createTemplate, editTemplate } from '../redux/templateThunks.js';
import { useDispatch } from 'react-redux';
import { fetchTemplates, } from '../redux/templateThunks.js';



const accessToken = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;
const businessId = import.meta.env.VITE_WHATSAPP_BUSINESS_ID;




function CreateTemplate({ onSuccess, templateData, onTemplateChange }) {
    const [formInput, setFormInput] = useState({
        templateName: '',
        category: '',
        language: '',
        headerOption: '',
        headerText: '',
        headerImage: null,
        footerText: '',
        messageContent: '',
        parameter_format: 'POSITIONAL',
    });

    const dispatch = useDispatch();

    console.log(templateData);


    const [sampleValues, setSampleValues] = useState({
        header_text: [],
        body_text: []
    });




    const [buttons, setButtons] = useState([]);
    const [isDropupOpen, setIsDropupOpen] = useState(false);
    const dropupRef = useRef(null);
    const buttonRef = useRef(null);







    const extractVariableList = (text, format) => {
        if (format === 'POSITIONAL') {
            const regex = /\{\{(\d+)\}\}/g;
            const matches = Array.from(text.matchAll(regex)).map(match => match[1]);
            return [...new Set(matches)].sort((a, b) => Number(a) - Number(b));
        } else {
            const regex = /\{\{([a-zA-Z0-9_]+)\}\}/g;
            const matches = Array.from(text.matchAll(regex)).map(match => match[1]);
            return [...new Set(matches)];
        }
    };




    const insertAtCursor = (name, insertText) => {
        const textarea = document.querySelector(`textarea[name="${name}"]`);
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;

        const isPosition = formInput.parameter_format === 'POSITIONAL';
        const numberRegex = /\{\{\d+\}\}/;
        const namedRegex = /\{\{[a-zA-Z_]+\d*\}\}/;

        const otherFieldValue =
            name === 'headerText' ? formInput.messageContent : formInput.headerText;

        const combinedValue = value + ' ' + otherFieldValue;

        if (isPosition && namedRegex.test(combinedValue)) {
            toast.warn("You can't mix named variables with number variables ");
            return;
        }

        if (!isPosition && numberRegex.test(combinedValue)) {
            toast.warn("You can't mix number variables with named variables");
            return;
        }

        const existingVariables = extractVariableList(value, formInput.parameter_format);

        if (existingVariables.includes(insertText.replace(/[{}]/g, ''))) return;

        const newText = value.slice(0, start) + insertText + value.slice(end);

        setFormInput(prev => ({
            ...prev,
            [name]: newText
        }));
    };




    const getNextVariableNumber = (text) => {
        const regex = /\{\{(\d+)\}\}/g;
        const matches = Array.from(text.matchAll(regex)).map(match => parseInt(match[1]));
        let next = 1;
        while (matches.includes(next)) next++;
        return next;
    };

    const getNextVariableName = (text, section = 'body') => {
        const regex = /\{\{([a-zA-Z0-9_]+)\}\}/g;
        const matches = Array.from(text.matchAll(regex)).map(match => match[1]);
        let i = 1;
        let name = `${section}_var${i}`;
        while (matches.includes(name)) {
            i++;
            name = `${section}_var${i}`;
        }
        return name;
    };




    const handleHeaderVariable = () => {
        const currentText = formInput.headerText || '';
        if (formInput.parameter_format === 'POSITIONAL') {
            const nextVar = getNextVariableNumber(currentText);
            insertAtCursor('headerText', `{{${nextVar}}}`);

            setSampleValues(prev => ({
                ...prev,
                header_text: [...prev.header_text, '']
            }));
        } else {
            const nextVar = getNextVariableName(currentText, 'header');
            insertAtCursor('headerText', `{{${nextVar}}}`);

            setSampleValues(prev => ({
                ...prev,
                header_text: [...prev.header_text, '']
            }));
        }
    };


    const handleBodyVariable = () => {
        const currentText = formInput.messageContent || '';
        if (formInput.parameter_format === 'POSITIONAL') {
            const nextVar = getNextVariableNumber(currentText);
            insertAtCursor('messageContent', `{{${nextVar}}}`);

            setSampleValues(prev => ({
                ...prev,
                body_text: [...prev.body_text, '']
            }));
        } else {
            const nextVar = getNextVariableName(currentText, 'body');
            insertAtCursor('messageContent', `{{${nextVar}}}`);

            setSampleValues(prev => ({
                ...prev,
                body_text: [...prev.body_text, '']
            }));
        }
    };




    useEffect(() => {
        const { headerText, messageContent, parameter_format } = formInput;

        const headerVars = extractVariableList(headerText, parameter_format);
        const bodyVars = extractVariableList(messageContent, parameter_format);

        setSampleValues(prev => ({
            header_text: headerVars.map((_, i) => prev.header_text?.[i] || ''),
            body_text: bodyVars.map((_, i) => prev.body_text?.[i] || '')
        }));
    }, [formInput.headerText, formInput.messageContent, formInput.parameter_format]);




    useEffect(() => {
        if (onTemplateChange) {
            const {
                templateName,
                category,
                language,
                headerOption,
                headerText,
                headerImage,
                footerText,
                messageContent,
                parameter_format,
            } = formInput;

            const liveComponents = [];

            if (headerOption === 'TEXT' && headerText.trim()) {
                liveComponents.push({
                    type: 'HEADER',
                    format: 'TEXT',
                    text: headerText,
                    example: parameter_format === 'NAMED'
                        ? {
                            header_text_named_params: extractVariableList(headerText, parameter_format).map((param, i) => ({
                                param_name: param,
                                example: sampleValues.header_text[i]?.example || ''
                            }))
                        }
                        : {
                            header_text: sampleValues.header_text.map(p => p.example || '')
                        }
                });
            }
            else if (headerOption === 'IMAGE' && headerImage) {
                let imagePreview = '';

                if (typeof headerImage === 'string') {
                    imagePreview = headerImage;
                } else {
                    imagePreview = URL.createObjectURL(headerImage);
                }

                liveComponents.push({
                    type: 'HEADER',
                    format: 'IMAGE',
                    imagePreview,
                });
            }

            if (messageContent.trim()) {
                const bodyExample =
                    parameter_format === 'NAMED'
                        ? {
                            body_text_named_params: extractVariableList(messageContent, parameter_format).map((param, i) => ({
                                param_name: param,
                                example: sampleValues.body_text[i]?.example || ''
                            }))
                        }
                        : {
                            body_text: sampleValues.body_text.map(p => p.example || '')
                        };

                liveComponents.push({
                    type: 'BODY',
                    text: messageContent,
                    example: bodyExample
                });
            }


            if (footerText?.trim()) {
                liveComponents.push({
                    type: 'FOOTER',
                    text: footerText
                });
            }

            if (buttons.length > 0) {
                liveComponents.push({
                    type: 'BUTTONS',
                    buttons: buttons
                });
            }

            const livePreviewData = {
                name: templateName,
                category,
                language,
                parameter_format,
                components: liveComponents
            };

            onTemplateChange(livePreviewData);
        }
    }, [formInput, buttons, sampleValues]);


    useEffect(() => {
        if (templateData) {
            console.log("editing template: ", JSON.stringify(templateData, null, 2));

            const headerComponent = templateData.components?.find(c => c.type === 'HEADER');
            const bodyComponent = templateData.components?.find(c => c.type === 'BODY');

            setFormInput({
                templateName: templateData?.name || '',
                category: templateData?.category || '',
                language: templateData?.language || '',
                headerOption: headerComponent?.format || '',
                headerText: headerComponent?.text || '',
                headerImage: headerComponent?.example?.header_handle?.[0] || '',
                footerText: templateData?.components?.find(c => c.type === 'FOOTER')?.text || '',
                messageContent: bodyComponent?.text || '',
                parameter_format: templateData?.parameter_format || 'POSITIONAL',
            });

            if (templateData.parameter_format === "NAMED") {

                console.log(headerComponent?.example?.header_text_named_params[0].example)

                setSampleValues({
                    header_text: headerComponent?.example?.header_text_named_params?.map(param => ({
                        param_name: param.param_name,
                        example: param.example,
                    })) || [],
                    body_text: bodyComponent?.example?.body_text_named_params?.map(param => ({
                        param_name: param.param_name,
                        example: param.example,
                    })) || [],
                });
            } else if (templateData.parameter_format === "POSITIONAL") {
                setSampleValues({
                    header_text: (headerComponent?.example?.header_text || []).map((example, index) => ({
                        param_name: `{{${index + 1}}}`,
                        example,
                    })) || [],
                    body_text: (bodyComponent?.example?.body_text?.[0] || []).map((example, index) => ({
                        param_name: `{{${index + 1}}}`,
                        example,
                    })) || [],
                });
            }


            const buttonComp = templateData?.components?.find(c => c.type === 'BUTTONS');
            if (buttonComp?.buttons) {
                setButtons(buttonComp.buttons);
            }
        }
    }, [templateData]);




    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropupRef.current &&
                !dropupRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsDropupOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        setFormInput((prev) => ({
            ...prev,
            headerImage: e.target.files[0],
        }));
    };

    const handleAddButton = () => {
        setButtons([...buttons, { type: 'QUICK_REPLY', text: '' }]);
    };

    const handleButtonChange = (index, key, value) => {
        const updated = [...buttons];
        updated[index][key] = value;

        if (key === 'type') {
            if (value === 'QUICK_REPLY') {
                updated[index] = { type: 'QUICK_REPLY', text: '' };
            } else if (value === 'PHONE_NUMBER') {
                updated[index] = { type: 'PHONE_NUMBER', text: '', phone_number: '' };
            } else if (value === 'URL') {
                updated[index] = { type: 'URL', text: '', url: '' };
            }
        }

        setButtons(updated);
    };

    const handleRemoveButton = (index) => {
        const updated = [...buttons];
        updated.splice(index, 1);
        setButtons(updated);
    };




    const handleSubmit = async (e) => {
        e.preventDefault();
        const {
            templateName,
            category,
            language,
            headerOption,
            headerText,
            headerImage,
            footerText,
            messageContent,
            parameter_format
        } = formInput;

        const components = [];

        if (headerOption === "TEXT" && headerText.trim()) {
            const headerVars = extractVariableList(headerText, parameter_format);

            const headerComponent = {
                type: "HEADER",
                format: "TEXT",
                text: headerText,
            };

            if (headerVars.length > 0) {
                if (parameter_format === 'POSITIONAL') {
                    const headerExamples = sampleValues.header_text?.map(v => v?.example).filter(Boolean) || [];

                    if (headerExamples.length !== headerVars.length) {
                        return toast.error("Please provide example values for all HEADER variables.");
                    }

                    headerComponent.example = {
                        header_text: headerExamples[0]
                    };
                } else {
                    headerComponent.example = {
                        header_text_named_params: headerVars.map((param, i) => ({
                            param_name: param,
                            example: sampleValues.header_text[i]?.example || ""
                        }))
                    };
                }
            }

            components.push(headerComponent);
        }



        const phone_id = 637230059476897;


        if (headerOption === "IMAGE" && headerImage) {
            try {
                const formData = new FormData();
                formData.append('file', headerImage);
                formData.append('type', headerImage.type);
                formData.append('messaging_product', 'whatsapp');

                console.log(formData);

                for (let pair of formData.entries()) {
                    console.log(`${pair[0]}:`, pair[1]);
                }


                const uploadResponse = await axios.post(
                    `https://graph.facebook.com/v22.0/${phone_id}/media`,
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'multipart/form-data',
                        }
                    }
                );

                const mediaId = uploadResponse.data.id;
                console.log(mediaId)

                if (!mediaId) {
                    toast.error("Image upload failed. Media ID not received.");
                    return;
                }

                components.push({
                    type: "HEADER",
                    format: "IMAGE",
                    example: {
                        header_handle: [mediaId]
                    }
                });

            } catch (error) {
                console.log(error.response);
                toast.error("Image upload failed. Please try again.");
                return;
            }
        }

        if (messageContent.trim()) {
            const bodyVars = extractVariableList(messageContent, parameter_format);

            const bodyComponent = {
                type: "BODY",
                text: messageContent
            };

            if (bodyVars.length > 0) {
                if (parameter_format === 'POSITIONAL') {
                    let bodyExamplesRaw = sampleValues.body_text || [];

                    const flatExamples = bodyExamplesRaw.map(item =>
                        typeof item === 'object' && 'example' in item ? item.example : item
                    );

                    if (flatExamples.length !== bodyVars.length) {
                        return toast.error("Please provide example values for all BODY variables.");
                    }

                    bodyComponent.example = {
                        body_text: [flatExamples]
                    };

                } else {
                    bodyComponent.example = {
                        body_text_named_params: bodyVars.map((param, i) => ({
                            param_name: param,
                            example: sampleValues.body_text[i]?.example || ""
                        }))
                    };
                }
            }

            components.push(bodyComponent);
        }



        if (footerText?.trim()) {
            components.push({
                type: "FOOTER",
                text: footerText
            });
        }

        if (buttons.length > 0) {
            components.push({
                type: "BUTTONS",
                buttons: buttons
            });
        }

        const payload = {
            name: templateName.toLowerCase().replace(/\s+/g, '_'),
            language,
            category,
            messaging_product: "whatsapp",
            parameter_format,
            components
        };


        console.log(payload);



        try {
            if (templateData) {
                await dispatch(editTemplate({ id: templateData.id, payload })).unwrap();

            } else {
                await dispatch(createTemplate(payload)).unwrap();

            }

            dispatch(fetchTemplates());
            onTemplateChange({});

            onSuccess();
        } catch (error) {
            toast.error(error || "Failed to save template.");
        }


    };


    const handleReset = () => {
        setFormInput({
            templateName: '',
            category: '',
            language: '',
            headerOption: '',
            headerText: '',
            headerImage: null,
            footerText: '',
            messageContent: '',
            parameter_format: 'POSITIONAL',
        });
        setButtons([]);
        onTemplateChange();
    };

    const canAddPhoneButton = buttons.filter(button => button.type === 'PHONE_NUMBER').length < 1;
    const canAddUrlButton = buttons.filter(button => button.type === 'URL').length < 2;





    return (
        <form onSubmit={handleSubmit} className='max-h-[80vh] px-[10px] py-[10px] text-gray-600 overflow-auto'>
            <div className='flex lg:flex-nowrap flex-wrap gap-[20px] mt-[20px] text-md '>
                <div className="flex-1">
                    <TextField
                        required
                        id="outlined-required"
                        name="templateName"
                        label="Template Name"
                        size="small"
                        fullWidth
                        placeholder="Template Name"
                        value={formInput.templateName}
                        onChange={handleChange}
                        sx={{
                            '& label.Mui-focused': {
                                color: '#00A63E', // Label color on focus
                            },
                            '& .MuiOutlinedInput-root': {
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#00A63E', // Border color on hover
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#00A63E', // Border color on focus
                                },
                                borderRadius: '10px',
                            },
                        }}
                    />

                </div>

                <div className="flex-1">



                    <FormControl fullWidth required size="small" sx={{
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
                    }}>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            labelId="category-label"
                            id="category"
                            name="category"
                            value={formInput.category}
                            label="Category"
                            onChange={handleChange}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        '& .MuiMenuItem-root': {
                                            '&:hover': {
                                                backgroundColor: '#DBFCE7',

                                            },
                                            '&.Mui-selected': {
                                                backgroundColor: '#DBFCE7',

                                            },
                                            '&.Mui-selected:hover': {
                                                backgroundColor: '#DBFCE7',

                                            },

                                        },
                                    },
                                },
                            }}

                        >

                            <MenuItem value="UTILITY">Utility</MenuItem>
                            <MenuItem value="MARKETING">Marketing</MenuItem>
                            <MenuItem value="AUTHENTICATION">Authentication</MenuItem>
                        </Select>
                    </FormControl>

                </div>

                <div className="flex-1">




                    <FormControl fullWidth required size='small' sx={{
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
                    }}>
                        <InputLabel id="language-label">Language</InputLabel>
                        <Select
                            labelId='language-label'
                            id='language'
                            name="language"
                            label="Language"
                            value={formInput.language}
                            onChange={handleChange}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        '& .MuiMenuItem-root': {
                                            '&:hover': {
                                                backgroundColor: '#DBFCE7',

                                            },
                                            '&.Mui-selected': {
                                                backgroundColor: '#DBFCE7',

                                            },
                                            '&.Mui-selected:hover': {
                                                backgroundColor: '#DBFCE7',

                                            },
                                        },
                                    },
                                },
                            }}

                        >

                            <MenuItem value="en_US">English</MenuItem>
                            <MenuItem value="hi">Hindi</MenuItem>

                        </Select>

                    </FormControl>




                </div>
            </div>


            {/* Header/Footer */}
            <h3 className="font-semibold mt-[20px] pt-[20px]">Header/Footer (Optional)</h3>
            <p className="text-xs font-semibold text-gray-500">Add a title or select media type for the header</p>




            <div className='mt-8'>
                <FormControl fullWidth size="small" sx={{
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
                }}>
                    <InputLabel id="variable-type-label">Variable</InputLabel>
                    <Select
                        labelId="variable-type-label"
                        id="parameter_format"
                        name="parameter_format"
                        value={formInput.parameter_format}
                        label=" Variable"
                        onChange={handleChange}
                        variant='outlined'
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    '& .MuiMenuItem-root': {
                                        '&:hover': {
                                            backgroundColor: '#DBFCE7',

                                        },
                                        '&.Mui-selected': {
                                            backgroundColor: '#DBFCE7',

                                        },
                                        '&.Mui-selected:hover': {
                                            backgroundColor: '#DBFCE7',

                                        },

                                    },
                                },
                            },
                        }}
                    >
                        <MenuItem value="POSITIONAL">Number</MenuItem>
                        <MenuItem value="NAMED">Name</MenuItem>
                    </Select>
                </FormControl>
            </div>



            <div className='flex lg:flex-nowrap flex-wrap gap-[20px] mt-[30px] text-md'>
                <FormControl fullWidth size="small" sx={{
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
                }}>
                    <InputLabel id="header-option-label">Header Option</InputLabel>
                    <Select
                        labelId="header-option-label"
                        id="headerOption"
                        name="headerOption"
                        value={formInput.headerOption}
                        label="Header Option"
                        onChange={handleChange}

                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    '& .MuiMenuItem-root': {
                                        '&:hover': {
                                            backgroundColor: '#DBFCE7',

                                        },
                                        '&.Mui-selected': {
                                            backgroundColor: '#DBFCE7',

                                        },
                                        '&.Mui-selected:hover': {
                                            backgroundColor: '#DBFCE7',

                                        },
                                    },
                                },
                            },
                        }}
                    >
                        <MenuItem value="None">None</MenuItem>

                        <MenuItem value="TEXT">Text</MenuItem>
                        <MenuItem value="IMAGE">Image</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    name="footerText"
                    value={formInput.footerText}
                    onChange={handleChange}
                    placeholder="Footer Text (60 Characters)"
                    label="Footer Text"
                    multiline
                    rows={1}
                    fullWidth
                    size="small"
                    inputProps={{ maxLength: 60 }}
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
                    }}
                />

            </div>

            {formInput.headerOption === 'TEXT' && (

                <div className='w-[49%]'>
                    <TextField
                        fullWidth
                        name="headerText"
                        label="Header Text"
                        value={formInput.headerText}
                        onChange={handleChange}
                        multiline
                        rows={1}
                        size="small"
                        placeholder="Header Text (60 Characters)"
                        variant="outlined"
                        sx={{
                            width: 'calc(100%)', mt: 2, '& label.Mui-focused': {
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
                        }}


                        inputProps={{ maxLength: 60 }}

                    />


                    <Button
                        type="button"
                        onClick={handleHeaderVariable}

                        variant="outlined"
                        color="primary"
                        className='!border-green-600 !text-green-600 !bg-green-50 hover:!bg-green-100'
                        sx={{
                            fontWeight: 600,
                            fontSize: '14px',
                            py: '2px',
                            float: 'right',
                            px: '10px',
                            borderRadius: '4px',
                            textTransform: 'none',

                        }}
                    >
                        + Add variable
                    </Button>
                </div>


            )}

            {formInput.headerOption === 'IMAGE' && (
                <div className='w-full flex gap-4 mt-[20px]'>
                    <Button
                        variant="outlined"
                        component="label"
                        size="small"
                    >
                        Upload Header Image
                        <input
                            type="file"
                            name="headerImage"
                            accept="image/*"
                            hidden
                            onChange={handleImageChange}
                        />
                    </Button>

                    {formInput.headerImage && (
                        <p className="text-md font-semibold text-gray-600 mt-1">
                            {formInput.headerImage instanceof File
                                ? formInput.headerImage.name
                                : 'Existing Image'}
                        </p>
                    )}


                </div>
            )}


            <h3 className="font-semibold mt-[40px] pt-[10px]">Body</h3>
            <p className="text-xs font-semibold text-gray-500">Enter the text for your message</p>
            <TextField
                required
                name="messageContent"
                label="Message Content"
                placeholder="Message Content (1024 Characters)"
                value={formInput.messageContent}
                onChange={handleChange}
                multiline
                rows={6}
                fullWidth
                size="small"
                variant="outlined"
                sx={{
                    mt: 4,
                    backgroundColor: '#f9fafb',
                    borderRadius: '4px',
                    '& label.Mui-focused': {
                        color: '#00A63E', // Label color on focus
                    },
                    '& .MuiOutlinedInput-root': {
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#00A63E', // Border color on hover
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#00A63E', // Border color on focus
                        },
                        borderRadius: '10px',
                    },
                }}
                inputProps={{ maxLength: 1024 }}
            />

            <Button
                type="button"
                onClick={handleBodyVariable}

                variant="outlined"
                color="primary"
                className='!border-green-600 !text-green-600 !bg-green-50 hover:!bg-green-100'
                sx={{
                    fontWeight: 600,
                    fontSize: '14px',
                    py: '2px',
                    float: 'right',
                    px: '10px',
                    borderRadius: '4px',
                    textTransform: 'none',

                }}
            >
                + Add variable
            </Button>

            {sampleValues.body_text.map((val, i) => (
                <TextField
                    key={`body_var_${i}`}
                    size="small"
                    required
                    label={`Body {{${formInput.parameter_format === 'POSITIONAL' ? i + 1 : extractVariableList(formInput.messageContent, formInput.parameter_format)[i]}}}`}
                    value={val.example}

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
                    }}
                    onChange={(e) => {
                        const updated = [...sampleValues.body_text];
                        updated[i] = { ...updated[i], example: e.target.value };
                        setSampleValues(prev => ({ ...prev, body_text: updated }));
                    }}
                    fullWidth
                    margin="normal"
                />
            ))}




            {sampleValues.header_text.map((val, i) => (
                <TextField
                    key={`header_var_${i}`}
                    size="small"
                    required
                    label={`Header {{${formInput.parameter_format === 'POSITIONAL' ? i + 1 : extractVariableList(formInput.headerText, formInput.parameter_format)[i]}}}`}
                    value={val.example}
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
                    }}
                    onChange={(e) => {
                        const updated = [...sampleValues.header_text];
                        updated[i] = { ...updated[i], example: e.target.value };
                        setSampleValues(prev => ({ ...prev, header_text: updated }));
                    }}
                    fullWidth
                    margin="normal"
                />
            ))}



            {/* Buttons */}
            <h3 className="font-semibold mt-[30px] pt-[10px]">Buttons (Optional)</h3>
            <p className="text-sm font-semibold text-gray-600 mb-8">Add Quick Reply or Call To Action buttons</p>

            {buttons.map((btn, i) => (
                <div key={i} className="flex gap-2 items-center text-gray-700 text-sm my-2">
                    <FormControl size="small" sx={{
                        width: '150px', mr: 2, '& label.Mui-focused': {
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
                    }} >
                        <InputLabel id={`button-type-label-${i}`}>Button Type</InputLabel>
                        <Select
                            labelId={`button-type-label-${i}`}
                            id={`button-type-${i}`}
                            value={btn.type}
                            label="Button Type"
                            onChange={(e) => handleButtonChange(i, 'type', e.target.value)}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        '& .MuiMenuItem-root': {
                                            '&:hover': {
                                                backgroundColor: '#DBFCE7',

                                            },
                                            '&.Mui-selected': {
                                                backgroundColor: '#DBFCE7',

                                            },
                                            '&.Mui-selected:hover': {
                                                backgroundColor: '#DBFCE7',

                                            },
                                        },
                                    },
                                },
                            }}
                        >
                            <MenuItem value="QUICK_REPLY">Quick Reply</MenuItem>
                            <MenuItem value="PHONE_NUMBER" disabled={!canAddPhoneButton}>
                                Call Phone
                            </MenuItem>
                            <MenuItem value="URL" disabled={!canAddUrlButton}>
                                Visit URL
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Button Text"
                        placeholder="Button Text (25 Characters)"
                        variant="outlined"
                        size="small"
                        value={btn.text}
                        onChange={(e) => handleButtonChange(i, 'text', e.target.value)}
                        sx={{
                            width: 200, '& label.Mui-focused': {
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
                        }}


                        inputProps={{ maxLength: 25 }}
                        className='!mb-2'
                    />

                    {btn.type === 'PHONE_NUMBER' && (
                        <TextField
                            label="Phone Number"
                            placeholder="Phone Number with country code"
                            variant="outlined"
                            size="small"
                            value={btn.phone_number || ''}
                            onChange={(e) => handleButtonChange(i, 'phone_number', e.target.value)}
                            sx={{
                                width: 280, '& label.Mui-focused': {
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
                            }}


                            inputProps={{ maxLength: 15 }}
                            className='!mb-2'

                        />
                    )}

                    {btn.type === 'URL' && (
                        <TextField
                            label="URL"
                            placeholder="URL"
                            variant="outlined"
                            size="small"
                            value={btn.url || ''}
                            onChange={(e) => handleButtonChange(i, 'url', e.target.value)}
                            sx={{
                                width: 200, '& label.Mui-focused': {
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
                            }}
                            className='!mb-2'
                        />
                    )}

                    <i className="fa-solid fa-xmark text-2xl text-red-400 cursor-pointer hover:text-red-500 hover:scale-110 " onClick={() => handleRemoveButton(i)}></i>
                </div>
            ))}

            <Button
                type="button"
                onClick={handleAddButton}
                variant="contained"
                color="primary"
                size="small"
                className='!bg-green-50 hover:!bg-green-100 !border !text-green-600 !border-green-600 !text-lg  !capitalize !rounded-md mt-2'
            >
                + Add Button
            </Button>



            <div className='mt-[0px] flex gap-[20px] float-right'>
                <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    className='!bg-green-600 hover:!bg-green-700 !text-md !font-semibold !capitalize !rounded-md'

                >
                    Save Template
                </Button>

                <Button
                    type="button"
                    onClick={handleReset}
                    variant="contained"
                    color="error"
                    className='!bg-red-600 hover:!bg-red-700 !text-md !font-semibold !capitalize !rounded-md'
                >
                    Reset
                </Button>
            </div>
        </form>
    );
}

export default CreateTemplate;

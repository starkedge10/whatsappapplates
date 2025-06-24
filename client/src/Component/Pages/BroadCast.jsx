import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, FormControl, Select, InputLabel, MenuItem, Checkbox, ListItemText, FormControlLabel, Autocomplete, Button } from '@mui/material';
import TemplatePreview from '../TemplatePreview';
import CampaignList from '../CampaignList';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTemplates } from '../../redux/templateThunks';
import { fetchPhoneNumbers } from '../../redux/phoneNumberThunks';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { createCampaign, updateCampaign } from '../../redux/Campaign/campaignThunks';
import { fetchContacts } from '../../redux/contacts/contactThunk';




axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;


function BroadCast() {
  const [fileName, setFileName] = useState('No file chosen');



  const dispatch = useDispatch();

  const navigate = useNavigate();


  const [formInput, setFormInput] = useState({
    campaignName: '',
    whatsappNumber: '',
    template: '',
    contactList: [],
  });


  const [editData, setEditData] = useState(null);

  const [broadcastNow, setBroadcastNow] = useState(null);



  const { phoneNumbers, loading: numbersLoading, error: numbersError } = useSelector(state => state.phoneNumbers);


  useEffect(() => {
    dispatch(fetchPhoneNumbers());
  }, [dispatch]);


  useEffect(() => {
    if (editData) {
      setFormInput(editData);
    }
  }, [editData]);



  const campaigns = useSelector((state) => state.campaign.campaigns);


  const { templates, loading, error } = useSelector((state) => state.templates);




  useEffect(() => {
    if (templates.length === 0) {
      dispatch(fetchTemplates());
    }
  }, [dispatch]);


  const contacts = useSelector((state) => state.contact.contacts);

  useEffect(() => {
    if (contacts.length === 0) {
      dispatch(fetchContacts());
    }
  }, []);




  // const [contacts, setContacts] = useState([
  //   { id: '1', name: 'John Doe', number: '+917876054918' },
  //   { id: '2', name: 'Jane Smith', number: '+919876543210' },
  // ]);






  const handleBroadCast = (campaign) => {
    handleSubmit(campaign);
  }


  const handleEditCampaign = (campaign) => {
    setEditData(campaign);
  }


  const handleSubmit = async (broadcast, e) => {
    if (e) e.preventDefault();

    const selectedTemplate = templates.find(t => t.id === broadcast?.template);


    if (!selectedTemplate) {
      return;
    }

    toast.success("Broadcast started");

    const sendPromises = broadcast.contactList.map(async number => {
      const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: number,
        type: "template",
        template: {
          name: selectedTemplate?.name || '',
          language: {
            code: selectedTemplate?.language || 'en_US'
          },
          components: []
        }
      };

      if (selectedTemplate?.components) {
        selectedTemplate.components.forEach(component => {
          // HEADER
          if (component.type === "HEADER") {
            const headerParams = [];

            // Named variable format
            if (component?.example?.header_text_named_params) {
              component.example.header_text_named_params.forEach(param => {
                headerParams.push({
                  type: "text",
                  text: param.example,
                  parameter_name: param.param_name
                });
              });
            }
            // Positional format
            else if (component?.example?.header_text?.[0]) {
              const exampleHeader = component.example.header_text[0];
              headerParams.push({
                type: "text",
                text: exampleHeader
              });
            }

            if (headerParams.length > 0) {
              payload.template.components.push({
                type: "HEADER",
                parameters: headerParams
              });
            }
          }

          // BODY
          if (component.type === "BODY") {
            const bodyParams = [];

            // Named variable format
            if (component?.example?.body_text_named_params) {
              component.example.body_text_named_params.forEach(param => {
                bodyParams.push({
                  type: "text",
                  text: param.example,
                  parameter_name: param.param_name
                });
              });
            }
            // Positional format
            else if (component?.example?.body_text?.[0]) {
              const exampleBody = component.example.body_text[0];
              if (Array.isArray(exampleBody)) {
                exampleBody.forEach(value => {
                  bodyParams.push({
                    type: "text",
                    text: value
                  });
                });
              }
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
        await axios.post(`/sendTemplateMessages`, payload);
      } catch (error) {
        console.error(`Error for ${number}:`, error);
        toast.error(`Failed for ${number}: ${error.response?.data?.error?.error?.message}`);
      }
    });

    await Promise.all(sendPromises);

    toast.success("Broadcast attempt finished.");
  };




  const handleReset = (e) => {
    e.preventDefault();
    setFormInput({
      campaignName: '',
      whatsappNumber: '',
      template: '',
      contactList: [],
    });
    setFileName('No file chosen');
  };




  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : 'No file chosen');
  };



  const handleChange = (e) => {
    const { name, value } = e.target;


    if (name === 'template') {

      setFormInput((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (name === 'contactList') {
      setFormInput((prev) => ({
        ...prev,
        [name]: Array.isArray(value) ? value : value.split(','),
      }));
    } else {
      setFormInput((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  const handleSelectAll = () => {
    if (formInput.contactList.length === contacts.length) {
      setFormInput((prev) => ({
        ...prev,
        contactList: [],
      }));
    } else {
      setFormInput((prev) => ({
        ...prev,
        contactList: contacts.map((contact) => contact.number),
      }));
    }
  };



  const handleSave = () => {
    const { campaignName, whatsappNumber, template, contactList } = formInput;

    if (!campaignName || !whatsappNumber || !template || contactList.length === 0) {
      toast.info("All fields are required.");
      return;
    }

    if (editData) {
      toast.promise(
        dispatch(updateCampaign({ id: editData._id, updatedCampaign: formInput })),
        {
          pending: 'Updating campaign...',
          success: 'Campaign updated!',
          error: {
            render({ data }) {
              return typeof data === 'string' ? data : 'Failed to update';
            }
          }
        }
      );
    } else {
      const exists = campaigns.some(c => c.campaignName === campaignName);
      if (exists) {
        toast.warning("Campaign with this name already exists");
        return;
      }

      toast.promise(
        dispatch(createCampaign(formInput)),
        {
          pending: 'Creating campaign...',
          success: 'Campaign created!',
          error: {
            render({ data }) {
              return typeof data === 'string' ? data : 'Failed to create';
            }
          }
        }
      );
    }

    // Reset form after save or update
    setFormInput({
      campaignName: '',
      whatsappNumber: '',
      template: '',
      contactList: [],
    });
    setFileName('No file chosen');
    setEditData(null); // Exit edit mode
  };





  return (
    <div className='bg-gray-100 px-[10px] py-[10px]'>
      <div className='flex justify-between gap-[10px] items-stretch'>
        <div className='bg-white p-[15px] pb-[10px] rounded-md flex-[66%]'>
          <div className='px-2'>
            <h2 className='font-bold text-xl mt-4'>Campaign/Broadcasting</h2>
            <p className='font-semibold text-sm mt-[5px] text-gray-600'>
              Run a Campaign to broadcast your message
            </p>
          </div>

          <form className=' text-gray-600 mt-[30px] px-2'>
            <div className='flex lg:flex-nowrap flex-wrap gap-[20px]'>
              <TextField
                label="Campaign Name"
                name="campaignName"
                value={formInput.campaignName}
                onChange={handleChange}
                placeholder="Campaign Name"
                required
                fullWidth
                size='small'
                variant="outlined"
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
                <InputLabel id="whatsapp-number-label">Whatsapp Number</InputLabel>
                <Select
                  name="whatsappNumber"
                  labelId='whatsapp-number-label'
                  value={formInput.whatsappNumber}
                  onChange={handleChange}
                  label="Whatsapp Number"
                  variant="outlined"
                  placeholder="Send Message From Whatsapp Number"
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

                  {phoneNumbers.map((num) => (
                    <MenuItem key={num.id} value={num.id}>
                      {num.display_phone_number}
                    </MenuItem>
                  ))}

                </Select>
              </FormControl>
            </div>



            <div className='mt-6 flex lg:flex-nowrap flex-wrap gap-[20px]'>

              <div className='flex-1/2'>

                <Autocomplete
                  size="small"
                  fullWidth
                  options={templates}
                  getOptionLabel={(option) => option.name}
                  value={templates?.find(t => t.id === formInput.template) || null}
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



                <Button
                  variant="outlined"
                  size="small"
                  className='!border-green-600 !text-green-600 bg-green-50 hover:!bg-green-100 mt-2 float-end !font-semibold'
                  onClick={() => {
                    navigate("/manageTemplates", { state: { openForm: true } });
                  }}
                >

                  + Add New Template
                </Button>
              </div>



              <div className='flex-1/2'>
                <FormControl
                  fullWidth
                  required
                  size="small"
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
                >
                  <InputLabel id="contact-list-label">Select Contacts</InputLabel>
                  <Select
                    labelId="contact-list-label"
                    id="contact-list"
                    name="contactList"
                    multiple
                    value={formInput.contactList}
                    onChange={handleChange}
                    label="Select Contacts"
                    renderValue={(selected) =>
                      contacts
                        .filter((c) => selected.includes(c.phone))
                        .map((c) => c.name)
                        .join(', ')
                    }
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
                    {/* Select All Option */}
                    <MenuItem>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formInput.contactList.length === contacts.length}
                            onChange={handleSelectAll}
                            sx={{
                              color: '#00A63E',
                              '&.Mui-checked': {
                                color: '#00A63E',
                              },
                            }}
                          />
                        }
                        label="Select All"
                      />
                    </MenuItem>

                    {/* Contacts List */}
                    {contacts.map((contact) => (
                      <MenuItem key={contact._id} value={contact.phone}>
                        <Checkbox
                          checked={formInput.contactList.includes(contact.phone)}
                          sx={{
                            color: '#00A63E',
                            '&.Mui-checked': {
                              color: '#00A63E',
                            },
                          }}
                        />
                        <ListItemText primary={contact.name} secondary={contact.phone} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

              </div>


            </div>

            <div className='flex flex-wrap lg:flex-nowrap gap-[20px] mt-8 items-center'>

              <div className=' flex flex-1/2 gap-[20px] items-center'>
                <label
                  htmlFor='fileUpload'
                  className='cursor-pointer text-nowrap border border-green-600 bg-green-50 hover:bg-green-100 text-green-600 font-semibold py-[5px] px-[12px] rounded flex items-center gap-2'
                >
                  <i className='fa-solid fa-upload'></i>
                  Upload File
                </label>
                <input
                  type='file'
                  id='fileUpload'
                  onChange={handleFileChange}
                  className='hidden'
                />
                <span className='text-sm text-nowrap text-gray-600 mt-1'>{fileName}</span>

              </div>


              <div className='flex-1/2 flex justify-end items-center'>


                <button
                  type='button'
                  className='font-semibold mr-[20px] text-nowrap bg-green-50 hover:bg-green-100 text-green-600 border border-green-600 cursor-pointer px-[12px] py-[5px] rounded-md' onClick={handleSave}
                >
                  {editData ? 'Update' : 'Save'}

                </button>




                <div>
                  <button
                    type='submit'
                    className='text-nowrap mr-[20px] font-semibold bg-green-600 hover:bg-green-700 text-white cursor-pointer px-[12px] py-[5px] rounded-md'
                    onClick={(e) => { handleSubmit(formInput, e); handleSave(); }}

                  >
                    Broadcast Now
                  </button>

                  <button
                    type='button'
                    className='font-semibold  text-nowrap bg-red-500 hover:bg-red-600 text-white cursor-pointer px-[12px] py-[5px] rounded-md'
                    onClick={handleReset}
                  >
                    Cancel
                  </button>
                </div>


              </div>

            </div>



          </form>

          <div className='mt-20'>
            <CampaignList onEdit={handleEditCampaign} broadcast={handleBroadCast} />
          </div>

        </div>

        <div className='flex-[33%] bg-white p-[15px] rounded-md '>
          <h2 className='font-bold text-xl mt-4'>Template Content</h2>
          <p className='font-semibold text-md mt-[5px] text-gray-600'>
            Here you can see the selected template content body

          </p>


          <div >
            <TemplatePreview templateId={formInput.template} />
          </div>
        </div>
      </div>



    </div>
  );
}

export default BroadCast;

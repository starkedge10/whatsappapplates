import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addContact, updateContact } from '../../redux/contacts/contactThunk';
import { toast } from 'react-toastify';
import ContactList from '../Contact/ContactList.jsx';
import { useLocation } from 'react-router-dom';




function Contact() {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [attributes, setAttributes] = useState([]);
    const [errors, setErrors] = useState({ name: '', phone: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContact, setSelectedContact] = useState(null);
    const location = useLocation();

    const dispatch = useDispatch();
    const contacts = useSelector((state) => state.contact.contacts);

    useEffect(() => {
        if (selectedContact) {
            setFormData({ name: selectedContact.name, phone: selectedContact.phone });
            setAttributes(selectedContact.attributes || []);
            setIsOpen(true);
        }
    }, [selectedContact]);

    const handleAddContact = () => {
        setSelectedContact(null);
        setFormData({ name: '', phone: '' });
        setAttributes([]);
        setIsOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required.';
        const phoneRegex = /^\+?[0-9]{7,15}$/;
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required.';
        } else if (!phoneRegex.test(formData.phone.trim())) {
            newErrors.phone = 'Phone number must be 7–15 digits.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAttribute = () => {
        setAttributes([...attributes, { name: '', value: '' }]);
    };

    const handleAttributeChange = (index, field, value) => {
        const updated = [...attributes];
        updated[index][field] = value;
        setAttributes(updated);
    };

    const handleDeleteAttribute = (index) => {
        setAttributes(attributes.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const contactData = {
            ...formData,
            attributes: attributes.filter(attr => attr.name.trim() && attr.value.trim())
        };

        const isNew = !selectedContact;
        const duplicate = contacts.find(
            contact =>
                contact.phone === contactData.phone &&
                (!selectedContact || selectedContact.phone !== contact.phone)
        );

        if (duplicate) {
            toast.error('Contact with this phone number already exists!');
            return;
        }

        if (isNew) {

            toast.promise(
                dispatch(addContact(contactData)),
                {
                    pending: 'adding contact...',
                    success: 'Contact added successfully!',
                    error: {
                        render({ data }) {
                            return typeof data === 'string' ? data : 'Failed to update';
                        }
                    }
                }
            );
        } else {
            dispatch(updateContact({ id: selectedContact._id, updatedData: contactData }));
        }

        setFormData({ name: '', phone: '' });
        setAttributes([]);
        setErrors({});
        setSelectedContact(null);
        setIsOpen(false);
    };

    const handleCancel = () => {
        setFormData({ name: '', phone: '' });
        setAttributes([]);
        setErrors({});
        setSelectedContact(null);
        setIsOpen(false);
    };



    useEffect(() => {
        if (location.state?.isOpen) {
            setIsOpen(true);
        }
        if (location.state?.selectedUser) {
            setSelectedContact(location.state.selectedUser);
        }
    }, [location.state]);



    return (
        <>
            <div className='p-8 mb-[7px] bg-gray-100 flex items-center text-gray-600 justify-between'>
                <div className='flex items-center gap-12'>
                    <div>
                        <h2 className='text-3xl font-semibold'>Contacts</h2>
                        <p className='text-xs mt-2 font-semibold text-gray-600 max-w-[400px]'>
                            Contact list stores the list of numbers that you've interacted with. You can even manually export or import contacts.
                        </p>
                    </div>
                    <form>
                        <div className='search-bar w-full flex items-center max-w-[500px] relative'>
                            <i className="fa-solid fa-magnifying-glass absolute right-4 text-gray-400"></i>
                            <input
                                type="text"
                                className='w-full bg-white rounded-md pl-[10px] pr-[40px] py-[14px] focus:outline-none !font-medium'
                                placeholder='Search here ... '
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </form>
                </div>

                <button
                    type='button'
                    className='bg-green-600 cursor-pointer text-white text-lg px-4 py-3 rounded-md hover:bg-green-700 transition duration-200'
                    onClick={handleAddContact}
                >
                    Add Contact
                </button>
            </div>

            {isOpen && (
                <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-lg shadow-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto'>
                        <div className='flex justify-between items-center pb-4'>
                            <h4 className='font-semibold text-lg'>{selectedContact ? 'Edit Contact' : 'Add Contact'}</h4>
                            <i
                                className='fa-solid fa-xmark text-2xl cursor-pointer hover:scale-110 text-red-600'
                                onClick={handleCancel}
                            ></i>
                        </div>

                        <form onSubmit={handleSubmit} className='flex flex-col'>
                            <div className='mb-4 mt-4'>
                                <label htmlFor="name" className='block text-sm font-medium text-gray-700'>Name</label>
                                <input
                                    type='text'
                                    name="name"
                                    className={`w-full bg-gray-100 px-2 py-2 mt-2 rounded-md focus:outline-none text-sm ${errors.name ? 'border border-red-500' : ''}`}
                                    placeholder='Enter your name'
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div className='mb-4 mt-6'>
                                <label htmlFor="phone" className='block text-sm font-medium text-gray-700'>Phone Number</label>
                                <input
                                    type='text'
                                    name="phone"
                                    className={`w-full bg-gray-100 px-2 py-2 mt-2 rounded-md focus:outline-none text-sm ${errors.phone ? 'border border-red-500' : ''}`}
                                    placeholder='Enter your phone number with country code (+XX)'
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    disabled={!!selectedContact}
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>

                            <div className='mb-4 mt-6'>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Custom Attribute (Optional)</label>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    className='!border-green-600 !text-green-600 !capitalize'
                                    onClick={handleAttribute}
                                >
                                    Add Attribute
                                </Button>

                                {attributes.map((attr, index) => (
                                    <div key={index} className='flex items-center gap-2 mt-4'>
                                        <input
                                            type='text'
                                            placeholder='Attribute Name'
                                            className='w-1/2 bg-gray-100 px-2 py-2 rounded-md focus:outline-none text-sm'
                                            value={attr.name}
                                            onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                                        />
                                        <input
                                            type='text'
                                            placeholder='Attribute Value'
                                            className='w-1/2 bg-gray-100 px-2 py-2 rounded-md focus:outline-none text-sm'
                                            value={attr.value}
                                            onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                        />
                                        <i
                                            className="fa-solid fa-trash text-xs bg-gray-100 p-2 rounded-full text-red-500 hover:text-red-600 hover:bg-red-100 cursor-pointer"
                                            onClick={() => handleDeleteAttribute(index)}
                                        ></i>
                                    </div>
                                ))}
                            </div>

                            <div className='flex justify-end mt-8 gap-4'>
                                <button
                                    type="button"
                                    className='bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700 transition duration-200 cursor-pointer'
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className='bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700 transition duration-200 cursor-pointer'
                                >
                                    {selectedContact ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className='mt-4 h-[calc(100vh-292px)]'>
                <ContactList
                    onSearch={searchTerm}
                    setSelectedContact={setSelectedContact}
                />
            </div>
        </>
    );
}

export default Contact;

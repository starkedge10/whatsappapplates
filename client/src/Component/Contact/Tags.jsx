import React, { use, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addTags, removeTags } from '../../redux/contacts/contactThunk';





function Tags({ selectedUser }) {
    const dispatch = useDispatch();
    const [inputValue, setInputValue] = useState('');


    const User = useSelector((state) => state.contact.contacts.find((contact) => contact.phone === selectedUser?.phone));

    const handleTagChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleTagKeyPress = (e) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            const newTag = inputValue.trim();

            if (User?.tags?.includes(newTag)) {
                toast.error('Tag already exists');
                return;
            }

            toast.promise(
                dispatch(addTags({ id: selectedUser._id, tags: [newTag] })),
                {
                    pending: 'adding tag...',
                    success: 'Tag added successfully!',
                    error: {
                        render({ data }) {
                            return typeof data === 'string' ? data : 'Failed to update';
                        }
                    }
                }
            );


            setInputValue('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {

        toast.promise(
            dispatch(removeTags({ id: selectedUser._id, tag: tagToRemove })),
            {
                pending: 'deleting tag...',
                success: 'Tag deleted successfully!',
                error: {
                    render({ data }) {
                        return typeof data === 'string' ? data : 'Failed to update';
                    }
                }
            }
        );

    };


    return (
        <div>
            <div className='flex justify-between items-center gap-4'>
                <div className='flex items-center gap-2'>
                    <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M11.6667 1.66699C11.0036 1.66699 10.368 1.93052 9.89913 2.39941L2.39913 9.89941C1.42832 10.8702 1.42832 12.4638 2.39913 13.4346L6.5658 17.6012C7.0347 18.0701 7.67031 18.3337 8.33338 18.3337C8.99644 18.3337 9.63205 18.0701 10.101 17.6012L17.601 10.1012C18.07 9.63216 18.3334 8.99591 18.3334 8.33284V3.75033C18.3334 2.60721 17.3932 1.66699 16.25 1.66699H11.6667ZM14.1667 4.58366C13.4763 4.58366 12.9167 5.14324 12.9167 5.83366C12.9167 6.52408 13.4763 7.08366 14.1667 7.08366C14.8571 7.08366 15.4167 6.52408 15.4167 5.83366C15.4167 5.14324 14.8571 4.58366 14.1667 4.58366Z' fill='#848A86' />
                    </svg>
                    <h3 className='font-semibold text-nowrap text-gray-700'>Tags</h3>
                </div>
            </div>

            <div className='mt-4 flex items-center'>
                <input
                    type='text'
                    className='bg-gray-100 rounded-lg w-full focus:outline-1 focus:outline-green-600 px-2 py-2 text-sm'
                    placeholder='Add a tag'
                    value={inputValue}
                    onChange={handleTagChange}
                    onKeyPress={handleTagKeyPress}
                />
            </div>

            <div className='flex flex-wrap mt-3 gap-2 max-h-[120px] overflow-y-auto'>
                {User?.tags?.map((tag, index) => (
                    <div key={index} className='bg-green-100 text-green-700 px-1 pl-2 py-1 rounded-full text-sm flex items-center gap-1'>
                        {tag}
                        <div
                            className='px-1 text-sm bg-red-100 rounded-full cursor-pointer hover:bg-red-200'
                            onClick={() => handleRemoveTag(tag)}
                        >
                            <i className="fa-solid fa-xmark text-red-600"></i>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Tags;

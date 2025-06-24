import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react'
import { addNotes, removeNotes, updateNote } from '../../redux/contacts/contactThunk';
import { toast } from 'react-toastify';




function Notes({ selectedUser }) {
    const [textArea, setTextArea] = useState(false);
    const [input, setInput] = useState('');
    const [editingTime, setEditingTime] = useState(null);

    const dispatch = useDispatch();

    const User = useSelector((state) => state.contact.contacts.find((contact) => contact.phone === selectedUser?.phone));



    const handleTextArea = () => {
        setTextArea(true);
    }


    const handleNoteSubmit = () => {
        if (input.trim() === '') return;

        const noteObject = {
            text: input.trim(),
            time: new Date().toISOString(),
        };

        if (editingTime) {

            toast.promise(
                dispatch(updateNote({ id: selectedUser._id, updatedNote: noteObject })),
                {
                    pending: 'updating notes...',
                    success: 'Notes updated successfully!',
                    error: {
                        render({ data }) {
                            return typeof data === 'string' ? data : 'Failed to update';
                        }
                    }
                }
            );

        } else {
            toast.promise(
                dispatch(addNotes({ id: selectedUser._id, notes: [noteObject] })),
                {
                    pending: 'adding notes...',
                    success: 'Notes added successfully!',
                    error: {
                        render({ data }) {
                            return typeof data === 'string' ? data : 'Failed to update';
                        }
                    }
                }
            );

        }

        setTextArea(false);
        setInput('');
        setEditingTime(null);
    };


    const handleNotesDelete = (id, time) => {
        toast.promise(
            dispatch(removeNotes({ id: id, time: time })),

            {
                pending: 'removing notes...',
                success: 'Notes removed successfully!',
                error: {
                    render({ data }) {
                        return typeof data === 'string' ? data : 'Failed to update';
                    }
                }
            }
        );


    };


    const handleEditNotes = (text, time) => {
        setInput(text);
        setTextArea(true);
        setEditingTime(time);
    };




    return (
        <>
            <div className='flex justify-between items-center gap-4'>
                <div className='flex items-center gap-2'>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Task"><path id="Vector" d="M8.54171 1.25C7.58479 1.25 6.79408 1.98609 6.68787 2.91667H5.20837C4.18025 2.91667 3.33337 3.76354 3.33337 4.79167V16.0417C3.33337 17.0698 4.18025 17.9167 5.20837 17.9167H14.7917C15.8198 17.9167 16.6667 17.0698 16.6667 16.0417V4.79167C16.6667 3.76354 15.8198 2.91667 14.7917 2.91667H13.3122C13.206 1.98609 12.4153 1.25 11.4584 1.25H8.54171ZM8.54171 2.5H11.4584C11.8111 2.5 12.0834 2.77229 12.0834 3.125C12.0834 3.47771 11.8111 3.75 11.4584 3.75H8.54171C8.189 3.75 7.91671 3.47771 7.91671 3.125C7.91671 2.77229 8.189 2.5 8.54171 2.5ZM5.20837 4.16667H6.98735C7.32556 4.66746 7.89784 5 8.54171 5H11.4584C12.1022 5 12.6745 4.66746 13.0127 4.16667H14.7917C15.1444 4.16667 15.4167 4.43896 15.4167 4.79167V16.0417C15.4167 16.3944 15.1444 16.6667 14.7917 16.6667H5.20837C4.85567 16.6667 4.58337 16.3944 4.58337 16.0417V4.79167C4.58337 4.43896 4.85567 4.16667 5.20837 4.16667ZM11.9174 7.0874C11.4472 7.0874 10.9777 7.2645 10.6226 7.61963L6.97595 11.2663C6.89447 11.3476 6.83702 11.4498 6.80994 11.5617L6.26713 13.8118C6.24197 13.916 6.24399 14.0248 6.27299 14.1279C6.30198 14.231 6.35699 14.3249 6.43272 14.4007C6.50845 14.4764 6.60238 14.5314 6.70548 14.5604C6.80859 14.5894 6.91742 14.5914 7.02152 14.5662L9.27169 14.0226C9.38348 13.9958 9.48569 13.9386 9.5671 13.8574L13.2129 10.2108H13.2137C13.9237 9.5002 13.9232 8.32989 13.2129 7.61963C12.8578 7.2645 12.3875 7.0874 11.9174 7.0874ZM11.9174 8.32926C12.0651 8.32926 12.213 8.3873 12.3291 8.50342C12.5614 8.73566 12.5617 9.09504 12.3291 9.3278L8.80782 12.8491L7.72302 13.1104L7.98425 12.0256L11.5064 8.50342C11.6225 8.3873 11.7696 8.32926 11.9174 8.32926Z" fill="#848A86"></path></g></svg>
                    <h3 className='font-semibold text-nowrap text-gray-700'>Notes</h3>
                </div>

                <div>
                    <button type='button' className='text-sm text-green-600 border border-green-600 px-2 rounded-sm cursor-pointer hover:bg-green-100' onClick={handleTextArea}>Add</button>
                </div>
            </div>


            {textArea && (
                <>
                    <div className='mt-4 rounded-lg '>
                        <textarea name="" id="" className='bg-amber-50 w-full rounded-lg focus:outline-1 focus:outline-green-600 p-1' value={input}
                            onChange={(e) => setInput(e.target.value)}></textarea>
                    </div>

                    <div className='flex gap-2 justify-end mt-2'>
                        <div>
                            <i className="fa-solid fa-xmark text-red-600 bg-gray-100 p-1 rounded-full cursor-pointer hover:bg-red-100" onClick={() => { setTextArea(false); setInput('') }} ></i>
                        </div>

                        <div>
                            <i className="fa-solid fa-check text-green-600 p-1 rounded-full bg-gray-100 cursor-pointer hover:bg-green-100" onClick={handleNoteSubmit}></i>
                        </div>
                    </div>

                </>
            )}

            {!textArea && !User?.notes && (
                <>

                    <div className='mt-4'>
                        <h3 className='text-sm text-gray-600'>Notes help you to keep track of your conversation with your team</h3>
                    </div>
                </>
            )}


            <div className='mt-4 max-h-[150px] overflow-y-auto '>
                {User?.notes?.map((note, index) => (
                    <div key={index} className='mt-2  bg-amber-50 rounded-lg p-2 relative'>
                        <div className=''>

                            <div className=' w-full flex items-center justify-between'>
                                <div className='text-[10px] text-gray-400  text-end'>
                                    {new Date(note.time).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true
                                    })}
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='p-1 rounded-full bg-gray-100 cursor-pointer hover:bg-blue-100' onClick={() => { handleEditNotes(note.text, note.time) }}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.20001 13.0346H13.2M2.80005 13.0346L5.71071 12.4481C5.86522 12.417 6.0071 12.3409 6.11853 12.2294L12.6343 5.71007C12.9467 5.3975 12.9465 4.89084 12.6338 4.57853L11.2536 3.19981C10.941 2.88764 10.4346 2.88785 10.1224 3.20029L3.60589 9.72032C3.49468 9.83159 3.41875 9.97318 3.38758 10.1274L2.80005 13.0346Z" stroke="#505451" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                    </div>

                                    <i
                                        className="fa-solid fa-xmark text-red-600 bg-gray-100 p-1 rounded-full cursor-pointer hover:bg-red-100 "
                                        onClick={() => handleNotesDelete(selectedUser._id, note.time)}
                                    ></i>
                                </div>


                            </div>

                            <div className='font-semibold text-gray-700 text-sm break-all mt-1 w-full'>{note.text}</div>


                        </div>

                    </div>
                ))}

            </div>

        </>
    )
}

export default Notes



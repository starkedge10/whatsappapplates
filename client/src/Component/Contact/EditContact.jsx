import React from 'react'

function EditContact({ setEditPopup, contact }) {



    const handleClose = () => {
        setEditPopup(false);
    }




    return (
        <>
            <div className='fixed inset-0  bg-black/70 z-50 flex items-center justify-center'>


                <div className='bg-white w-[500px] rounded-lg shadow-lg p-4'>

                    <div className='flex justify-between items-center border-b border-gray-300 pb-2'>

                        <div>
                            <h4 className='font-bold text-lg'>{contact.name}</h4>
                        </div>
                        <i
                            className='fa-solid fa-xmark text-2xl cursor-pointer hover:scale-110 text-red-600 '
                            onClick={handleClose}
                        ></i>
                    </div>




                    <div className='mt-6 text-sm'>
                        <h3 className='font-semibold text-gray-900 '>Basic Info</h3>

                        <div className='mt-4 flex flex-col gap-1'>
                            <div className='flex gap-4 mt-1'>
                                <h3 className=' flex-1/2 font-semibold text-gray-500 '>Name :</h3>

                                <p className=' flex-[70%] font-semibold text-gray-700'>{contact.name}</p>
                            </div>


                            <div className='flex gap-4 mt-1'>
                                <h3 className='flex-1/2 font-semibold text-gray-500 '>Phone :</h3>

                                <p className=' flex-[70%] font-semibold text-gray-700'>{contact.phone}</p>
                            </div>


                            <div className='flex gap-4 mt-1'>
                                <h3 className=' flex-1/2 font-semibold text-gray-500'>Source :</h3>

                                <p className=' flex-[70%] font-semibold text-left text-gray-700'>{contact?.source || 'WebChat'}</p>
                            </div>
                        </div>

                    </div>


                    <div className='text-sm'>
                        <h4 className='font-semibold text-gray-800 mt-6 '>Contact Attributes</h4>
                    </div>

                </div>

            </div>
        </>
    )
}

export default EditContact
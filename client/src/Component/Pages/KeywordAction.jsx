import React, { useState } from 'react'
import KeywordsList from '../KeywordsList'
import CreateKeyword from '../CreateKeyword';



function KeywordAction() {

    const [isOpen, setIsOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');




    const handleNewKeyword = () => {
        setEditData(null);
        setIsOpen(true);
    };

    const handleEditKeyword = (data) => {
        setEditData(data);
        setIsOpen(true);
    };





    return (
        <>
            {isOpen ? <CreateKeyword onClose={() => setIsOpen(false)} editData={editData} /> : (
                <>
                    <div className='p-8  mb-[4px] bg-gray-100 flex items-center text-gray-600 justify-between'>
                        <div className='flex items-center gap-12'>
                            <div>
                                <h2 className='text-3xl font-semibold'>Add Keyword Action List</h2>
                                <p className='text-xs mt-2 font-semibold text-gray-600'><span className='font-semibold text-sm text-black'>Note: </span>When the message matches the keyword, automatically reply
                                </p>
                            </div>

                            <div>
                                <form action="" className=''>
                                    <div className='search-bar w-full flex items-center max-w-[500px] relative'>

                                        <i className="fa-solid fa-magnifying-glass absolute right-4 text-gray-400"></i>
                                        <input type="text" className='w-full bg-white rounded-md pl-[10px] pr-[40px] py-[14px] focus:outline-none !font-medium' placeholder='Search here ... '
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)} />

                                    </div>
                                </form>
                            </div>
                        </div>





                        <div>
                            <button type='button ' className='bg-green-600 cursor-pointer text-white text-lg px-4 py-3 rounded-md hover:bg-green-700 transition duration-200' onClick={() => { handleNewKeyword() }}>
                                Add New Keyword
                            </button>
                        </div>
                    </div>


                    <div>
                        <KeywordsList onOpen={() => setIsOpen(true)} onEdit={handleEditKeyword} onSearch={searchTerm} />
                    </div>
                </>
            )}
        </>
    )
}

export default KeywordAction
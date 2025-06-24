import React from 'react'

function NavBar() {
    return (
        <>
            <div className='nav-bar bg-white h-[60px] flex items-center justify-between px-[20px] border-b-1 border-gray-300'>

                <form action="" className='w-[33%]'>
                    <div className='search-bar w-full flex items-center max-w-[500px] relative'>

                        <i className="fa-solid fa-magnifying-glass absolute left-[5px] text-gray-400"></i>
                        <input type="text" className='w-full bg-gray-50 border border-gray-300 rounded-md pl-[30px] pr-[10px] py-[5px] focus:outline-none' placeholder='Search here ... ' />

                    </div>
                </form>


                <ul className='flex items-center justify-around gap-[30px]'>
                    <li><i className="fa-brands fa-whatsapp text-green-400 text-3xl cursor-pointer"></i></li>
                    <li><i className="fa-solid fa-phone text-2xl text-gray-600  cursor-pointer"></i></li>
                    <li><i className="fa-solid fa-bell text-2xl text-gray-600 cursor pointer"></i></li>
                    <li><i className="fa-solid fa-circle-user text-3xl text-gray-600 cursor-pointer" ></i></li>

                </ul>
            </div>
        </>
    )
}

export default NavBar
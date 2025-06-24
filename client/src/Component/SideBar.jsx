import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import togglebtn from '../assets/togglebtn.png';




function SideBar({ isOpen, toggleSidebar }) {
    const [isAutomationOpen, setAutomationOpen] = useState(false);


    const location = useLocation();

    const isAutomationPath = [
        '/keywordAction',
        '/replyMaterial',
        '/chatbot',
        '/rules'
    ].includes(location.pathname);


    useEffect(() => {
        setAutomationOpen(isAutomationPath);
    }, [location.pathname, isAutomationPath]);



    const toggleAutomationDropdown = () => {
        setAutomationOpen(prev => !prev);
    };


    useEffect(() => {
        if (!isOpen) {
            setAutomationOpen(true);
        }
    }, [isOpen]); // Trigger when




    return (
        <div className={`bg-white h-[100vh] ${isOpen ? 'w-[250px]' : 'w-[60px]'} overflow-hidden transition-[width] duration-500 ease-in-out text-nowrap border-r-1 border-gray-300`}>
            <header className='flex items-center justify-between border-b-1 border-gray-300 py-[10px] w-full px-[20px] h-[60px]'>
                <a href="#">
                    <div className={`logo text-black font-bold text-2xl ${isOpen ? 'visible' : 'hidden'}`}>Web <span className='text-green-600'>Chat</span></div>
                </a>

                <img src={togglebtn} alt="" onClick={toggleSidebar} className='w-[26px] h-[26px] cursor-pointer' />
            </header>

            <ul className='side-bar-menu text-gray-500 font-semibold mt-[10px] py-[10px] px-[20px] flex flex-col gap-[20px]'>
                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex items-center gap-2 transition-colors duration-200 ${isActive ? 'text-green-600 font-semibold' : ' hover:text-green-600'}`
                        }
                    >
                        <i className="fa-solid fa-house"></i> <span>Home</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to="/chats"
                        className={({ isActive }) =>
                            `flex items-center gap-2 transition-colors duration-200 ${isActive ? 'text-green-600 font-semibold' : ' hover:text-green-600'}`
                        }
                    >
                        <i className="fa-solid fa-message"></i> <span>Team Inbox</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to="/broadCast"
                        className={({ isActive }) =>
                            `flex items-center gap-2 transition-colors duration-200 ${isActive ? 'text-green-600 font-semibold' : ' hover:text-green-600'}`
                        }
                    >
                        <i className="fa-solid fa-tower-broadcast"></i> <span>BroadCast</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to="/manageTemplates"
                        className={({ isActive }) =>
                            `flex items-center gap-2 transition-colors duration-200 ${isActive ? 'text-green-600 font-semibold' : ' hover:text-green-600'}`
                        }
                    >
                        <i className="fa-solid fa-briefcase"></i> <span>Manage Templates</span>
                    </NavLink>
                </li>

                <li>
                    <div
                        onClick={toggleAutomationDropdown}
                        className="flex items-center justify-between cursor-pointer gap-2 hover:text-green-600 transition-colors duration-200"
                    >
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-gear"></i> <span className='ml-[16px]'>Automation</span>
                        </div>
                        <i className={`fa-solid fa-chevron-${isAutomationOpen ? 'up' : 'down'}`}></i>
                    </div>

                    {/* Dropdown items */}
                    {isAutomationOpen && (
                        <ul className={`' mt-4 flex flex-col gap-4 text-sm transition-all duration-500 ease-in-out'  ${isOpen ? 'ml-10 ' : 'ml-0'}`}>
                            <li>
                                <NavLink to="/keywordAction" className={({ isActive }) =>
                                    `${isActive ? 'text-green-600 font-semibold' : ' hover:text-green-600'}`
                                }>
                                    <i className="fa-solid fa-gears"></i>
                                    <span>Keyword Action</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/replyMaterial" className={({ isActive }) =>
                                    `${isActive ? 'text-green-600 font-semibold' : ' hover:text-green-600'}`
                                }>
                                    <i className="fa-solid fa-reply"></i>
                                    <span>Reply Material</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/chatbot" className={({ isActive }) =>
                                    `${isActive ? 'text-green-600 font-semibold' : ' hover:text-green-600'}`
                                }>

                                    <i className="fa-regular fa-message"></i>
                                    <span>Chatbots</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/rules" className={({ isActive }) =>
                                    `${isActive ? 'text-green-600 font-semibold' : ' hover:text-green-600'}`
                                }>

                                    <i className="fa-solid fa-layer-group"></i>
                                    <span>Rules</span>
                                </NavLink>
                            </li>
                        </ul>
                    )}
                </li>


                <li>
                    <NavLink
                        to="/contact"
                        className={({ isActive }) =>
                            `flex items-center gap-2 transition-colors duration-200 ${isActive ? 'text-green-600 font-semibold' : ' hover:text-green-600'}`
                        }
                    >
                        <i className="fa-regular fa-address-book"></i> <span>Contact</span>
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}

export default SideBar;

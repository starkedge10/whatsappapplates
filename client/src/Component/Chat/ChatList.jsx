import React, { useEffect } from 'react';
import profile_icon from '../../assets/profile_icon.svg';
import { useSelector, useDispatch } from 'react-redux';
import Chat from '../Pages/Chat';
import { fetchContacts } from '../../redux/contacts/contactThunk';
import { fetchAllChats } from '../../redux/chat/chatThunk';
import socket from './socket';


function ChatList({ onSelectUser, selectedUser, onSearch }) {
  const contacts = useSelector((state) => state.contact.contacts);
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.allChats);

  const unreadCounts = useSelector((state) => state.chat.unreadCounts);





  const normalizePhone = (phone) => phone?.replace(/^\+/, '');

  const chatMap = new Map();

  chats.forEach((chat) => {
    const fromPhone = normalizePhone(chat.message.from);
    const toPhone = normalizePhone(chat.message.to);

    if (!fromPhone && !toPhone) return;

    const contact = contacts.find((c) => {
      const cPhone = normalizePhone(c.phone);
      return cPhone === fromPhone || cPhone === toPhone;
    });

    if (!contact) return;

    const keyPhone = fromPhone || toPhone;
    const existing = chatMap.get(keyPhone);

    if (!existing || Number(chat.message.timestamp) > Number(existing.message.timestamp)) {
      chatMap.set(keyPhone, {
        ...chat,
        name: contact.name,
        source: contact.source || '',
      });
    }
  });

  const chatData = Array.from(chatMap.values());





  useEffect(() => {
    socket.on('newMessage', (data) => {
      console.log(data);

      dispatch(fetchAllChats())
      dispatch(fetchContacts())

    });

    return () => {
      socket.off('newMessage');
    };
  }, [selectedUser]);


  socket.onAny((event, data) => {
    console.log(`🔊 Socket event received: ${event}`, data);
  });






  useEffect(() => {
    if (contacts.length === 0) {
      dispatch(fetchContacts())
    }
  }, []);


  useEffect(() => {
    if (chats.length === 0) {
      dispatch(fetchAllChats())
    }
  }, []);




  const filteredChatData = chatData.filter((chat) => {
    const search = onSearch.toLowerCase();
    return (
      chat.name.toLowerCase().includes(search) ||
      chat.phone.includes(onSearch) ||
      chat.source.toLowerCase().includes(search)
    );
  });



  useEffect(() => {
    if (!selectedUser && filteredChatData.length > 0) {
      const firstChat = filteredChatData[0];
      const fromPhone = firstChat.message.from?.replace(/^\+/, '');
      const toPhone = firstChat.message.to?.replace(/^\+/, '');

      const defaultContact = contacts.find(c => {
        const contactPhone = c.phone.replace(/^\+/, '');
        return contactPhone === fromPhone || contactPhone === toPhone;
      });

      if (defaultContact) onSelectUser(defaultContact);
    }
  }, [selectedUser, filteredChatData, contacts, onSelectUser]);


  const handleClick = (chat) => {
    const fromPhone = normalizePhone(chat.message.from);
    const toPhone = normalizePhone(chat.message.to);

    if (!fromPhone && !toPhone) return;

    const contact = contacts.find(c =>
      normalizePhone(c.phone) === fromPhone || normalizePhone(c.phone) === toPhone
    );

    if (contact) {
      onSelectUser(contact);
    }
  };






  return (
    <ul className='mx-2'>
      {filteredChatData.map((chat) => {
        const phone = chat.message?.from?.replace(/^\+/, "");
        const unread = unreadCounts[phone] || 0;
        const isSelected = selectedUser?.phone.replace(/^\+/, '') === chat.message?.from ||
          selectedUser?.phone.replace(/^\+/, '') === chat.message?.to?.replace(/^\+/, '');

        return (
          <li
            key={chat.message.from}
            onClick={() => handleClick(chat)}
            className={`cursor-pointer hover:bg-green-50  rounded-lg px-2 ${isSelected ? 'bg-green-100 drop-shadow-xl ' : ''}`}
          >
            <div className='flex justify-between items-stretch h-[60px]'>
              <div className='flex items-center flex-grow'>
                <img src={profile_icon} alt="Profile" />
                <div className='ml-[10px] flex flex-col justify-center  w-full h-full'>
                  <h2 className='UserName font-semibold'>{chat.name}</h2>
                  {chat.message && (
                    <p className='text-gray-500 font-semibold text-xs'>{chat.message.text?.body}</p>
                  )}
                </div>
              </div>
              <div className='flex flex-col gap-1 justify-center items-end pl-2 '>


                <div className=' flex  items-cen'>

                  {unread > 0 && !isSelected && (
                    <span className='text-white text-sm font-bold bg-green-500 rounded-full px-[7px] '>
                      {unread}
                    </span>
                  )}

                </div>


                <p className='timeStamp text-gray-500 text-xs font-semibold'>
                  {chat.message?.timestamp &&
                    new Date(chat.message.timestamp * 1000).toLocaleString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                    })}
                </p>
              </div>
            </div>
          </li>
        );
      })}

    </ul>
  );
}

export default ChatList;

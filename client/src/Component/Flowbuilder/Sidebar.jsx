import React from 'react'

function Sidebar({ onAddNode }) {
    return (
        <>
            <div className='p-4 flex flex-col gap-4'>


                <div className='bg-[#E25866] rounded-sm p-3 text-white font-semibold flex cursor-pointer ' onClick={() => onAddNode('Message', 'message')} >
                    <div className='max-w-[150px]'>
                        <h3>Send a message</h3>
                        <p className='text-xs font-medium mt-2'>With no response required from visitor</p>
                    </div>

                    <div className='float-right' >
                        <span className='  bg-gray-50/30 p-3 flex items-center justify-center rounded-full'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" height="26" width="26">
                                <path fill="white" d="M10.0939 3.60187C6.871 4.3305 4.34214 6.80736 3.56626 9.99529C3.142 11.7385 3.14588 13.5727 3.57014 15.3159C4.35814 18.5537 6.67613 21.2483 9.78568 22.5039L9.92122 22.5586C11.2668 23.1019 12.8083 22.4476 13.3605 21.1143C13.5124 20.7474 13.8743 20.504 14.2741 20.504H15.4915C18.8028 20.504 21.6833 18.2541 22.4605 15.0606C22.8465 13.4747 22.8465 11.8205 22.4605 10.2347L22.3586 9.81595C21.6095 6.73788 19.1678 4.34638 16.0559 3.64286L15.6188 3.54403C13.8847 3.15199 12.0839 3.15199 10.3498 3.54403L10.0939 3.60187ZM9.21044 9.06391C8.79359 9.06391 8.45568 9.39918 8.45568 9.81275C8.45568 10.2263 8.79359 10.5616 9.21044 10.5616H16.1291C16.546 10.5616 16.8839 10.2263 16.8839 9.81275C16.8839 9.39918 16.546 9.06391 16.1291 9.06391H9.21044ZM10.4684 12.8081C10.0515 12.8081 9.71362 13.1434 9.71362 13.5569C9.71362 13.9705 10.0515 14.3058 10.4684 14.3058H14.8712C15.288 14.3058 15.6259 13.9705 15.6259 13.5569C15.6259 13.1434 15.288 12.8081 14.8712 12.8081H10.4684Z" clip-rule="evenodd" fill-rule="evenodd"></path>
                            </svg>
                        </span>
                    </div>
                </div>



                <div className='bg-[#F79431] rounded-sm p-3 text-white font-semibold flex cursor-pointer ' onClick={() => onAddNode('Question', 'question')}>
                    <div className='max-w-[150px]'>
                        <h3>Buttons</h3>
                        <p className='text-xs font-medium mt-2'>Choices based on buttons (Maximum of 3 choices)</p>
                    </div>

                    <div className='float-right' >
                        <span className='  bg-gray-50/30 p-3 flex items-center justify-center rounded-full'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" height="26" width="26">
                                <path fill="white" d="M3.62234 9.78223C3.12589 11.8987 3.12589 14.1013 3.62234 16.2178C4.33929 19.2742 6.72578 21.6607 9.78222 22.3777C11.8987 22.8741 14.1013 22.8741 16.2178 22.3777C19.2742 21.6607 21.6607 19.2742 22.3777 16.2178C22.8741 14.1013 22.8741 11.8987 22.3777 9.78223C21.6607 6.72578 19.2742 4.33928 16.2178 3.62234C14.1013 3.12589 11.8987 3.12589 9.78223 3.62234C6.72578 4.33928 4.33928 6.72578 3.62234 9.78223ZM13.8296 16.4742C13.8296 16.9038 13.4814 17.252 13.0518 17.252C12.6222 17.252 12.274 16.9038 12.274 16.4742C12.274 16.0447 12.6222 15.6964 13.0518 15.6964C13.4814 15.6964 13.8296 16.0447 13.8296 16.4742ZM11.5481 10.8222C11.5481 10.0204 12.1981 9.37035 13 9.37035C13.8018 9.37035 14.4519 10.0204 14.4519 10.8222V10.9481C14.4519 11.3665 14.2856 11.7678 13.9898 12.0637L12.56 13.4934C12.317 13.7364 12.317 14.1304 12.56 14.3734C12.803 14.6164 13.197 14.6164 13.44 14.3734L14.8697 12.9436C15.399 12.4144 15.6963 11.6965 15.6963 10.9481V10.8222C15.6963 9.33308 14.4891 8.12588 13 8.12588C11.5108 8.12588 10.3036 9.33308 10.3036 10.8222V11.3408C10.3036 11.6844 10.5822 11.963 10.9259 11.963C11.2695 11.963 11.5481 11.6844 11.5481 11.3408V10.8222Z" clip-rule="evenodd" fill-rule="evenodd"></path>
                            </svg>
                        </span>
                    </div>
                </div>




                <div className='bg-[#6C7ED6] rounded-sm p-3 text-white font-semibold flex  cursor-pointer' onClick={() => onAddNode('Template', 'template')}>
                    <div className='max-w-[150px]'>
                        <h3>Send a Template</h3>
                        <p className='text-xs font-medium mt-2'>Send message(s) based on Template</p>
                    </div>

                    <div className='float-right' >
                        <span className='  bg-gray-50/30 p-3 flex items-center justify-center rounded-full'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" height="26" width="26">
                                <path fill="white" d="M23.6947 2.6237C23.6947 2.6237 16.2622 6.41609 12.4867 8.1894C13.2955 8.92798 14.0478 9.7246 14.8282 10.4924C10.9897 14.3821 12.9911 12.4319 9.15262 16.3215C9.4341 16.5902 9.71536 16.8587 9.99686 17.1273C13.8353 13.2376 11.834 15.1882 15.6724 11.2986C16.4543 12.0777 17.2318 12.8612 18.0139 13.6401C20.0305 9.66858 23.6947 2.6237 23.6947 2.6237V2.6237Z"></path>
                                <path stroke-linecap="square" stroke-width="0.994363" stroke="white" fill="white" d="M9.10888 21.6214L3.80789 22.4837L4.67003 17.1824L9.97105 16.3205L9.10888 21.6214Z"></path>
                            </svg>
                        </span>
                    </div>
                </div>


            </div>
        </>
    )
}

export default Sidebar
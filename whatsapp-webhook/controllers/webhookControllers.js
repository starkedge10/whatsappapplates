import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import chat from '../models/chat.js';
import Contacts from "../models/contacts.js";



const testing_chatbot = {
    name: "testing_chatbot",
    language: {
        code: "en_US"
    },
    components: [
        {
            type: "HEADER",
            parameters: [
                {
                    type: "text",
                    text: "Stark Edge",
                    parameter_name: "company_name"
                }
            ]
        },
        {
            type: "BODY",
            parameters: [
                {
                    type: "text",
                    text: "Stark Edge",
                    parameter_name: "name"
                }
            ]
        },
    ]
};




const url = "https://script.google.com/macros/s/AKfycbyVTLMEeDrWpct8HRDNLig1WOFp49w_JIOzUZiw5sTJrzcycZBUqkovD_EKYHpwaJbA3A/exec";

const fetchContacts = async () => {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        console.log("Full contact data:", JSON.stringify(data, null, 2));

        // do something with data
    } catch (err) {
        console.error("Failed to fetch contacts", err);
        // Optionally use toast or alert
        // toast.error("Failed to fetch contacts");
    }
};

fetchContacts();






export function verifyWebhook(req, res) {
    console.log('Received verification request:', req.query);


    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('Verification request:', { mode, token, challenge });

    if (token === process.env.VERIFY_TOKEN) {
        console.log('Webhook verified!');
        return res.status(200).send(challenge);
    } else {
        console.error('Verification failed');
        return res.status(403).send('Verification failed');
    }
}




async function sendTemplateMessage(to, template, languageCode = 'en_US') {
    const url = `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`;

    const data = {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: template
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Template message sent:', response.data);
    } catch (error) {
        console.error('Failed to send template message:', error.response?.data || error.message);
    }
}


export async function sendSimpleTextMessage(to, text) {
    const url = `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`;

    const data = {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: {
            body: text
        }
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        console.log("Text message sent:", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to send text message:", error.response?.data || error.message);
        throw error;
    }
}



// export async function sendTextMessages(req, res) {
//     console.log(req.body);
//     const payload = req.body;

//     try {
//         const response = await axios.post(
//             `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
//             payload,
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
//                     "Content-Type": "application/json",
//                 },
//             }
//         );
//         res.status(200).json(response.data);
//     } catch (error) {
//         console.error("Error sending message:", error.response?.data || error.message);
//         res.status(500).json({ error: error.response?.data || error.message });
//     }

// }




// export async function sendTemplateMessages(req, res) {
//     const { to, template } = req.body;

//     const url = `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`;

//     const data = {
//         messaging_product: 'whatsapp',
//         to,
//         type: 'template',
//         template
//     };

//     try {
//         const response = await axios.post(url, data, {
//             headers: {
//                 Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
//                 'Content-Type': 'application/json'
//             }
//         });

//         console.log('Template sent:', response.data);
//         res.status(200).json(response.data);
//     } catch (error) {
//         console.error('Failed to send template:', error.response?.data || error.message);
//         res.status(500).json({ error: error.response?.data || error.message });
//     }
// }





async function getMediaUrl(mediaId) {
    const url = `https://graph.facebook.com/v13.0/${mediaId}`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`
            }
        });
        return response.data.url;
    } catch (error) {
        console.error('Error retrieving media URL:', error);
        return null;
    }
}


const fetchImage = async (mediaId) => {
    console.log(mediaId);

    const response = await axios.get(`https://graph.facebook.com/v15.0/${mediaId}`, {
        headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`
        }
    })


    const url = response.data.url;


    const imageRes = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`
        },
        responseType: 'arraybuffer'
    });

    const contentType = imageRes.headers['content-type'];



    return {
        base64: Buffer.from(imageRes.data).toString('base64'),
        contentType
    };



}


export async function handleWebhook(req, res) {
    const body = req.body;
    const io = req.app.get('io');
    


    if (!body.entry || !body.entry[0].changes) {
        console.error('Invalid webhook structure:', body);
        return res.sendStatus(400);
    }

    const change = body.entry[0].changes[0];
    const message = change?.value?.messages?.[0];
    const contact = change?.value?.contacts?.[0];
    const statusUpdate = change?.value?.statuses?.[0];
    const contactInfo = body.entry[0].changes[0]?.value?.contacts?.[0];

    if (message && contactInfo) {

        


        if (message.type === 'image' && message.image?.id) {
            const mediaId = message.image.id;

            try {

                const { base64, contentType } = await fetchImage(mediaId);
                message.image.url = `data:${contentType};base64,${base64}`;

            } catch (error) {
                console.error('Error fetching image from WhatsApp:', error);
            }
        }


        if (message.type === 'video' && message.video?.id) {
            const mediaId = message.video.id
            try {
                const { base64, contentType } = await fetchImage(mediaId);

                message.video.url = `data:${contentType};base64,${base64}`;
            } catch (error) {
                console.error('Error fetching video from WhatsApp:', error);
            }
        }

        if (message.type === 'audio' && message.audio?.id) {
            const mediaId = message.audio.id

            try {
                const { base64, contentType } = await fetchImage(mediaId);

                message.audio.url = `data:${contentType};base64,${base64}`;
            } catch (error) {
                console.error('Error fetching audio from WhatsApp:', error);
            }
        }

        if (message.type === 'document' && message.document?.id) {
            const mediaId = message.document.id

            try {
                const { base64, contentType } = await fetchImage(mediaId);

                message.document.url = `data:${contentType};base64,${base64}`;

            } catch (error) {
                console.error('Error fetching document from WhatsApp:', error);
            }
        }


        const sender = `+${message.from}`;

        const existingContact = await Contacts.findOne({ phone: sender });


        if (!existingContact) {
            const newContact = new Contacts({
                name: contactInfo.profile?.name || sender,
                phone: sender,
            })
            try {
                await newContact.save();
            } catch (err) {
                console.error('Error saving contact:', err);
            }

        }



        const chatDoc = new chat({
            message: message,
            messageType: 'received',
        });

        try {
            await chatDoc.save();
            console.log(chatDoc)
            io.emit('newMessage', chatDoc);
        } catch (err) {
            console.error('Error saving message:', err);
        }

        // const senderId = message.from;
        // const messageId = message.id;
        // const messageType = message.type;
        // const senderName = contact?.profile?.name || "Unknown";


        //     if (messageType === 'text') {
        //         const textContent = message.text.body;
        //         if (textContent.toLowerCase() === 'hey' || textContent.toLowerCase() === 'hi') {
        //             console.log("keyword mattched")
        //             await sendTemplateMessage(senderId, testing_chatbot);
        //         }


        //         console.log(`Received text message: ${textContent}`);
        //     } else if (messageType === 'audio') {
        //         const audioId = message.audio.id;
        //         console.log(`Received audio message with ID: ${audioId}`);
        //         const mediaUrl = await getMediaUrl(audioId);
        //         if (mediaUrl) {
        //             console.log(`Audio message URL: ${mediaUrl}`);
        //         }
        //     } else if (messageType === 'button') {

        //         const textContent = message.button.text;

        //         if (textContent.toLowerCase() === 'sure') {
        //             await sendSimpleTextMessage(senderId, "We will reach you soon on Call");
        //         }

        //     } else {
        //         console.log(`Received unsupported message type: ${messageType}`);
        //     }
    }

    if (statusUpdate) {

        const { status, id, timestamp, recipient_id } = statusUpdate;

        if (['delivered', 'read'].includes(status)) {
            const updated = await chat.findOneAndUpdate(
                { "message.messageId": id },
                {
                    $set: {
                        "messageType": status,
                    }
                },
                { new: true }
            );

            if (updated) {


                io.emit('messageStatusUpdate', {
                    messageId: id,
                    status,
                });
            }
        }
    }


    res.sendStatus(200);
}


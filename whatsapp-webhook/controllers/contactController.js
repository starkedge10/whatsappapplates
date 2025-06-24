import Contacts from "../models/contacts.js";

// Fetch all contacts
export const fetchContacts = async (req, res) => {
    try {
        const contacts = await Contacts.find();
        res.status(200).json(contacts);
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ message: "Failed to fetch contacts" });
    }
};

// Create a new contact
export const createContact = async (req, res) => {
    try {

        const contactData = await Contacts.create(req.body);
        res.status(201).json(contactData);
    } catch (error) {
        console.error("Error creating contact:", error);
        res.status(500).json({ message: "Failed to create contact" });
    }
};
export const updateContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contactData = await Contacts.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(contactData);
    } catch (error) {
        console.error("Error updating contact:", error);
        res.status(500).json({ message: "Failed to update contact", error: error.message });
    }
};


// Delete a contact
export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contactData = await Contacts.findByIdAndDelete(id);
        res.status(200).json(contactData);
    } catch (error) {
        console.error("Error deleting contact:", error);
        res.status(500).json({ message: "Failed to delete contact" });
    }
};


// Add tags to a contact
export const addTags = async (req, res) => {
    try {
        const { id } = req.params;
        const { tags } = req.body;
        const contactData = await Contacts.findByIdAndUpdate(id, { $push: { tags: { $each: tags } } }, { new: true });
        res.status(200).json(contactData);
    } catch (error) {
        console.error("Error adding tags:", error);
        res.status(500).json({ message: "Failed to add tags" });
    }
};

export const removeTags = async (req, res) => {
    try {
        const { id } = req.params;
        const { tag } = req.body;
        const contactData = await Contacts.findByIdAndUpdate(id, { $pull: { tags: tag } }, { new: true });
        res.status(200).json(contactData);
    } catch (error) {
        console.error("Error removing tags:", error);
        res.status(500).json({ message: "Failed to remove tags" });
    }
};

export const addNotes = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;
        const notesData = await Contacts.findByIdAndUpdate(id, { $push: { notes: notes } }, { new: true });
        res.status(200).json(notesData);
    } catch (error) {
        console.error("Error adding notes:", error);
        res.status(500).json({ message: "Failed to add notes   " });
    }

}
export const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { updatedNote } = req.body;
        const notesData = await Contacts.findByIdAndUpdate(id, { $set: { notes: updatedNote } }, { new: true });
        res.status(200).json(notesData);
    } catch (error) {
        console.error("Error updating notes:", error);
        res.status(500).json({ message: "Failed to update notes" });
    }
}


export const removeNotes = async (req, res) => {
    try {
        const { id } = req.params;
        const { time } = req.body;
        const notesData = await Contacts.findByIdAndUpdate(id, { $pull: { notes: { time } } }, { new: true });
        res.status(200).json(notesData);
    } catch (error) {
        console.error("Error removing notes:", error);
        res.status(500).json({ message: "Failed to remove notes" });
    }
};
import { Router } from 'express';
const router = Router();

import { createContact, fetchContacts, updateContact, deleteContact, addTags, removeTags, addNotes, updateNote, removeNotes } from '../controllers/contactController.js';


router.get('/contacts', fetchContacts)
router.post('/addContacts', createContact)
router.put('/updateContact/:id', updateContact)
router.delete('/deleteContact/:id', deleteContact)
router.patch('/contacts/:id/addTags', addTags)
router.patch('/contacts/:id/tags/remove', removeTags)
router.patch('/contacts/:id/addNotes', addNotes)
router.patch('/contacts/:id/notes/remove', removeNotes)
router.patch('/contacts/:id/notes/update', updateNote)



export default router;

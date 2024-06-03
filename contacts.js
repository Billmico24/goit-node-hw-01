const fs = require('fs').promises;
const path = require('path');

// Define the path to the contacts.json file using __dirname for reliability
const contactsPath = path.join(__dirname, 'db', 'contacts.json');

/**
 * Lists all contacts.
 * @returns {Promise<Array>} A promise that resolves to an array of contacts.
 */
async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading contacts file:', error);
    return [];
  }
}

/**
 * Gets a contact by ID.
 * @param {string} contactId - The ID of the contact to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves to the contact object if found, or null if not found.
 */
async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find(c => c.id === contactId);
    return contact || null;
  } catch (error) {
    console.error('Error retrieving contact:', error);
    return null;
  }
}

/**
 * Removes a contact by ID.
 * @param {string} contactId - The ID of the contact to remove.
 * @returns {Promise<void>}
 */
async function removeContact(contactId) {
  try {
    let contacts = await listContacts();
    console.log('Contacts before removal:', contacts); // Debugging statement

    // Convert contactId to a string for comparison
    const contactExists = contacts.some(c => c.id === String(contactId));
    
    if (!contactExists) {
      console.log(`Contact with ID ${contactId} not found.`);
      return;
    }

    // Filter out the contact by ID
    contacts = contacts.filter(c => c.id !== String(contactId));
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    console.log('Contacts after removal:', contacts); // Debugging statement
    console.log(`Contact with ID ${contactId} removed successfully.`);
  } catch (error) {
    console.error('Error removing contact:', error);
  }
}

/**
 * Adds a new contact.
 * @param {string} name - The name of the new contact.
 * @param {string} email - The email of the new contact.
 * @param {string} phone - The phone number of the new contact.
 * @returns {Promise<void>}
 */
async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const newContact = {
      id: Date.now().toString(), // Simple unique ID based on timestamp
      name,
      email,
      phone
    };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  } catch (error) {
    console.error('Error adding contact:', error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact
};

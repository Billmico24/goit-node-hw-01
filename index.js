import { listContacts, getContactById, addContact, removeContact } from './contacts.mjs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).argv;

async function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case 'list':
      const allContacts = await listContacts();
      console.table(allContacts);
      break;

    case 'get':
      if (id) {
        const contact = await getContactById(id);
        console.log(contact ? `Contact with ID ${id}:` : 'Contact not found');
        console.log(contact);
      } else {
        console.error('Please provide a valid ID');
      }
      break;

    case 'add':
      if (name && email && phone) {
        await addContact(name, email, phone);
        console.log(`Added contact: ${name}`);
      } else {
        console.error('Please provide name, email, and phone');
      }
      break;

    case 'remove':
      if (id) {
        await removeContact(id);
        console.log(`Removed contact with ID ${id}`);
      } else {
        console.error('Please provide a valid ID');
      }
      break;

    default:
      console.warn('\x1B[31m Unknown action type!');
  }
}

invokeAction(argv).catch(console.error);

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { uuid } from 'uuidv4';
import api from '../api/contacts';
import './App.css';
import Header from './Header';
import AddContact from './AddContact';
import ContactList from './ContactList';
import ContactDetails from './ContactDetails';
import EditContacts from './EditContacts';

function App() {
  // const LOCAL_STORAGE_KEY = 'contacts'
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  // retrieveContacts
  const retriveContacts = async () => {
    const response = await api.get('/contacts');
    return response.data;
  }

  // Add Contact
  const addContactHandler = async (contact) => {
    console.log(contact);
    const request = {
      id: uuid(),
      ...contact,
    }
    const response = await api.post("/contacts", request);
    console.log(response);
    setContacts([...contacts, response.data])
  }

  // Update Contact
  const updateContactHandler = async (contact) => {
    const response = await api.put(`/contacts/${contact.id}`, contact);
    console.log(response.data);
    const { id } = response.data
    setContacts(
      contacts.map((contact) => {
        return contact.id === id ? { ...response.data } : contact;
      })
    );
  }

  // Delete Contact
  const removeContactList = async (id) => {
    await api.delete(`/contacts/${id}`);
    const newContactList = contacts.filter((contact) => {
      return contact.id !== id;
    })
    setContacts(newContactList);
  }

  // Search Contact
  const searchHandler = (searchTerm) => {
    console.log(searchTerm);
    setSearchTerm(searchTerm);
    if (searchTerm !== '') {
      const newContactList = contacts.filter((contact) => {
        // console.log(Object.values(contact).join('').toLowerCase().includes(searchTerm.toLowerCase));
        return Object.values(contact)
          .join('')
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
      setSearchResult(newContactList)
    } else {
      setSearchResult(contacts)
    }
  }

  // Retreate data from local storage
  useEffect(() => {
    // const retriveContacts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    // if (retriveContacts) setContacts(retriveContacts);
    const getAllContacts = async () => {
      const allContacts = await retriveContacts();
      if (allContacts) setContacts(allContacts);
    }
    getAllContacts();
  }, [])

  // Render the Component Again
  useEffect(() => {
    // localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts))
  }, [contacts])

  return (
    <div className=" ui container">
      <Router>
        <Header />
        <Switch>
          <Route path="/add"
            render={(props) => (
              <AddContact
                {...props}
                addContactHandler={addContactHandler} />
            )}
          />
          <Route path="/edit"
            render={(props) => (
              <EditContacts
                {...props}
                updateContactHandler={updateContactHandler} />
            )}
          />
          <Route path="/" exact
            render={(props) => (
              <ContactList
                {...props}
                contacts={searchTerm.length < 1 ? contacts : searchResult}
                getContactId={removeContactList}
                term={searchTerm}
                searchKeyword={searchHandler}
              />
            )}
          />
          <Route path="/contact/:id" component={ContactDetails} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;





import { v1 as uuid } from 'uuid';
import clientData from '../../data/clients';
import { NewClient, PublicClient, Client, EntryWithoutId } from '../types';

const removeSensitiveData = (client: Client): PublicClient => {
  const { id, name, dateOfBirth, gender, occupation } = client;
  return { id, name, dateOfBirth, gender, occupation };
};

const getPublicClientData = (): Array<PublicClient> => {
  return clientData.map(client => removeSensitiveData(client));
};

const addClient = (newClient: NewClient): Client => {
  const client: Client = {
    id: uuid(),
    ...newClient
  };
  clientData.push(client);
  return client;
};

const getClient = (id: string): Client | undefined => {
  return clientData.find(client => client.id === id);
};

const addClientEntry = (id: string, entry: EntryWithoutId): Client | undefined => {
  const entryId = uuid();
  const newEntry = { ...entry, id: entryId };
  const client = clientData.find(client => client.id === id);
  if (client) {
    client.entries.push(newEntry);
  }
  return client;
};

export default {
  getPublicClientData,
  addClient,
  getClient,
  addClientEntry
};

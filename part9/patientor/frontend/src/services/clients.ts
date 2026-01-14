import axios from "axios";
import { EntryFormValues, Client, ClientFormValues } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Client[]>(`${apiBaseUrl}/clients`);

  return data;
};

const getById = async (id: string | undefined) => {
  const { data } = await axios.get<Client>(`${apiBaseUrl}/clients/${id}`);

  return data;
};

const create = async (object: ClientFormValues) => {
  const { data } = await axios.post<Client>(`${apiBaseUrl}/clients`, object);

  return data;
};

const addEntry = async (id: string | undefined, object: EntryFormValues) => {
  const { data } = await axios.post<Client>(
    `${apiBaseUrl}/clients/${id}/entries`,
    object
  );

  return data;
};

export default {
  getAll,
  getById,
  create,
  addEntry,
};

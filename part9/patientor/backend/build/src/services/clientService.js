"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const clients_1 = __importDefault(require("../../data/clients"));
const removeSensitiveData = (client) => {
    const { id, name, dateOfBirth, gender, occupation } = client;
    return { id, name, dateOfBirth, gender, occupation };
};
const getPublicClientData = () => {
    return clients_1.default.map(client => removeSensitiveData(client));
};
const addClient = (newClient) => {
    const client = Object.assign({ id: (0, uuid_1.v1)() }, newClient);
    clients_1.default.push(client);
    return client;
};
const getClient = (id) => {
    return clients_1.default.find(client => client.id === id);
};
const addClientEntry = (id, entry) => {
    const entryId = (0, uuid_1.v1)();
    const newEntry = Object.assign(Object.assign({}, entry), { id: entryId });
    const client = clients_1.default.find(client => client.id === id);
    if (client) {
        client.entries.push(newEntry);
    }
    return client;
};
exports.default = {
    getPublicClientData,
    addClient,
    getClient,
    addClientEntry
};

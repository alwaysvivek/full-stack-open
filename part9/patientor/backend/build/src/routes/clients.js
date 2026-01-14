"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clientService_1 = __importDefault(require("../services/clientService"));
const utils_1 = require("../utils");
const router = express_1.default.Router();
router.get("/", (_req, res) => {
    const clientData = clientService_1.default.getPublicClientData();
    res.json(clientData);
});
router.get("/:id", (req, res) => {
    const client = clientService_1.default.getClient(req.params.id);
    if (client) {
        res.json(client);
    }
    else {
        res.status(404).send({ Error: "client not found" });
    }
});
router.post("/", (req, res) => {
    try {
        const newClient = (0, utils_1.toNewClient)(req.body);
        const returnedClient = clientService_1.default.addClient(newClient);
        res.json(returnedClient);
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(400).send({ Error: `${e.message}` });
        }
        else {
            res.status(400).send({ Error: "unknown error" });
        }
    }
});
router.post("/:id/entries", (req, res) => {
    try {
        const id = req.params.id;
        const newEntry = (0, utils_1.toEntry)(req.body);
        const client = clientService_1.default.addClientEntry(id, newEntry);
        if (client) {
            res.json(client);
        }
        else {
            res.status(404).send({ Error: "client not found" });
        }
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(400).send({ Error: `${e.message}` });
        }
        else {
            res.status(400).send({ Error: "unknown error" });
        }
    }
});
exports.default = router;

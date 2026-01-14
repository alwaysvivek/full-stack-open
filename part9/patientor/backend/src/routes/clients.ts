import express from "express";
import clientService from "../services/clientService";
import { toEntry, toNewClient } from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  const clientData = clientService.getPublicClientData();
  res.json(clientData);
});

router.get("/:id", (req, res) => {
  const client = clientService.getClient(req.params.id);
  if (client) {
    res.json(client);
  }
  else {
    res.status(404).send({ Error: "client not found" });
  }
});

router.post("/", (req, res) => {
  try {
    const newClient = toNewClient(req.body);
    const returnedClient = clientService.addClient(newClient);
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
    const newEntry = toEntry(req.body);
    const client = clientService.addClientEntry(id, newEntry);
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

export default router;

import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Button, Divider, Container, Typography } from '@mui/material';

import { apiBaseUrl } from "./constants";
import { Client, MedicalCondition } from "./types";

import clientService from "./services/clients";
import medicalConditionService from "./services/medicalConditions";
import ClientListPage from "./components/ClientListPage";
import ClientPage from "./components/ClientPage";

const App = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [medicalConditions, setMedicalConditions] = useState<MedicalCondition[]>([]);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchClientList = async () => {
      const clients = await clientService.getAll();
      setClients(clients);
    };
    void fetchClientList();

    const fetchMedicalConditionList = async () => {
      const medicalConditions = await medicalConditionService.getAll();
      setMedicalConditions(medicalConditions);
    };
    void fetchMedicalConditionList();
  }, []);

  return (
    <div className="App">
      <Router>
        <Container>
          <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider hidden />
          <Routes>
            <Route path="/" element={<ClientListPage clients={clients} setClients={setClients} />} />
            <Route path="/clients/:id" element={<ClientPage diagnoses={medicalConditions} />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;

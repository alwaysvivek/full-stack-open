import { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Table, Button, TableHead, Typography, TableCell, TableRow, TableBody } from '@mui/material';
import axios from 'axios';

import { ClientFormValues, Client } from "../../types";
import AddClientModal from "../AddClientModal";

import HealthRatingBar from "../HealthRatingBar";

import clientService from "../../services/clients";

interface Props {
  clients: Client[]
  setClients: React.Dispatch<React.SetStateAction<Client[]>>
}

const ClientListPage = ({ clients, setClients }: Props) => {

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewClient = async (values: ClientFormValues) => {
    try {
      const client = await clientService.create(values);
      setClients(clients.concat(client));
      setModalOpen(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  return (
    <div className="App">
      <Box>
        <Typography align="center" variant="h6">
          Client list
        </Typography>
      </Box>
      <Table style={{ marginBottom: "1em" }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Occupation</TableCell>
            <TableCell>Health Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(clients).map((client: Client) => (
            <TableRow key={client.id}>
              <TableCell>
                <Link to={`/clients/${client.id}`}>{client.name}</Link>
              </TableCell>
              <TableCell>{client.gender}</TableCell>
              <TableCell>{client.occupation}</TableCell>
              <TableCell>
                <HealthRatingBar showText={false} rating={1} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AddClientModal
        modalOpen={modalOpen}
        onSubmit={submitNewClient}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Client
      </Button>
    </div>
  );
};

export default ClientListPage;

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Alert, Box, Button, ButtonGroup, Stack, CircularProgress, Typography } from "@mui/material";
import { Work, LocalHospital, HealthAndSafety, Favorite, Male, Female } from '@mui/icons-material';
import AddEntryForm from "./AddEntryForm";
import clientService from "../../services/clients";
import { MedicalCondition, Client, Entry, EntryFormValues, EntryType } from "../../types";
import { assertNever } from "../../utils";

interface ClientPageProps {
  diagnoses: MedicalCondition[];
}

interface EntryDetailsProps {
  diagnoses: MedicalCondition[];
  entry: Entry;
}

interface MedicalConditionListProps {
  diagnoses: MedicalCondition[];
  entry: Entry;
}

interface HealthRatingBarProps {
  rating: number;
}

const HealthRatingBar = ({ rating }: HealthRatingBarProps) => {
  switch (rating) {
    case 0:
      return <Favorite style={{ color: "#00cc00" }} />;
    case 1:
      return <Favorite style={{ color: "#ffff00" }} />
    case 2:
      return <Favorite style={{ color: "#ff6600" }} />
    case 3:
      return <Favorite style={{ color: "#ff0000" }} />
    default:
      return null;
  }
}

const MedicalConditionList = ({ diagnoses, entry }: MedicalConditionListProps) => {
  if (!entry.diagnosisCodes || entry.diagnosisCodes.length === 0) {
    return null;
  }

  return (
    <ul>
      {entry.diagnosisCodes.map((code) => {
        const matchingDiagnosis = diagnoses.find((d) => d.code === code);
        return (
          <li key={code}>
            {code} {matchingDiagnosis ? matchingDiagnosis.name : null}
          </li>
        );
      })}
    </ul>
  );
};

const EntryDetails = ({ diagnoses, entry }: EntryDetailsProps) => {
  switch (entry.type) {
    case EntryType.Hospital:
      return (
        <div>
          <Typography variant="body1">
            {entry.date} <LocalHospital />
          </Typography>
          <Typography variant="body1">
            <em>{entry.description}</em>
          </Typography>
          <Typography variant="body1">
            Discharge: {entry.discharge.date} {entry.discharge.criteria}
          </Typography>
          <MedicalConditionList diagnoses={diagnoses} entry={entry} />
          <Typography variant="body1">
            diagnose by {entry.specialist}
          </Typography>
        </div>
      )
    case EntryType.HealthCheck:
      return (
        <div>
          <Typography variant="body1">
            {entry.date} <HealthAndSafety />
          </Typography>
          <Typography variant="body1">
            <em>{entry.description}</em>
          </Typography>
          <HealthRatingBar rating={entry.healthCheckRating} />
          <MedicalConditionList diagnoses={diagnoses} entry={entry} />
          <Typography variant="body1">
            diagnose by {entry.specialist}
          </Typography>
        </div>
      );
    case EntryType.OccupationalHealthcare:
      return (
        <div>
          <Typography variant="body1">
            {entry.date} <Work /> {entry.employerName}
          </Typography>
          <Typography variant="body1">
            <em>{entry.description}</em>
          </Typography>
          {entry.sickLeave && (
            <Typography variant="body1">
              Sick Leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
            </Typography>
          )}
          <MedicalConditionList diagnoses={diagnoses} entry={entry} />
          <Typography variant="body1">
            diagnose by {entry.specialist}
          </Typography>
        </div>
      );
    default:
      return assertNever(entry);
  }
}

const ClientPage = ({ diagnoses }: ClientPageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [client, setClient] = useState<Client>();
  const [error, setError] = useState<string>();
  const { id } = useParams<{ id: string }>();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showEntryOptions, setShowEntryOptions] = useState<boolean>(false);
  const [entryType, setEntryType] = useState<EntryType>();

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const client = await clientService.getById(id);
        setClient(client);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    }
    fetchClient();
  }, [id]);

  const toggleForm = () => {
    setShowForm(!showForm);
    setError(undefined);
  }

  const handleSelectingEntryType = (entryType: EntryType) => {
    setEntryType(entryType);
    setShowEntryOptions(false);
    setShowForm(true);
  }

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const client = await clientService.addEntry(id, values);
      setClient(client);
      toggleForm();
    }
    catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data?.Error && typeof e?.response?.data.Error === "string") {
          const message = e.response.data.Error
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

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="30vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!client) {
    return (
      <div>
        <Box sx={{ mt: 4 }} >
          <Typography variant="h5">
            Client not found
          </Typography>
        </Box>
      </div>
    )
  }

  return (
    <div>
      <Box sx={{ mt: 4 }} >
        <Typography variant="h5" sx={{ mb: 3 }}>
          {client.name}
          {client.gender === "male" && <Male />}
          {client.gender === "female" && <Female />}
        </Typography>
        <Typography variant="body1">
          ssn: {client.ssn}
        </Typography>
        <Typography variant="body1">
          occupation: {client.occupation}
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {!showForm && showEntryOptions && (
          <ButtonGroup variant="text" aria-label="text button group">
            <Button sx={{ mt: 3 }} onClick={() => handleSelectingEntryType(EntryType.HealthCheck)}>New HealthCheck entry</Button>
            <Button sx={{ mt: 3 }} onClick={() => handleSelectingEntryType(EntryType.Hospital)}>New Hospital entry</Button>
            <Button sx={{ mt: 3 }} onClick={() => handleSelectingEntryType(EntryType.OccupationalHealthcare)}>New OccupationalHealthcare entry</Button>
            <Button sx={{ mt: 3 }} onClick={() => setShowEntryOptions(false)}>Cancel</Button>
          </ButtonGroup>
        )}
        {!showForm && !showEntryOptions && (
          <Button sx={{ mt: 3 }} variant="contained" onClick={() => setShowEntryOptions(true)}>New entry</Button>
        )}
        {showForm && (
          <AddEntryForm onCancel={toggleForm} onSubmit={submitNewEntry} entryType={entryType} diagnoses={diagnoses} />
        )}
        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          entries
        </Typography>
        {client.entries.map(entry => (
          <Stack key={entry.id} sx={{ border: 1, borderRadius: 2, padding: 2, my: 2 }}>
            <EntryDetails entry={entry} diagnoses={diagnoses} />
          </Stack>
        ))}
        {client.entries.length === 0 && (
          <Typography variant="body1" sx={{ mt: 1 }}>
            no entries
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default ClientPage;

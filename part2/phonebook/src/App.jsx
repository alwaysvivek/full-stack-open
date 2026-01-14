import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Notification from "./components/Notification";
import personService from "./services/persons";

const App = () => {
  const [directory, setDirectory] = useState([]);
  const [filterQuery, setFilterQuery] = useState("");
  const [entryForm, setEntryForm] = useState({ name: "", number: "" });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    personService
      .getAll()
      .then((data) => {
        setDirectory(data);
      })
      .catch(() => {
        setNotification({
          type: "error",
          text: "Failed to fetch persons",
        });
      });
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [notification]);

  const addEntry = (event) => {
    event.preventDefault();
    const existing = directory.find(
      (entry) => entry.name === entryForm.name.trim()
    );
    if (!existing) {
      personService
        .create(entryForm)
        .then((created) => {
          setDirectory((prev) => prev.concat(created));
          setEntryForm({ name: "", number: "" });
          setNotification({
            type: "success",
            text: `${created.name} was successfully added`,
          });
        })
        .catch((error) => {
          setNotification({
            type: "error",
            text: error.response?.data?.error || "unknown error",
          });
        });
    } else {
      if (
        window.confirm(
          `${entryForm.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        personService
          .update(existing.id, entryForm)
          .then((updated) => {
            setDirectory((prev) =>
              prev.map((entry) =>
                entry.id !== updated.id ? entry : updated
              )
            );
            setEntryForm({ name: "", number: "" });
            setNotification({
              type: "success",
              text: `${entryForm.name} was successfully updated`,
            });
          })
          .catch((error) => {
            if (error.response?.status === 404) {
              setDirectory((prev) =>
                prev.filter((entry) => entry.id !== existing.id)
              );
              setNotification({
                type: "error",
                text: `Information of ${entryForm.name} has already removed from server`,
              });
            } else {
              setNotification({
                type: "error",
                text: error.response?.data?.error || "unknown error",
              });
            }
          });
      }
    }
  };

  const onFormChange = ({ target: { name, value } }) => {
    setEntryForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onFilterChange = (event) => {
    setFilterQuery(event.target.value);
  };

  const deleteEntry = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setDirectory((prev) =>
            prev.filter((entry) => entry.id !== id)
          );
          setNotification({
            type: "success",
            text: `${name} was successfully deleted`,
          });
        })
        .catch((error) => {
          if (error.response?.status === 404) {
            setDirectory((prev) =>
              prev.filter((entry) => entry.id !== id)
            );
            // Show success notification since the person is already gone
            setNotification({
              type: "success",
              text: `${name} was successfully deleted`,
            });
          } else {
            setNotification({
              type: "error",
              text: "Unknown error",
            });
          }
        });
    }
  };

  return (
    <>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter filterStr={filterQuery} handleChangeFilter={onFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        newPerson={entryForm}
        handleSubmit={addEntry}
        handleFormChange={onFormChange}
      />
      <h3>Numbers</h3>
      <Persons
        filterStr={filterQuery}
        allPersons={directory}
        handleRemove={deleteEntry}
      />
    </>
  );
};

export default App;

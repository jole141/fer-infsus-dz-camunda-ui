import { useState } from "react";
import styled from "styled-components";
import { Button, TextField } from "@material-ui/core";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow: hidden;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
  width: 50rem;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;

  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.25);

  padding-bottom: 32px;

  h2 {
    margin-bottom: 8px;
  }

  .form-field {
    margin-bottom: 16px;
    width: 100%;
  }

  .submit-button {
    width: 100%;
  }
`;

const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: #ccc;
  margin: 8px 0;
`;

const TASK_1 = "Provjera količine alata";
const TASK_2 = "Promijeni status projekta";

function App() {
  const [alatID, setAlatID] = useState(1);
  const [kolicina, setKolicina] = useState(10);
  const [dostupno, setDostupno] = useState(30);
  const [status, setStatus] = useState("Standby");

  const getID = async (taskName: string) => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const tasks = await fetch(
      "http://localhost:8080/engine-rest/task",
      requestOptions
    );
    const tasksJson = await tasks.json();
    console.log(tasksJson);
    const task = tasksJson.find((task) => task.name === taskName);
    return task.id;
  };

  // TODO id
  const completeTask1 = async (e) => {
    e.preventDefault();

    const taskID = await getID(TASK_1);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        variables: {
          alatID: { value: alatID },
          kolicina: { value: kolicina },
          dostupno: { value: dostupno },
        },
      }),
    };

    console.log({
      alatID: { value: alatID },
      kolicina: { value: kolicina },
      dostupno: { value: dostupno },
    });

    try {
      await fetch(
        `http://localhost:8080/engine-rest/task/${taskID}/complete`,
        requestOptions
      );
    } catch (e) {
      console.log(e);
    }
  };

  const completeTask2 = (e) => {
    e.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messageName: "ObavijestONedostatkuAlata",
      }),
    };

    fetch("http://localhost:8080/engine-rest/message", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const completeTask3 = async (e) => {
    e.preventDefault();

    const taskID = await getID(TASK_2);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        variables: {
          status: { value: status },
        },
      }),
    };

    try {
      await fetch(
        `http://localhost:8080/engine-rest/task/${taskID}/complete`,
        requestOptions
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container>
      <h1>Camunda</h1>
      <FormContainer onSubmit={completeTask1}>
        <h2>{TASK_1}</h2>
        <TextField
          className="form-field"
          label="Alat ID"
          type="number"
          value={alatID}
          onChange={(e) => setAlatID(parseInt(e.target.value))}
        />
        <TextField
          className="form-field"
          label="Količina"
          type="number"
          value={kolicina}
          onChange={(e) => setKolicina(parseInt(e.target.value))}
        />
        <TextField
          className="form-field"
          label="Dostupno"
          type="number"
          value={dostupno}
          onChange={(e) => setDostupno(parseInt(e.target.value))}
        />
        <Button
          className="submit-button"
          variant="contained"
          color="primary"
          type="submit"
        >
          Complete task
        </Button>
      </FormContainer>

      <FormContainer onSubmit={completeTask2}>
        <h2>Obavijest o nedostatku alata</h2>
        <Button
          className="submit-button"
          variant="contained"
          color="primary"
          type="submit"
        >
          Send
        </Button>
      </FormContainer>

      <FormContainer onSubmit={completeTask3}>
        <h2>{TASK_2}</h2>
        <TextField
          className="form-field"
          label="Status"
          type="text"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        <Button
          className="submit-button"
          variant="contained"
          color="primary"
          type="submit"
        >
          Complete task
        </Button>
      </FormContainer>
    </Container>
  );
}

export default App;

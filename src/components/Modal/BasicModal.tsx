import React, { useState, ChangeEvent, DragEvent } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import "./index.css";
import CardData from "./Card";
import { Container, Paper, TextField } from "@mui/material";

interface UserType {
  email: string;
  phone: string;
  name: string;
  age: string;
  id: string;
}

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  age: string;
}

interface UserFormErrors {
  name: string;
  email: string;
  phone: string;
  age: string;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const BasicModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState<UserType[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isEditClicked, setisEditClicked] = useState(false);

  const [data, setData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    age: "",
  });

  const [errors, setErrors] = useState<UserFormErrors>({
    name: "",
    email: "",
    phone: "",
    age: "",
  });

  const checkEmailValidation = (email: string): boolean => {
    const regEx =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validEmail = regEx.test(String(email).toLowerCase().trim());
    return validEmail;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });

    let error = "";
    if (name === "email" && !checkEmailValidation(value)) {
      error = "Invalid email address";
    } else if (name === "phone" && value.trim() === "") {
      error = "Phone is required";
    } else if (name === "age" && value.trim() === "") {
      error = "Age is required";
    } else if (name === "name" && value.trim() === "") {
      error = "Name is required";
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleClick = () => {
    const errors: UserFormErrors = {
      email: !checkEmailValidation(data.email) ? "Invalid email address" : "",
      phone: data.phone.trim() === "" ? "Phone is required" : "",
      name: data.name.trim() === "" ? "Enter name" : "",
      age: data.age.trim() === "" ? "Enter age" : "",
    };
    setErrors(errors);
    if (errors.email || errors.name || errors.phone || errors.age) {
      setErrors(errors);
    } else {
      const newUser: UserType = {
        name: data.name,
        age: data.age,
        phone: data.phone,
        email: data.email,
        id: Date.now().toString(),
      };

      getData(newUser);
      setData({
        email: "",
        phone: "",
        name: "",
        age: "",
      });
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getData = (newUser: UserType) => {
    const newData: UserType[] = [...userData, newUser];
    setUserData(newData);
  };

  const ageBelow18 = (): UserType[] => {
    return userData.filter((user) => parseInt(user.age, 10) <= 18);
  };

  const ageAbove18 = (): UserType[] => {
    return userData.filter(
      (user) => parseInt(user.age, 10) > 18 && parseInt(user.age, 10) <= 25
    );
  };

  const ageAbove25 = (): UserType[] => {
    return userData.filter(
      (user) => parseInt(user.age, 10) <= 45 && parseInt(user.age, 10) > 25
    );
  };

  const ageAbove45 = (): UserType[] => {
    return userData.filter((user) => parseInt(user.age, 10) > 45);
  };

  const handleDropOver = (event: DragEvent) => {
    event?.preventDefault();
  };

  const hangleDropAgeBelow18 = (event: DragEvent, age: number) => {
    const newId = event.dataTransfer.getData("data");
    const parse = JSON.parse(newId);
    const newData: any = userData.map((user) => {
      if (user.id === parse.id && age === 18) {
        return { ...user, age: 18 };
      }
      if (user.id === parse.id && age === 25) {
        return { ...user, age: 25 };
      }
      if (user.id === parse.id && age === 45) {
        return { ...user, age: 45 };
      }
      if (user.id === parse.id && age === 46) {
        return { ...user, age: 46 };
      } else {
        return user;
      }
    });
    setUserData(newData);
  };

  const changeData = (item: UserType) => {
    setData(item);
    setisEditClicked(true);
    setActiveId(item.id);
  };

  const handleUpdate = () => {
    const updatedData: UserType[] = userData.map((user) => {
      if (user.id === activeId) {
        return { ...user, ...data };
      } else {
        return user;
      }
    });

    setUserData(updatedData);
    setisEditClicked(false);
    setData({ email: "", phone: "", name: "", age: "" });
  };

  const deleteData = (id: string) => {
    const filterData = userData.filter((item) => item.id !== id);
    setUserData(filterData);
  };
  return (
    <Box>
      <Button onClick={handleOpen}>ADD+</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Container maxWidth="xs">
            <Paper elevation={3} style={{ padding: "20px" }}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={data.name}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                helperText={errors.name}
                error={!!errors.name}
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                helperText={errors.email}
                error={!!errors.email}
              />

              <TextField
                fullWidth
                label="Phone"
                type="number"
                name="phone"
                value={data.phone}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                helperText={errors.phone}
                error={!!errors.phone}
              />
              <TextField
                fullWidth
                type="number"
                label="Age"
                name="age"
                value={data.age}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                helperText={errors.age}
                error={!!errors.age}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{ marginTop: "10px" }}
                  onClick={handleClose}
                >
                  Cancel
                </Button>

                {isEditClicked ? (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ marginTop: "10px" }}
                    onClick={handleUpdate}
                  >
                    Update
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ marginTop: "10px" }}
                    onClick={handleClick}
                  >
                    Save
                  </Button>
                )}
              </Box>
            </Paper>
          </Container>
        </Box>
      </Modal>
      <Box className="columns-container">
        <Box
          className="column"
          id="todo"
          onDragOver={handleDropOver}
          onDrop={(event) => hangleDropAgeBelow18(event, 18)}
        >
          <Typography variant="h4" sx={{ fontFamily: "system-ui" }}>
            1-18
          </Typography>
          <CardData
            changeData={changeData}
            handleOpen={handleOpen}
            userData={ageBelow18()}
            deleteData={deleteData}
          />
        </Box>
        <Box
          className="column"
          id="progress"
          onDragOver={handleDropOver}
          onDrop={(event) => hangleDropAgeBelow18(event, 25)}
        >
          <Typography variant="h4" sx={{ fontFamily: "system-ui" }}>
            19-25
          </Typography>
          <CardData
            changeData={changeData}
            handleOpen={handleOpen}
            userData={ageAbove18()}
            deleteData={deleteData}
          />
        </Box>
        <Box
          className="column"
          id="done"
          onDragOver={handleDropOver}
          onDrop={(event) => hangleDropAgeBelow18(event, 45)}
        >
          <Typography variant="h4" sx={{ fontFamily: "system-ui" }}>
            25-45
          </Typography>
          <CardData
            changeData={changeData}
            handleOpen={handleOpen}
            userData={ageAbove25()}
            deleteData={deleteData}
          />
        </Box>
        <Box
          className="column"
          id="done"
          onDragOver={handleDropOver}
          onDrop={(event) => hangleDropAgeBelow18(event, 46)}
        >
          <Typography variant="h4" sx={{ fontFamily: "system-ui" }}>
            45+
          </Typography>
          <CardData
            changeData={changeData}
            handleOpen={handleOpen}
            userData={ageAbove45()}
            deleteData={deleteData}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BasicModal;

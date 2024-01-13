import React, { useState } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";

interface IProps {
  userData: Type[];
  handleOpen: () => void;
  changeData: (item: Type) => void;
  deleteData: (id: string) => void;
}

interface Type {
  email: string;
  phone: string;
  name: string;
  age: string;
  id: string;
}

const CardData: React.FC<IProps> = (props) => {
  const [toggle, setToggle] = useState(false);

  const handleDrag = (event: React.DragEvent<HTMLDivElement>, item: Type) => {
    event.dataTransfer.setData("data", JSON.stringify(item));
  };

  const editHandler = (item: Type) => {
    props.handleOpen();
    props.changeData(item);
  };

  const deleteHandler = (id: string) => {
    props.deleteData(id);
  };

  return (
    <Box>
      {props.userData &&
        props.userData.map((item: Type) => (
          <Box key={item.id} draggable onDragStart={(event) => handleDrag(event, item)}>
            <Card>
              <CardContent>
                <Button onClick={() => editHandler(item)}>Edit</Button>
                <Button onClick={() => deleteHandler(item.id)}>Delete</Button>
                <Typography>Email: {item.email}</Typography>
                <Typography>Age: {item.age}</Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
    </Box>
  );
};

export default CardData;

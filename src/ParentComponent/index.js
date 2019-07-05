import React, { useState } from "react";
import {
  Container,
  Divider,
  Header,
  Segment,
  Button,
  Form,
  List,
  Modal,
  Icon,
  Grid
} from "semantic-ui-react";
import { toast } from "react-toastify";
import Countdown from "react-countdown-now";
import update from "immutability-helper";

const ParentComponent = () => {
  const [components, setComponents] = useState({});
  const [names, setNames] = useState([]);
  const [form, setForm] = useState({
    name: "",
    number: "",
    icon: ""
  });
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    number: "",
    icon: "",
    date: ""
  });
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = () => {
    const { name, number, icon } = form;
    let newNames = names;
    newNames.push(name);
    let joined = components;
    for (let i = 0; i < number; i++) {
      joined[Object.keys(joined).length + 1] = {
        name: `${name}#${Object.keys(joined).length + 1}`,
        id: Object.keys(joined).length + 1,
        date: Date.now(),
        icon: icon || "computer"
      };
    }

    setComponents(joined);
    setForm({ name: "", number: "", icon: "" });
    setNames(newNames);
    toast.success("Create Components Successfully");
  };

  const handleEditSubmit = () => {
    setComponents({ ...components, [editForm.id]: editForm });
    setModalOpen(false);
  };

  const handleChange = (e, { name, value }) => {
    setForm({ ...form, [name]: value });
  };

  const handleEditChange = (e, { name, value }) => {
    setEditForm({ ...editForm, [name]: value });
  };

  const resetCountdown = id => {
    setComponents({
      ...components,
      [id]: { ...components[id], date: Date.now() + 3600000 }
    });
  };

  const timesUp = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span style={{ color: "red" }}>Kick 'Em Out!</span>;
    } else {
      return (
        <span>
          {hours}:{minutes}:{seconds}
        </span>
      );
    }
  };

  const handleEditForm = component => {
    setEditForm({
      id: component.id,
      name: component.name,
      number: component.number,
      icon: component.icon,
      date: component.date
    });
    setModalOpen(true);
  };

  const renderModal = component => {
    return (
      <Modal
        trigger={<a onClick={() => handleEditForm(component)}>(Edit)</a>}
        basic
        open={modalOpen}
      >
        <Header icon="pencil" content="Edit" />
        <Modal.Content>
          <Form inverted onSubmit={handleEditSubmit}>
            <Form.Group>
              <Form.Input
                label="Name"
                placeholder="Enter Component Name"
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
              />
              <Form.Input
                label="Icon"
                placeholder="Enter a Font Awesome Icon"
                name="icon"
                value={editForm.icon}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Button.Group>
              <Button color="green" inverted>
                <Icon name="checkmark" /> Submit
              </Button>
              <Button.Or />
              <Button
                type="submit"
                basic
                color="red"
                inverted
                onClick={handleEditSubmit}
              >
                <Icon name="remove" /> Cancel
              </Button>
            </Button.Group>
          </Form>
        </Modal.Content>
      </Modal>
    );
  };
  const renderList = name => {
    let listItems = Object.keys(components)
      .filter(key => {
        return components[key]["name"].includes(name);
      })
      .map(key => {
        return (
          <List.Item key={components[key].id}>
            <List.Icon name={components[key].icon} />
            <List.Content>
              <List.Header>
                {components[key].name} {renderModal(components[key])}
              </List.Header>
              <List.Description>
                <Countdown date={components[key].date} renderer={timesUp} />
                &nbsp;
                <a onClick={() => resetCountdown(components[key].id)}>
                  Reset Timer
                </a>
              </List.Description>
            </List.Content>
          </List.Item>
        );
      });
    return <List>{listItems}</List>;
  };

  const renderGrid = () => {
    console.log(names);
    return names.map(name => {
      return <Grid.Column key={name}>{renderList(name)}</Grid.Column>;
    });
  };

  return (
    <Segment raised>
      <Divider horizontal>
        <Header as="h1">Countdown App</Header>
      </Divider>
      <Container>
        <Header as="h3">Setup Components</Header>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Input
              label="Name"
              placeholder="Enter Component Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
            />
            <Form.Input
              label="Number"
              placeholder="Enter number of component"
              type="number"
              name="number"
              value={form.number}
              onChange={handleChange}
            />
            <Form.Input
              label="Icon"
              placeholder="Leave Blank for Default"
              name="icon"
              value={form.icon}
              onChange={handleChange}
              type="text"
            />
          </Form.Group>
          <Button primary> Enter Component</Button>
        </Form>
      </Container>
      <Grid columns={names.length} divided>
        {renderGrid()}
      </Grid>
    </Segment>
  );
};

export default ParentComponent;

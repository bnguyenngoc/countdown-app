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
  Icon
} from "semantic-ui-react";
import { toast } from "react-toastify";
import Countdown from "react-countdown-now";
import update from "immutability-helper";

const ParentComponent = () => {

  const [components, setComponents] = useState([]);
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
    let joined = components;
    for (let i = 0; i < number; i++) {
      joined.push({
        name: `${name}#${joined.length + 1}`,
        id: joined.length + 1,
        date: Date.now(),
        icon: icon || "computer"
      });
    }

    setComponents(joined);
    setForm({ name: "", number: "", icon: "" })
    toast.success("Create Components Successfully");
  };

  const handleEditSubmit = () => {
    let index = components.findIndex(component => {
      return component.id === editForm.id;
    });
    let newComponents = update(components, {
      $splice: [[index, 1, editForm]]
    });
    setComponents(newComponents);
    setModalOpen(false);
  };

  const handleChange = (e, { name, value }) => {
    setForm({ ...form, [name]: value });
  };

  const handleEditChange = (e, { name, value }) => {
    setEditForm({ ...editForm, [name]: value });
  };

  const resetCountdown = id => {
    let index = components.findIndex(component => {
      return component.id === id;
    });
    let updatedComponent = update(components[index], {
      date: { $set: Date.now() + 3600000 }
    });
    let newComponents = update(components, {
      $splice: [[index, 1, updatedComponent]]
    });
    setComponents(newComponents);
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
  }

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
  }
  const renderList = () => {
    if (components.length === 0) {
      return <Header as="h2">No Components yet. Render some!</Header>;
    } else {
      return components.map(component => {
        return (
          <List.Item key={component.id}>
            <List.Icon name={component.icon} />
            <List.Content>
              <List.Header>
                {component.name} {renderModal(component)}
              </List.Header>
              <List.Description>
                <Countdown date={component.date} renderer={timesUp} />
                &nbsp;
                <a onClick={() => resetCountdown(component.id)}>
                  Reset Timer
                </a>
              </List.Description>
            </List.Content>
          </List.Item>
        );
      });
    }
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
      <List size="big">{renderList()}</List>
    </Segment>
  );
}

export default ParentComponent;

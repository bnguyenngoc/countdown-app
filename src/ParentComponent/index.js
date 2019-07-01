import React, { Component } from "react";
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

export default class ParentComponent extends Component {
  state = {
    components: [],
    form: {
      name: "",
      number: "",
      icon: ""
    },
    editForm: {
      id: "",
      name: "",
      number: "",
      icon: "",
      date: ""
    }
  };

  handleSubmit = () => {
    const {
      form: { name, number, icon },
      components
    } = this.state;
    let joined = components;
    for (let i = 0; i < number; i++) {
      joined.push({
        name: `${name}#${i + 1}`,
        id: joined.length + 1,
        date: Date.now(),
        icon: icon || "computer"
      });
    }
    this.setState({ components: joined, form: { name: "", number: "" } });
    toast.success("Create Components Successfully");
  };

  handleEditSubmit = () => {
    const { editForm } = this.state;
    const { components } = this.state;
    let index = components.findIndex(component => {
      return component.id === editForm.id;
    });
    this.setState({
      components: { ...components, [this.state.components[index]]: editForm }
    });
  };

  handleChange = (e, { name, value }) => {
    this.setState({
      form: {
        ...this.state.form,
        [name]: value
      }
    });
  };

  handleEditChange = (e, { name, value }) => {
    this.setState({
      editForm: {
        ...this.state.editForm,
        [name]: value
      }
    });
  };

  resetCountdown = id => {
    const { components } = this.state;
    let index = components.findIndex(component => {
      return component.id === id;
    });
    let updatedComponent = update(components[index], {
      date: { $set: Date.now() + 3600000 }
    });
    let newComponents = update(components, {
      $splice: [[index, 1, updatedComponent]]
    });
    this.setState({ components: newComponents });
  };

  timesUp = ({ hours, minutes, seconds, completed }) => {
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

  handleEditForm(component) {
    this.setState({
      editForm: {
        id: component.id,
        name: component.name,
        number: component.number,
        icon: component.icon,
        date: component.date
      }
    });
  }

  renderModal(component) {
    const { editForm } = this.state;
    return (
      <Modal
        trigger={<a onClick={() => this.handleEditForm(component)}>(Edit)</a>}
        basic
      >
        <Header icon="pencil" content="Edit" />
        <Modal.Content>
          <Form inverted>
            <Form.Group>
              <Form.Input
                label="Name"
                placeholder="Enter Component Name"
                name="name"
                value={editForm.name}
                onChange={this.handleEditChange}
              />
              <Form.Input
                label="Icon"
                placeholder="Enter a Font Awesome Icon"
                name="icon"
                value={editForm.icon}
                onChange={this.handleEditChange}
              />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted>
            <Icon name="checkmark" /> Submit
          </Button>
          <Button basic color="red" inverted onClick={this.handleEditSubmit}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
  renderList = () => {
    const { components } = this.state;
    if (components.length === 0) {
      return <Header as="h2">No Components yet. Render some!</Header>;
    } else {
      return components.map(component => {
        return (
          <List.Item key={component.id}>
            <List.Icon name={component.icon} />
            <List.Content>
              <List.Header>
                {component.name} {this.renderModal(component)}
              </List.Header>
              <List.Description>
                <Countdown date={component.date} renderer={this.timesUp} />
                &nbsp;
                <a onClick={() => this.resetCountdown(component.id)}>
                  Reset Timer
                </a>
              </List.Description>
            </List.Content>
          </List.Item>
        );
      });
    }
  };

  render() {
    const { form } = this.state;
    return (
      <Segment raised>
        <Divider horizontal>
          <Header as="h1">Countdown App</Header>
        </Divider>
        <Container>
          <Header as="h3">Setup Components</Header>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Input
                label="Name"
                placeholder="Enter Component Name"
                name="name"
                value={form.name}
                onChange={this.handleChange}
              />
              <Form.Input
                label="Number"
                placeholder="Enter number of component"
                type="number"
                name="number"
                value={form.number}
                onChange={this.handleChange}
              />
              <Form.Input
                label="Icon"
                placeholder="Enter a Font Awesome Icon"
                name="icon"
                value={form.icon}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Button primary> Enter Component</Button>
          </Form>
        </Container>
        <List size="big">{this.renderList()}</List>
      </Segment>
    );
  }
}

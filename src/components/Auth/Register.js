import React, { useEffect, useState } from "react";
import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react";
import { Link } from 'react-router-dom';

import firebase from '../../firebase';

const Register = () => {
  const [input, setInput] = useState({});

  const handleChange = (event) => {
    let newInput = {
      ...input,
      [event.target.name]: event.target.value
    }
    setInput(newInput);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(input.email, input.password)
      .then((createdUser) => {
        console.log(createdUser);
      })
      .catch(err => {
        console.error(err);
      })
  }

  const { username, email, password, passwordConfirmation } = input;

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column width={8}>
        <Header as="h2" icon color="orange" textAlign="center">
          <Icon name="puzzle piece" color="orange" />
          Register for DevChat
        </Header>
        <Form onSubmit={handleSubmit} size="large">
          <Segment stacked>
            <Form.Input fluid type="text" name="username" icon="user" iconPosition="left" placeholder="Username" onChange={handleChange} value={username} />
            <Form.Input fluid type="email" name="email" icon="mail" iconPosition="left" placeholder="Mail Address" onChange={handleChange} value={email} />
            <Form.Input fluid type="password" name="password" icon="lock" iconPosition="left" placeholder="Password" onChange={handleChange} value={password} />
            <Form.Input fluid type="password" name="passwordConfirmation" icon="repeat" iconPosition="left" placeholder="Password Confirmation" onChange={handleChange} value={passwordConfirmation} />
            <Button color="orange" fluid size="large">Submit</Button>
          </Segment>
        </Form>
        <Message>Already a User ? <Link to="/login">Login</Link></Message>
      </Grid.Column>
    </Grid>
  );
}

export default Register;
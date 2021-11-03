import React, { useEffect, useState } from "react";
import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react";
import { Link } from 'react-router-dom';

import firebase from '../../firebase';

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const displayErrors = (errors) => errors.map((error, i) => <p key={i}>{error.message}</p>);

  const handleChange = (event) => {
    let newInput = {
      ...input,
      [event.target.name]: event.target.value
    }
    setInput(newInput);
  }

  const isFormValid = ({ email, password }) => {
    return email && password;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isFormValid(input)) {
      return;
    }
    setErrors([]);
    setLoading(true);

    firebase.auth().signInWithEmailAndPassword(input.email, input.password)
      .then(signedUser => {
        console.log(signedUser);

        setInput({
          username: "",
          email: "",
          password: "",
          passwordConfirmation: ""
        });
        setErrors([]);
      })
      .catch(err => {
        console.log(err);
        setErrors(errors.concat(err));
        setLoading(false);
      });
  }

  const handleInputError = (errors, inputName) => {
    return errors.some(error =>
      error.message.toLowerCase().includes(inputName)
    ) ? 'error' : '';
  }

  const { email, password } = input;

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column width={8}>
        <Header as="h2" icon color="violet" textAlign="center">
          <Icon name="code branch" color="violet" />
          Login to DevChat
        </Header>
        <Form onSubmit={handleSubmit} size="large">
          <Segment stacked>
            <Form.Input fluid type="email" name="email" icon="mail" iconPosition="left" placeholder="Mail Address" onChange={handleChange} value={email}
              className={handleInputError(errors, 'email')} />

            <Form.Input fluid type="password" name="password" icon="lock" iconPosition="left" placeholder="Password" onChange={handleChange} value={password} className={handleInputError(errors, 'password')} />

            <Button disabled={isLoading} className={isLoading ? 'loading' : ''} color="violet" fluid size="large">Submit</Button>
          </Segment>
        </Form>
        {errors.length > 0 && (
          <Message error>
            <h3>Error</h3>
            {displayErrors(errors)}
          </Message>
        )}
        <Message>Don't have an account ? <Link to="/register">Register</Link></Message>
      </Grid.Column>
    </Grid>
  );
}

export default Login;
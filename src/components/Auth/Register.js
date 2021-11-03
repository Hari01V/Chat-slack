import React, { useEffect, useState } from "react";
import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react";
import { Link } from 'react-router-dom';
import md5 from 'md5';

import firebase from '../../firebase';

const Register = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: ""
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [usersRef, setUsersRef] = useState(firebase.database().ref('users'));

  const isFormEmpty = (form) => {
    const { username, email, password, passwordConfirmation } = form;
    return !username.length || !email.length || !password.length || !passwordConfirmation.length;
  }

  const isPasswordValid = (input) => {
    const { password, passwordConfirmation } = input;
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  }

  const isFormValid = () => {
    let errors = [];
    let error;

    if (isFormEmpty(input)) {
      error = { message: 'Fill in all the fields' };
      setErrors(errors.concat(error));
      return false;
    } else if (!isPasswordValid(input)) {
      error = { message: 'Password is invalid' };
      setErrors(errors.concat(error));
      return false;
    } else {
      return true;
    }
  }

  const displayErrors = (errors) => errors.map((error, i) => <p key={i}>{error.message}</p>);

  const handleChange = (event) => {
    let newInput = {
      ...input,
      [event.target.name]: event.target.value
    }
    setInput(newInput);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isFormValid()) {
      return;
    }
    setErrors([]);
    setLoading(true);

    firebase.auth().createUserWithEmailAndPassword(input.email, input.password)
      .then((createdUser) => {
        console.log(createdUser);
        setInput({
          username: "",
          email: "",
          password: "",
          passwordConfirmation: ""
        });
        setErrors([]);

        createdUser.user.updateProfile({
          displayName: input.username,
          photoURL: `https://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
        }).then(() => {

          saveUser(createdUser).then(() => {
            console.log('user saved!');
            setLoading(false);
          })

        }).catch(err => {
          console.log(err);
          setErrors(errors.concat(err));
          setLoading(false);
        });

      })
      .catch(err => {
        console.error(err);
        setErrors(errors.concat(err));
        setLoading(false);
      })
  }

  const saveUser = (createdUser) => {
    return usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  }

  const handleInputError = (errors, inputName) => {
    return errors.some(error =>
      error.message.toLowerCase().includes(inputName)
    ) ? 'error' : '';
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

            <Form.Input fluid type="email" name="email" icon="mail" iconPosition="left" placeholder="Mail Address" onChange={handleChange} value={email}
              className={handleInputError(errors, 'email')} />

            <Form.Input fluid type="password" name="password" icon="lock" iconPosition="left" placeholder="Password" onChange={handleChange} value={password} className={handleInputError(errors, 'password')} />

            <Form.Input fluid type="password" name="passwordConfirmation" icon="repeat" iconPosition="left" placeholder="Password Confirmation" onChange={handleChange} value={passwordConfirmation} className={handleInputError(errors, 'password')} />

            <Button disabled={isLoading} className={isLoading ? 'loading' : ''} color="orange" fluid size="large">Submit</Button>
          </Segment>
        </Form>
        {errors.length > 0 && (
          <Message error>
            <h3>Error</h3>
            {displayErrors(errors)}
          </Message>
        )}
        <Message>Already a User ? <Link to="/login">Login</Link></Message>
      </Grid.Column>
    </Grid>
  );
}

export default Register;
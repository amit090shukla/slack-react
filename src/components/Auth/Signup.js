import React, { useState } from "react";
import "../App.css";
import firebase from "../../firebase";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";

export default function Signup(props) {
  const initialFormData = {
    username: "",
    email: "",
    password: "",
    passwordConfirm: ""
  };
  const [formField, changeFormFields] = useState(initialFormData);
  const [errors, handleErrors] = useState([]);

  const handleChange = event => {
    changeFormFields({
      ...formField,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = event => {
    const { email, password } = formField;
    if (isFormValid()) {
      event.preventDefault();
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(user => console.log(user))
        .catch(err => console.log(err));
    }
  };
  const isFormEmpty = () => {
    const { username, email, password, passwordConfirm } = formField;
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirm.length
    );
  };

  const isPasswordValid = () => {
    const { password, passwordConfirm } = formField;
    if (password.length < 6 || passwordConfirm.length < 6) {
      return false;
    } else if (password !== passwordConfirm) {
      return false;
    } else {
      return true;
    }
  };

  const isFormValid = () => {
    let error;
    let newErrors = [];
    if (isFormEmpty()) {
      error = { message: "Fill in all the fields" };
      newErrors = newErrors.concat(error);
      handleErrors(newErrors);
      return false;
    } else if (!isPasswordValid()) {
      error = {
        message: "Passwords are invalid"
      };
      newErrors = newErrors.concat(error);
      handleErrors(newErrors);
      return false;
    } else {
      return true;
    }
  };

  const displayError = errors =>
    errors.map((error, key) => <p key={key}>{error.message}</p>);

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" icon color="green" textAlign="center">
          <Icon name="puzzle piece" color="green" />
          Register to React Slack
        </Header>
        <Form size="large" onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              name="username"
              icon="user"
              iconPosition="left"
              placeholder="Username"
              value={formField.username}
              onChange={handleChange}
              type="text"
            />
            <Form.Input
              fluid
              name="email"
              icon="mail"
              iconPosition="left"
              placeholder="Email Address"
              value={formField.email}
              onChange={handleChange}
              type="email"
            />
            <Form.Input
              fluid
              name="password"
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              value={formField.password}
              onChange={handleChange}
              type="password"
            />
            <Form.Input
              fluid
              name="passwordConfirm"
              icon="repeat"
              iconPosition="left"
              placeholder="Retype Password"
              value={formField.passwordConfirm}
              onChange={handleChange}
              type="password"
            />
            <Button color="green" fluid size="large">
              Submit
            </Button>
          </Segment>
        </Form>
        {errors.length > 0 && (
          <Message error>
            <h3>Error</h3>
            {displayError(errors)}
          </Message>
        )}
        <Message>
          Already a user ? <Link to="/login">Login</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
}

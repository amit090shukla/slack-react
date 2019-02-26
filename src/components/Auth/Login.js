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

//================================================================================================

export default function Login() {
  // ------------------------------------------------State----------------------------------------

  const initialFormState = {
    email: "",
    password: ""
  };

  const [formField, changeFormFields] = useState(initialFormState);
  const [errors, handleErrors] = useState([]);
  const [loading, toggleLoading] = useState(false);

  //==================================================Functions=====================================
  const handleChange = event => {
    changeFormFields({
      ...formField,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (isFormValid()) {
      handleErrors([]);
      toggleLoading(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(formField.email, formField.password)
        .then(signedInUser => {
          console.log(signedInUser);
          console.log("Signed In");
        })
        .catch(err => {
          const newErrors = errors.concat(err);
          handleErrors(newErrors);
          toggleLoading(false);
        });
    }
  };

  const isFormValid = () => {
    return formField.email && formField.password;
  };

  const handleInputError = inputName => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? "error"
      : "";
  };

  const displayError = errors =>
    errors.map((error, key) => <p key={key}>{error.message}</p>);

  //====================================================RENDER============================

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" icon color="red" textAlign="center">
          <Icon name="code branch" color="red" />
          Login to React Slack
        </Header>
        <Form size="large" onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              name="email"
              icon="mail"
              iconPosition="left"
              placeholder="Email Address"
              value={formField.email}
              onChange={handleChange}
              type="email"
              className={handleInputError("email")}
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
              className={handleInputError("password")}
            />

            <Button
              disabled={loading}
              color="red"
              fluid
              size="large"
              className={loading ? "loading" : ""}
            >
              Login
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
          New User? <Link to="/signup">Signup</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
}

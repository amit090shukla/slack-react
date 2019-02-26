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
import md5 from "md5";
import { Link } from "react-router-dom";

//================================================================================================

export default function Signup() {
  // ------------------------------------------------State----------------------------------------

  const initialFormState = {
    username: "",
    email: "",
    password: "",
    passwordConfirm: ""
  };
  const [formField, changeFormFields] = useState(initialFormState);
  const [errors, handleErrors] = useState([]);
  const [loading, toggleLoading] = useState(false);
  const [usersRef, handleUserRef] = useState(firebase.database().ref("users"));

  //==================================================Functions=====================================
  const handleChange = event => {
    changeFormFields({
      ...formField,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = event => {
    const { email, password } = formField;

    event.preventDefault();
    if (isFormValid()) {
      handleErrors([]);
      toggleLoading(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(user => {
          console.log(user);
          user.user
            .updateProfile({
              displayName: formField.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                user.user.email
              )}?=identicon`
            })
            .then(() => {
              saveUser(user).then(() => {
                console.log("User Saved");
              });
              toggleLoading(false);
            })
            .catch(err => {
              console.log(err);
              const newErrors = errors.concat(err);
              handleErrors(newErrors);
              toggleLoading(false);
            });
        })
        .catch(err => {
          const newErrors = errors.concat(err);
          handleErrors(newErrors);
          toggleLoading(false);
        });
    }
  };

  const saveUser = user => {
    return usersRef.child(user.user.uid).set({
      name: user.user.displayName,
      avatar: user.user.photoURL
    });
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
            <Form.Input
              fluid
              name="passwordConfirm"
              icon="repeat"
              iconPosition="left"
              placeholder="Retype Password"
              value={formField.passwordConfirm}
              onChange={handleChange}
              className={handleInputError("password")}
              type="password"
            />
            <Button
              disabled={loading}
              color="green"
              fluid
              size="large"
              className={loading ? "loading" : ""}
            >
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

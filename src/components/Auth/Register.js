import React from 'react';
import './register.css';
import firebase from '../../firebase';
import md5 from 'md5';

import {
  Grid,
  Segment,
  Button,
  Header,
  Message,
  Form,
} from 'semantic-ui-react';

import { Link } from 'react-router-dom';

import Logo from './icon.png';

class Register extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: [],
    loading: false,
    usersRef: firebase.database().ref('users'),
  };

  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isUserNameEmpty(this.state)) {
      error = { message: 'Please Fill Username' };
      this.setState({ errors: errors.concat(error) });

      return false;
    } else if (this.isEmailEmpty(this.state)) {
      error = { message: 'Please Fill Email' };
      this.setState({ errors: errors.concat(error) });

      return false;
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: 'Password is invalid' };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      return true;
    }
  };

  isUserNameEmpty = ({ username }) => {
    return !username.length;
  };
  isEmailEmpty = ({ email }) => {
    return !email.length;
  };
  isPasswordEmpty = ({ password }) => {
    if (password.length < 6) return false;
    else return true;
  };

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  displayErrors = (errors) =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((createdUser) => {
          console.log(createdUser);
          createdUser.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`,
            })
            .then(() => {
              this.saveUser(createdUser).then(() => {
                console.log('user saved');
              });
            })
            .catch((err) => {
              console.error(err);
              this.setState({
                errors: this.state.errors.concat(err),
                loading: false,
              });
            });
        })
        .catch((err) => {
          console.error(err);
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false,
          });
        });
    }
  };

  saveUser = (createdUser) => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
    });
  };

  handleInputError = (errors, inputName) => {
    return errors.some((error) =>
      error.message.toLowerCase().includes(inputName)
    )
      ? 'error'
      : '';
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading,
    } = this.state;
    const buttonStyle = {
      padding: '3% 8%',
      fontSize: '20px',
    };
    const inputStyle = {
      fontSize: '17px',
    };

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <img alt="Logo" src={Logo} height="140" width="140" />
          <Header className="head" as="h1" icon color="pink" textAlign="center">
            Register for ChatFire
          </Header>
          <div className="mainDiv">
            <Form onSubmit={this.handleSubmit} size="large" autoComplete="off">
              <Segment stacked>
                <Form.Input
                  style={inputStyle}
                  fluid
                  name="username"
                  icon="user"
                  iconPosition="left"
                  placeholder="Username"
                  onChange={this.handleChange}
                  value={username}
                  type="text"
                />
                <Form.Input
                  fluid
                  name="email"
                  icon="mail"
                  iconPosition="left"
                  placeholder="Email Address"
                  onChange={this.handleChange}
                  value={email}
                  className={this.handleInputError(errors, 'email')}
                  type="email"
                />

                <Form.Input
                  fluid
                  name="password"
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  onChange={this.handleChange}
                  value={password}
                  className={this.handleInputError(errors, 'password')}
                  type="password"
                />

                <Form.Input
                  fluid
                  name="passwordConfirmation"
                  icon="repeat"
                  iconPosition="left"
                  placeholder="Password Confirmation"
                  onChange={this.handleChange}
                  value={passwordConfirmation}
                  className={this.handleInputError(errors, 'password')}
                  type="password"
                />

                <Button
                  style={buttonStyle}
                  circular
                  disabled={loading}
                  className={loading ? 'loading' : ''}
                  color="pink"
                  size="large"
                >
                  Submit
                </Button>
              </Segment>
            </Form>
          </div>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>
            Already a user? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;

import React from 'react';
import firebase from '../../firebase';
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Logo from './icon.png';
class Login extends React.Component {
  state = {
    email: '',
    password: '',
    errors: [],
    loading: false,
  };

  displayErrors = (errors) =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });

      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((signedInUser) => {
          var user = firebase.auth().currentUser;

          if (!user.emailVerified) {
            window.alert('Please Verify Your Email');
            firebase
              .auth()
              .signOut()
              .then(function () {});
          }
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

  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isEmailEmpty(this.state)) {
      error = { message: 'Please Fill Email' };
      this.setState({ errors: errors.concat(error) });

      return false;
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: 'Password length should be greater than 6' };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      return true;
    }
  };
  isEmailEmpty = ({ email }) => {
    return !email.length;
  };
  isPasswordValid = ({ password }) => {
    if (password.length < 6) {
      return false;
    } else {
      return true;
    }
  };
  handleInputError = (errors, inputName) => {
    return errors.some((error) =>
      error.message.toLowerCase().includes(inputName)
    )
      ? 'error'
      : '';
  };

  render() {
    const { email, password, errors, loading } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <img alt="Logo" src={Logo} height="140" width="140" />
          <Header className="head" as="h1" icon color="pink" textAlign="center">
            Login To ChatFire
          </Header>
          <Form onSubmit={this.handleSubmit} size="large" autoComplete="off">
            <Segment piled color="pink">
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

              <Button
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
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>
            Don't have an account? <Link to="/register">Register</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;

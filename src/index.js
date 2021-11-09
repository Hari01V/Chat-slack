import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter as Router, Route, Switch, useHistory, withRouter } from 'react-router-dom'

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Spinner from './Spinner';

import 'semantic-ui-css/semantic.min.css';

import firebase from './firebase';

import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import { setUser, clearUser } from './actions';

const store = createStore(rootReducer, composeWithDevTools());

const Root = (props) => {
  const history = useHistory();
  useEffect(() => {
    // listens for user and redirects to homepage if they go to login page manually
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        props.setUser(user);
        history.push('/');
      } else {
        history.push('/login');
        props.clearUser();
      }
    });
  }, []);

  return (
    <>
      {props.isLoading ?
        <Spinner /> :
        <Switch>
          <Route exact path="/" component={App} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
        </Switch>
      }
    </>
  )
}

const mapStateFromProps = (state) => {
  return {
    isLoading: state.user.isLoading
  }
}

const RootWithAuth = withRouter(
  connect(
    mapStateFromProps,
    { setUser, clearUser }
  )(Root));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <RootWithAuth />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

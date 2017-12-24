import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import 'react-dates/initialize';
import 'typeface-roboto/index.css';

import Navigation from './NavBar';
import PostList from '../components/PostListContainer';
import EditPostView from '../views/EditPostView';
import NotFoundPage from '../views/NotFoundView';
import SignUpView from '../views/SignUpView';
import Logbook from '../views/Logbook';
import Login from '../views/LoginView';
import ProfileView from '../views/ProfileView';
import ForgotPasswordView from '../views/ForgotPasswordView';
import ChangePasswordView from '../views/ChangePasswordView';
import ResetPasswordView from '../views/ResetPasswordView';
import ActivateAccountView from '../views/ActivateAccountView';
import { requireAuth } from '../auth';


const containerStyle = {
  width: '80%',
  margin: 'auto',
};

const ConnectedSwitch = connect(state => ({
  location: state.routing.location,
}))(Switch);

export const App = () => (
  <div className="app-container">
    <Navigation />
    <div id="container" style={containerStyle}>
      <ConnectedSwitch>
        <Route exact path="/" component={requireAuth(Logbook)} />
        <Route path="/logbook/:date" component={requireAuth(Logbook)} />
        <Route path="/sign-up" component={SignUpView} />
        <Route path="/login" component={Login} />
        <Route path="/posts/:postId" component={requireAuth(EditPostView)} />
        <Route path="/posts" component={requireAuth(PostList)} />
        <Route path="/profile" component={requireAuth(ProfileView)} />
        <Route path="/password/reset/:token" component={ResetPasswordView} />
        <Route path="/password/forgot" component={ForgotPasswordView} />
        <Route path="/password/change" component={requireAuth(ChangePasswordView)} />
        <Route path="/account/activate/:token" component={ActivateAccountView} />
        <Route path="*" component={NotFoundPage} />
      </ConnectedSwitch>
    </div>
  </div>
);

const ConnectedApp = connect(
  state => ({ location: state.routing.location }),
)(App);

export default ConnectedApp;

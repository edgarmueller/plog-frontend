import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import { RaisedButton } from 'material-ui';
import { redA400 } from 'material-ui/styles/colors';
import PropTypes from 'prop-types';
import { renderPasswordTextField } from '../utils/helpers';
import * as actions from '../actions';

const form = reduxForm({
  form: 'change-pw',
});

export const ChangePasswordForm = ({ handleSubmit, handleFormSubmit, renderAlert }) => (
  <form onSubmit={handleSubmit(handleFormSubmit)}>
    <div>
      <Field
        name="password"
        component={renderPasswordTextField}
        type="password"
        label="Current Password"
      />
    </div>
    <div>
      <Field
        name="password-repeat"
        component={renderPasswordTextField}
        type="password"
        label="New Password"
      />
    </div>
    <RaisedButton type="submit" >Change password</RaisedButton>
    <div>
      {renderAlert()}
    </div>
  </form>
);

ChangePasswordForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  renderAlert: PropTypes.func.isRequired,
};

export class ChangePasswordFormContainer extends React.Component {

  constructor() {
    super();
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.renderAlert = this.renderAlert.bind(this);
  }

  handleFormSubmit(formProps) {
    this.props.changePassword(formProps);
  }

  // TODO: dup code
  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div style={{ marginTop: '1em' }}>
          <span style={{ color: redA400 }}>
            {this.props.errorMessage}
          </span>
        </div>
      );
    }

    return undefined;
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <ChangePasswordForm
        handleSubmit={handleSubmit}
        handleFormSubmit={this.handleFormSubmit}
        renderAlert={this.renderAlert}
      />
    );
  }
}

ChangePasswordFormContainer.propTypes = {
  // isAuthenticated: PropTypes.bool.isRequired,
  // replace: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired,
  // redirect: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
};


ChangePasswordFormContainer.defaultProps = {
  errorMessage: undefined,
};

const mapDispatchToProps = dispatch => ({
  changePassword(formProps) {
    dispatch(actions.changePassword(formProps.email));
    dispatch(routerActions.push('/'));
  },
});

export default connect(
  null,
  mapDispatchToProps,
)(form(ChangePasswordFormContainer));
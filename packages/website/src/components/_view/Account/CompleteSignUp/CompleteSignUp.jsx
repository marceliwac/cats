import React from 'react';
import { Auth } from 'aws-amplify';
import { useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Form from '../../Common/Form/Form';
import styles from './CompleteSignUp.module.scss';
import CompleteSignUpForm from './CompleteSignupForm/CompleteSignupForm';
import UnauthenticatedRoute from '../../../_functional/UnauthenticatedRoute';
import FormAlert from '../../Common/FormAlert/FormAlert';

function CompleteSignUp() {
  const [searchParams] = useSearchParams();
  let defaultFormAlert = null;
  if (searchParams.get('message') && searchParams.get('messageTitle')) {
    defaultFormAlert = {
      severity: 'info',
      title: searchParams.get('messageTitle'),
      message: searchParams.get('message'),
    };
  }
  const [formAlert, setFormAlert] = React.useState(defaultFormAlert);

  async function onSubmit(data) {
    const userAttributes = {
      given_name: data.firstName,
      family_name: data.lastName,
    };
    try {
      const user = await Auth.signIn(data.email, data.currentPassword);
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        await Auth.completeNewPassword(user, data.newPassword, userAttributes);
        // The Auth.Hub listener will handle the redirect automatically.
      }
    } catch (e) {
      setFormAlert({
        severity: 'error',
        title: 'Could not complete sign up!',
        message:
          'Something went wrong during sign-up. Please contact the administrator for further support.',
      });
    }
  }

  return (
    <div className={styles.completeSignUp}>
      <h1>Complete Signup</h1>
      <p className={styles.description}>
        Complete your registration and account using the form below.
      </p>
      <Form onSubmit={(data) => onSubmit(data)}>
        <CompleteSignUpForm />
        <div className={styles.formControls}>
          <Button variant="contained" type="submit" fullWidth>
            Complete Sign Up
          </Button>
        </div>

        {formAlert && <FormAlert alert={formAlert} />}
      </Form>
    </div>
  );
}

export default UnauthenticatedRoute(CompleteSignUp);

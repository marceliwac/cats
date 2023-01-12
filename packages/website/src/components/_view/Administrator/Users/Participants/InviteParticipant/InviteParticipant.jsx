import React from 'react';
import Button from '@mui/material/Button';
import Form from '../../../../Common/Form/Form';
import APIClient from '../../../../../../util/APIClient';
import styles from './InviteParticipant.module.scss';
import FormTextField from '../../../../Common/FormTextField/FormTextField';
import FormAlert from '../../../../Common/FormAlert/FormAlert';

export default function InviteParticipant() {
  const [formAlert, setFormAlert] = React.useState(null);

  async function onSubmit(data) {
    const userData = {
      userEmail: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      group: 'participants',
    };
    try {
      await APIClient.post('/administrator/users', userData);
      setFormAlert({
        severity: 'success',
        title: 'Participant invited successfully!',
        message:
          'Participant account has been successfully created. An e-mail will be sent to the new participant asking them to complete registration.',
      });
    } catch (e) {
      setFormAlert({
        severity: 'error',
        title: 'Could not invite a participant!',
        message:
          'Something went wrong during the participant account creation. Please contact the administrator for further support.',
      });
    }
  }

  return (
    <div className={styles.inviteParticipant}>
      <p className={styles.description}>
        Use this form to invite a new participant to the platform. Doing so will
        create an account and send an invitational e-mail that will require the
        user to complete their registration.
      </p>
      <Form onSubmit={(data) => onSubmit(data)}>
        <div className={styles.horizontalInputs}>
          <FormTextField
            name="firstName"
            label="First name"
            autocomplete="given-name"
            rules={{
              required: { value: true, message: 'First name is required.' },
            }}
          />
          <FormTextField
            name="lastName"
            label="Last name"
            autocomplete="family-name"
            rules={{
              required: { value: true, message: 'Last name is required.' },
            }}
          />
        </div>
        <FormTextField
          name="email"
          label="E-mail address"
          autocomplete="email"
          rules={{
            required: { value: true, message: 'E-mail address is required.' },
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'E-mail address must be a valid e-mail.',
            },
          }}
        />
        <div className={styles.formControls}>
          <Button variant="contained" type="submit" fullWidth>
            Send invitation
          </Button>
        </div>
        {formAlert && <FormAlert alert={formAlert} />}
      </Form>
    </div>
  );
}

import React from 'react';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import styles from './UpdateOrderedGroupAssignment.module.scss';
import Form from '../../../Common/Form/Form';
import UpdateOrderedGroupAssignmentForm from './UpdateOrderedGroupAssignmentForm/UpdateOrderedGroupAssignmentForm';
import APIClient from '../../../../../util/APIClient';
import useApiData from '../../../../../hooks/useApiData';
import Loading from '../../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../../Common/Error/Error';
import FormAlert from '../../../Common/FormAlert/FormAlert';

export default function UpdateOrderedGroupAssignment() {
  const { orderedGroupAssignmentId } = useParams();
  const [formAlert, setFormAlert] = React.useState(null);

  const { data, isLoading, error, reload } = useApiData({
    path: `/administrator/orderedGroupAssignments/${orderedGroupAssignmentId}`,
  });

  if (isLoading) {
    return <Loading message="Fetching group assignment..." />;
  }

  if (error || data === null) {
    return getErrorComponentFromHttpError(error);
  }

  async function onSubmit(d) {
    const group = {
      name: d.name,
      addUsersByDefault: d.addUsersByDefault,
      cognitoIds: d.cognitoIds,
    };

    try {
      await APIClient.patch(
        `/administrator/orderedGroupAssignments/${orderedGroupAssignmentId}`,
        group
      );
      setFormAlert({
        severity: 'success',
        title: 'Group updated successfully!',
        message:
          'Your ordered group assignment has been updated successfully. You will be redirected shortly.',
      });
      reload();
      setTimeout(() => {
        setFormAlert(null);
      }, 3000);
    } catch (e) {
      setFormAlert({
        severity: 'error',
        title: 'Could not update group!',
        message:
          'Something went wrong during ordered group assignment update. Please contact the administrator for further support.',
      });
    }
  }

  return (
    <div className={styles.completeSignUp}>
      <p className={styles.description}>
        Edit the group assignment using the form below.
      </p>
      <Form onSubmit={(d) => onSubmit(d)}>
        <UpdateOrderedGroupAssignmentForm
          name={data.name}
          addUsersByDefault={data.addUsersByDefault}
          cognitoIds={data.cognitoIds}
        />
        <div className={styles.formControls}>
          <Button variant="contained" type="submit" fullWidth>
            Update
          </Button>
        </div>
        {formAlert && <FormAlert alert={formAlert} />}
      </Form>
    </div>
  );
}

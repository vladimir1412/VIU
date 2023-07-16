import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  name: yup.string().required('Please enter your name.'),
  familyName: yup.string().required('Please enter your family name.'),
  gender: yup.string().required('Please select gender.'),
  otherGender: yup.string().when('gender', {
    is: (value: string) => value === 'Other',
    then: (schema) => schema.required('Please enter your gender.'),
    otherwise: (schema) => schema,
  }),
  birthdate: yup.string().required('Please select your birthdate.'),
});

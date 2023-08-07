import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import PersonalInfoForm from '@/components/PersonalInfoForm.vue';
import { ValidationError } from 'yup';
import { Gender } from '@/models/gender';
import { validationSchema } from '@/utils/validation';

describe('PersonalInfoForm', () => {
  it('should validate and show errors when form submission fails', async () => {
    const wrapper: any = mount(PersonalInfoForm);
    const instance = wrapper.vm;

    instance.form.name = '';
    instance.form.familyName = '';
    instance.form.gender = '';
    instance.form.otherGender = '';
    instance.form.birthdate = '';

    await instance.handleSubmit();

    expect(instance.errors.name).toBe('Please enter your name.');
    expect(instance.errors.familyName).toBe('Please enter your family name.');
    expect(instance.errors.gender).toBe('Please select gender.');
    expect(instance.errors.otherGender).toBe('');
    expect(instance.errors.birthdate).toBe('Please select your birthdate.');
  });

  it('should validate and show errors when other gender is required but not provided', async () => {
    const wrapper: any = mount(PersonalInfoForm);
    const instance = wrapper.vm;

    instance.form.name = 'John';
    instance.form.familyName = 'Doe';
    instance.form.gender = Gender.Other;
    instance.form.otherGender = '';
    instance.form.birthdate = '2023-07-12';

    await instance.handleSubmit();

    expect(instance.errors.otherGender).toBe('Please enter your gender.');
  });

  it('should validate and show no errors when form submission is successful', async () => {
    const wrapper: any = mount(PersonalInfoForm);
    const instance = wrapper.vm;

    instance.form.name = 'John';
    instance.form.familyName = 'Doe';
    instance.form.gender = 'Male';
    instance.form.otherGender = '';
    instance.form.birthdate = '2023-07-12';

    await instance.handleSubmit();

    expect(instance.errors.name).toBe('');
    expect(instance.errors.familyName).toBe('');
    expect(instance.errors.gender).toBe('');
    expect(instance.errors.otherGender).toBe('');
    expect(instance.errors.birthdate).toBe('');
  });

  it('should reset form and related properties', () => {
    const wrapper: any = mount(PersonalInfoForm);
    const instance = wrapper.vm;

    instance.form.name = 'Steve';
    instance.form.familyName = 'Jobs';
    instance.form.gender = Gender.Other;
    instance.form.otherGender = 'Non-binary';
    instance.form.birthdate = '2023-07-12';

    instance.errors.name = 'Name is required.';
    instance.errors.familyName = 'Family name is required.';
    instance.errors.gender = 'Gender is required.';
    instance.errors.otherGender = '';
    instance.errors.birthdate = 'Birthdate is required.';

    instance.showOtherGender = true;
    instance.isDialogOpen = true;
    instance.formValues = { ...instance.form };

    instance.handleResetForm();

    expect(instance.form.name).toBe('');
    expect(instance.form.familyName).toBe('');
    expect(instance.form.gender).toBe('');
    expect(instance.form.otherGender).toBe('');
    expect(instance.form.birthdate).toBe('');

    expect(instance.errors.name).toBe('');
    expect(instance.errors.familyName).toBe('');
    expect(instance.errors.gender).toBe('');
    expect(instance.errors.otherGender).toBe('');
    expect(instance.errors.birthdate).toBe('');

    expect(instance.showOtherGender).toBe(false);

    expect(instance.isDialogOpen).toBe(false);

    expect(instance.formValues).toBe(null);
  });

  it('should display input for adding the gender', async () => {
    const wrapper: any = mount(PersonalInfoForm);
    const instance = wrapper.vm;

    instance.form.gender = 'Male';
    instance.showOtherGender = false;

    const event = { target: { value: Gender.Other } };

    instance.handleGenderChange(event);

    expect(instance.form.gender).toBe(Gender.Other);

    await instance.handleFieldValidation('gender');

    expect(instance.showOtherGender).toBe(true);
  });

  it('should handle field validation', async () => {
    const wrapper: any = mount(PersonalInfoForm);
    const instance = wrapper.vm;

    const fieldName = 'birthdate';
    const errorMessage = 'Please select your birthdate.';

    const validateAtMock = vi.spyOn(validationSchema, 'validateAt');
    validateAtMock.mockRejectedValue(new ValidationError(errorMessage));

    const errors: Record<string, string> = {};

    await it('should set error message when validation fails', async () => {
      await instance.handleFieldValidation(fieldName);

      expect(errors[fieldName]).toBe(errorMessage);
    });
  });

  it('should handle birthdate change unsuccessfully', async () => {
    const wrapper: any = mount(PersonalInfoForm);
    const instance = wrapper.vm;

    instance.form.birthdate = '2023-07-12';

    const emptyEvent: Event = { target: { value: '' } };
    await instance.handleBirthdateChange(emptyEvent);
    await instance.handleFieldValidation('gender');

    expect(instance.errors.birthdate).toBe('Please select your birthdate.');
  });

  it('should handle birthdate change successfully', async () => {
    const wrapper: any = mount(PersonalInfoForm);
    const instance = wrapper.vm;

    instance.form.birthdate = '2023-07-12';

    const event: Event = { target: { value: '2023-07-15' } };
    await instance.handleBirthdateChange(event);

    expect(instance.form.birthdate).toBe('2023-07-15');
    expect(instance.errors.birthdate).toBe('');
  });
});

<template>
  <section class="personal-info-form">
    <form class="form" @submit.prevent="handleSubmit">
      <h2 class="form__title">Personal Information</h2>
      <div
        class="form__group"
        :class="{
          'form__group--invalid': errors.name.length,
          'form__group--valid': form.name.length,
        }"
      >
        <sl-input
          name="name"
          label="Name *"
          placeholder="Enter name"
          autocomplete="off"
          v-model="form.name"
          @input="handleFieldValidation('name')"
        ></sl-input>
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>
      <div
        class="form__group"
        :class="{
          'form__group--invalid': errors.familyName.length,
          'form__group--valid': form.familyName.length,
        }"
      >
        <sl-input
          name="familyName"
          label="Family name *"
          placeholder="Enter family name"
          autocomplete="off"
          v-model="form.familyName"
          @input="handleFieldValidation('familyName')"
        ></sl-input>
        <span v-if="errors.familyName" class="error-message">{{ errors.familyName }}</span>
      </div>
      <div
        class="form__group"
        :class="{
          'form__group--invalid': errors.gender.length,
          'form__group--valid': form.gender.length,
        }"
      >
        <sl-select
          name="gender"
          label="Gender *"
          placeholder="Select gender"
          v-model="form.gender"
          @sl-change="handleGenderChange"
        >
          <sl-option :value="Gender.Male">Male</sl-option>
          <sl-option :value="Gender.Female">Female</sl-option>
          <sl-option :value="Gender.Other">Other</sl-option>
        </sl-select>
        <span v-if="errors.gender" class="error-message">{{ errors.gender }}</span>
      </div>
      <div
        v-if="showOtherGender"
        class="form__group"
        :class="{
          'form__group--invalid': errors.otherGender.length,
          'form__group--valid': form.otherGender.length,
        }"
      >
        <sl-input
          name="otherGender"
          label="Other Gender *"
          placeholder="Enter gender"
          autocomplete="off"
          v-model="form.otherGender"
          @input="handleFieldValidation('otherGender')"
        ></sl-input>
        <span v-if="errors.otherGender" class="error-message">{{ errors.otherGender }}</span>
      </div>

      <div
        class="form__group"
        :class="{
          'form__group--invalid': errors.birthdate.length,
          'form__group--valid': form.birthdate.length,
        }"
      >
        <sl-input
          name="birthdate"
          label="Birthdate *"
          v-model="form.birthdate"
          type="date"
          min="1900-01-01"
          max="2050-12-31"
          @input="handleBirthdateChange"
        ></sl-input>
        <span v-if="errors.birthdate" class="error-message">{{ errors.birthdate }}</span>
      </div>
      <sl-button class="form__submit-button" variant="primary" type="submit">Submit</sl-button>
    </form>
  </section>

  <PersonalInfoDialog :is-open="isDialogOpen" :profile-info="form" @reset-form="handleResetForm" />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ValidationError } from 'yup';
import { PersonalInfo } from '@/models/personalInfo';
import { Gender } from '@/models/gender';
import PersonalInfoDialog from '@/components/PersonalInfoDialog.vue';
import '@shoelace-style/shoelace/dist/components/input/input';
import '@shoelace-style/shoelace/dist/components/button/button';
import '@shoelace-style/shoelace/dist/components/select/select';
import '@shoelace-style/shoelace/dist/components/option/option';
import { validationSchema } from '@/utils/validation';

const form = reactive<PersonalInfo>({
  name: '',
  familyName: '',
  gender: '',
  otherGender: '',
  birthdate: '',
});

const errors = reactive<PersonalInfo>({
  name: '',
  familyName: '',
  gender: '',
  otherGender: '',
  birthdate: '',
});

const showOtherGender = ref<boolean>(false);
const isDialogOpen = ref<boolean>(false);
const formValues = ref<PersonalInfo | null>(null);

const handleSubmit = async (): Promise<void> => {
  try {
    await validationSchema.validate(form, { abortEarly: false });
    isDialogOpen.value = true;
    formValues.value = { ...form };
  } catch (err) {
    const validationError = err as ValidationError;
    validationError.inner.forEach((error: ValidationError) => {
      if (error?.path) {
        errors[error.path] = error.message;
      }
    });
  }
};

const handleGenderChange = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  form.gender = target.value;
  handleFieldValidation('gender');
  showOtherGender.value = form.gender === Gender.Other;
};

const handleResetForm = (): void => {
  for (const field in form) {
    form[field] = '';
    errors[field] = '';
  }
  showOtherGender.value = false;
  isDialogOpen.value = false;
  formValues.value = null;
};

const handleFieldValidation = async (fieldName: string): Promise<void> => {
  try {
    await validationSchema.validateAt(fieldName, form);
    errors[fieldName] = '';
  } catch (err) {
    const validationError = err as ValidationError;
    errors[fieldName] = validationError.message;
  }
};

const handleBirthdateChange = async (event: Event): Promise<void> => {
  const target = event.target as HTMLInputElement;
  form.birthdate = target.value;
  if (form.birthdate === '') {
    await handleFieldValidation('birthdate');
    return;
  }
  errors['birthdate'] = '';
};
</script>

<template>
  <sl-dialog
    label="Submitted Personal Information"
    data-test-id="dialog"
    class="personal-info-dialog"
    :open="isOpen"
    @sl-hide="handleResetForm"
  >
    <section class="personal-info-dialog__section">
      <div class="personal-info-dialog__item">
        <h5 class="personal-info-dialog__item__label">Name:</h5>
        <p class="personal-info-dialog__item__value" data-test-id="profile-info-name">
          {{ profileInfo.name }}
        </p>
      </div>
      <div class="personal-info-dialog__item">
        <h5 class="personal-info-dialog__item__label">Family name:</h5>
        <p class="personal-info-dialog__item__value" data-test-id="profile-info-family-name">
          {{ profileInfo.familyName }}
        </p>
      </div>
      <div class="personal-info-dialog__item">
        <h5 class="personal-info-dialog__item__label">Gender:</h5>
        <p class="personal-info-dialog__item__value" data-test-id="profile-info-gender">
          {{ getGender() }}
        </p>
      </div>
      <div class="personal-info-dialog__item">
        <h5 class="personal-info-dialog__item__label">Birthdate:</h5>
        <p class="personal-info-dialog__item__value" data-test-id="profile-info-birthdate">
          {{ getFormattedDate(profileInfo.birthdate) }}
        </p>
      </div>
      <sl-button
        class="personal-info-dialog__reset-form-button"
        data-test-id="reset-form-button"
        variant="primary"
        @click="handleResetForm"
        >Close</sl-button
      >
    </section>
  </sl-dialog>
</template>

<script setup lang="ts">
import { PersonalInfo } from '@/models/personalInfo';
import { Gender } from '@/models/gender';
import '@shoelace-style/shoelace/dist/components/dialog/dialog';
import '@shoelace-style/shoelace/dist/components/button/button';

const emit = defineEmits<{
  (e: 'reset-form'): void;
}>();

const props = defineProps({
  profileInfo: { type: Object as () => PersonalInfo, required: true },
  isOpen: { type: Boolean, required: true, default: false },
});

const handleResetForm = (): void => {
  emit('reset-form');
};

const getFormattedDate = (date: string): string => {
  if (date) {
    const dateParts = date.split('-');
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];

    return `${month}/${day}/${year}`;
  }
  return '';
};

const getGender = (): string => {
  if (props.profileInfo.gender === Gender.Other) {
    return props.profileInfo.otherGender;
  }
  return props.profileInfo.gender;
};
</script>

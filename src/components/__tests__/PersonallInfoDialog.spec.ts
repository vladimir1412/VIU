import { describe, expect, it, vi } from 'vitest';
import { PersonalInfo } from '@/models/personalInfo';
import { DOMWrapper, mount } from '@vue/test-utils';

import PersonalInfoDialog from '@/components/PersonalInfoDialog.vue';
import { Gender } from '@/models/gender';

describe('PersonalInfoDialog', () => {
  expect(PersonalInfoDialog).toBeTruthy();

  const isOpen: boolean = true;
  const profileInfo: PersonalInfo = {
    name: 'Steve',
    familyName: 'Jobs',
    gender: Gender.Other,
    otherGender: 'non-binary',
    birthdate: '2023-07-12',
  };

  it('should check if dialog is rendered correctly', () => {
    const wrapper = mount(PersonalInfoDialog, {
      props: {
        profileInfo,
        isOpen,
      },
    });

    const DIALOG_LABEL: string = 'Submitted Personal Information';
    const dialogElement: DOMWrapper<Element> = wrapper.find('[data-test-id="dialog"]');
    const dialogLabel = (dialogElement.element as any).label;

    expect(wrapper.props().isOpen).toBe(isOpen);
    expect(dialogElement.exists()).toBe(true);
    expect(dialogElement.classes('personal-info-dialog')).toBe(true);
    expect(dialogLabel).toBe(DIALOG_LABEL);
  });

  it('should check if props exist in the component', () => {
    const wrapper = mount(PersonalInfoDialog, {
      props: {
        profileInfo,
        isOpen,
      },
    });

    const props = wrapper.props().profileInfo;

    expect(props.name).toBeTruthy();
    expect(props.familyName).toBeTruthy();
    expect(props.gender).toBeTruthy();
    expect(props.otherGender).toBeTruthy();
    expect(props.birthdate).toBeTruthy();
  });

  it('should verify profile information is rendered correctly', () => {
    const wrapper: any = mount(PersonalInfoDialog, {
      props: {
        profileInfo,
        isOpen,
      },
    });

    const expectedDate: string = '07/12/2023';
    const formattedDate = wrapper.vm.getFormattedDate(profileInfo.birthdate);

    const nameElement: DOMWrapper<Element> = wrapper.find('[data-test-id="profile-info-name"]');
    const familyNameElement: DOMWrapper<Element> = wrapper.find(
      '[data-test-id="profile-info-family-name"]'
    );
    const genderElement: DOMWrapper<Element> = wrapper.find('[data-test-id="profile-info-gender"]');
    const birthdateElement: DOMWrapper<Element> = wrapper.find(
      '[data-test-id="profile-info-birthdate"]'
    );

    expect(nameElement.text()).toBe(profileInfo.name);
    expect(familyNameElement.text()).toBe(profileInfo.familyName);
    expect(genderElement.text()).toBe(profileInfo.otherGender);
    expect(formattedDate).toBe(expectedDate);
    expect(birthdateElement.text()).toBe(expectedDate);
  });

  it('should trigger reset-form event on button click', async () => {
    const wrapper: any = mount(PersonalInfoDialog, {
      props: {
        profileInfo,
        isOpen,
      },
    });

    const resetFormButtonElement: DOMWrapper<Element> = wrapper.find(
      '[data-test-id="reset-form-button"]'
    );
    await resetFormButtonElement.trigger('click');
    const handleResetFormMock = vi.fn();

    wrapper.vm.handleResetForm = handleResetFormMock;
    wrapper.vm.handleResetForm();

    expect(handleResetFormMock).toHaveBeenCalled();
    expect(wrapper.emitted()).toHaveProperty('reset-form');
    expect(wrapper.emitted('reset-form')).toBeTruthy();
  });

  it('should return typed gender when option Other is selected from the select', () => {
    const profileInfo = {
      name: 'Steve',
      familyName: 'Jobs',
      gender: Gender.Other,
      otherGender: 'non-binary',
      birthdate: '2023-07-12',
    };
    const wrapper: any = mount(PersonalInfoDialog, { props: { profileInfo, isOpen } });

    expect(wrapper.vm.getGender()).toBe('non-binary');
  });

  it('should return gender Male when profileInfo gender is not Other', () => {
    const profileInfo = {
      name: 'Steve',
      familyName: 'Jobs',
      gender: Gender.Male,
      otherGender: '',
      birthdate: '2023-07-12',
    };
    const wrapper: any = mount(PersonalInfoDialog, { props: { profileInfo, isOpen } });
    expect(wrapper.vm.getGender()).toBe(Gender.Male);
  });

  it('should return date  in MM/DD/YYYY format', () => {
    const profileInfo = {
      name: 'Steve',
      familyName: 'Jobs',
      gender: Gender.Male,
      otherGender: '',
      birthdate: '2023-07-12',
    };
    const wrapper: any = mount(PersonalInfoDialog, { props: { profileInfo, isOpen } });

    const date = wrapper.vm.getFormattedDate('2023-07-12');

    expect(date).toBe('07/12/2023');
  });

  it("should return date as empty string if date doesn't exist", () => {
    const profileInfo = {
      name: 'Steve',
      familyName: 'Jobs',
      gender: Gender.Male,
      otherGender: '',
      birthdate: '2023-07-12',
    };
    const wrapper: any = mount(PersonalInfoDialog, { props: { profileInfo, isOpen } });

    const date = wrapper.vm.getFormattedDate('');

    expect(date).toBe('');
  });
});

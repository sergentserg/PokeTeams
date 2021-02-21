import { MAX_FILE_SIZE } from 'src/shared/util/constants';
import PhotoUpload from './PhotoUpload';
import DetailsForm from './DetailsForm';
import { Alert } from 'src/shared/components/Alert';
import { authState } from '../../auth/AuthState';

export default class ProfileView {
  constructor() {
    this.view = document.querySelector('.main');
    this.view.id = 'profile';
    const { name, photo } = authState.getMe();
    this.photoUpload = new PhotoUpload(photo);
    this.detailsForm = new DetailsForm(name);
  }

  render() {
    while (this.view.firstElementChild) this.view.firstElementChild.remove();

    // Header
    const title = document.createElement('h2');
    title.textContent = 'Profile';
    this.view.append(title);

    // Trainer name.
    this.detailsForm
      .getComponent()
      .addEventListener('submit', this.updateName.bind(this));
    this.view.append(this.detailsForm.getComponent());

    // Photo
    this.photoUpload
      .getComponent()
      .addEventListener('change', this.uploadPhoto.bind(this));
    this.view.append(this.photoUpload.getComponent());
  }

  async uploadPhoto(e) {
    const files = e.target.files;
    let alert;
    if (files.length !== 0) {
      if (files[0].size > MAX_FILE_SIZE) {
        alert = Alert(false, 'Image size is too large');
      } else {
        const success = await authState.uploadPhoto(files[0]);
        alert = Alert(
          success,
          success ? 'Photo updated!' : 'Unable to upload photo'
        );
      }
      this.view.insertBefore(alert, this.view.firstElementChild);
      // Force image reload.
      const timestamp = new Date().getTime();
      document.querySelector('#profilePhoto').src =
        authState.getPhotoUrl() + `?t=${timestamp}`;
    }
  }

  async updateName(e) {
    e.preventDefault();
    const name = e.target.elements['trainerName'].value;
    let alert;
    // Same name submitted; ignore.
    if (name == authState.getMe().name) {
      alert = Alert(false, 'Provide new name.');
    } else {
      const success = await authState.update({ name: name });
      alert = Alert(success, success ? 'Updated name' : 'Unable to update');
    }
    this.view.insertBefore(alert, this.view.firstElementChild);
  }
}

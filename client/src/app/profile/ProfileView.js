import { MAX_FILE_SIZE } from 'src/shared/util/constants';
import PhotoUpload from './PhotoUpload';
import DetailsForm from './DetailsForm';
import { gAlert } from '../../shared/components/Alert';
import { authState } from '../../auth/AuthState';

export default class ProfileView {
  constructor(main) {
    this.main = main;
    this.main.id = 'profile';
    const { name, photo } = authState.getMe();
    this.photoUpload = new PhotoUpload(photo);
    this.detailsForm = new DetailsForm(name);
  }

  render() {
    while (this.main.firstElementChild) this.main.firstElementChild.remove();

    // Header
    const title = document.createElement('h2');
    title.textContent = 'Profile';
    this.main.append(title);

    // Trainer name.
    this.detailsForm
      .get()
      .addEventListener('submit', this.updateName.bind(this));
    this.main.append(this.detailsForm.get());

    // Photo
    this.photoUpload
      .get()
      .addEventListener('change', this.uploadPhoto.bind(this));
    this.main.append(this.photoUpload.get());
  }

  async uploadPhoto(e) {
    const files = e.target.files;
    if (files.length !== 0) {
      if (files[0].size > MAX_FILE_SIZE) {
        gAlert.update(false, 'Image size is too large');
      } else {
        const success = await authState.uploadPhoto(files[0]);
        gAlert.update(
          success,
          success ? 'Photo updated!' : 'Unable to upload photo'
        );
      }
      this.main.insertBefore(gAlert.get(), this.main.firstElementChild);
      document.querySelector('#profilePhoto').src = authState.getPhotoUrl();
    }
  }

  async updateName(e) {
    e.preventDefault();
    const name = e.target.elements['trainerName'].value;
    // Same name submitted; ignore.
    if (name == authState.getMe().name) {
      gAlert.update(false, 'Provide new name.');
    } else {
      const success = await authState.update({ name: name });
      gAlert.update(success, success ? 'Updated name' : 'Unable to update');
    }
    this.main.insertBefore(gAlert.get(), this.main.firstElementChild);
  }
}

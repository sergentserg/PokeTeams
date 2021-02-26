import Loading from '../assets/loading.gif';

export default class LoadingGif {
  constructor() {
    this.container = document.createElement('div');
    this.container.classList =
      'd-flex justify-content-center align-items-center';
    this.container.style.position = 'absolute';
    this.container.style.top = '0';
    this.container.style.bottom = '0';
    this.container.style.left = '0';
    this.container.style.right = '0';
    this.container.style.zIndex = '100';

    const loadingImg = new Image();
    loadingImg.src = Loading;
    this.container.append(loadingImg);
  }

  get() {
    return this.container;
  }
}

export const gLoadingGif = new LoadingGif();

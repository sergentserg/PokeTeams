import Loading from '../assets/loading.gif';

export default function LoadingGif() {
  const container = document.createElement('div');
  container.classList = 'd-flex justify-content-center align-items-center';
  container.style.position = 'absolute';
  container.style.top = '0';
  container.style.height = '100vh';
  container.style.width = '100vw';

  const loadingImg = new Image();
  loadingImg.src = Loading;
  container.append(loadingImg);

  return container;
}

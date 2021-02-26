import { gLoadingGif } from '../components/LoadingGif';

export default async function fetchLoad(url, opts) {
  // Remove loading gif if present.
  gLoadingGif.get().remove();

  // Display loading gif before fetching.
  const main = document.querySelector('.main');
  main.style.opacity = '0.5';
  main.append(gLoadingGif.get());

  // Removing loading gif after fetching.
  const res = await fetch(url, opts);
  main.style.removeProperty('opacity');
  gLoadingGif.get().remove();
  return res;
}

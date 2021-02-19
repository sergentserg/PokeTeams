export default class MovesView {
  constructor(state) {
    this.state = state;
    this.view = document.querySelector('.main');
    this.view.id = 'moves';
  }

  render() {
    // Header
    const title = document.createElement('h3');
    title.textContent = 'Moves';
    this.view.append(title);
  }
}

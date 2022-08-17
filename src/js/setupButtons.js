export default class LoadMoreBtn {
  constructor({ selector, hidden = true }) {
    this.btn = this.getEl(selector);
    hidden && this.hide();
  }
  
  getEl(selector) { 
  return document.querySelector(selector)
  }
  
  show() {
   this.btn.classList.remove('is-hidden');
  }

  hide() {
   this.btn.classList.add('is-hidden');
  }

  enable() {
    this.btn.disabled = false;
    this.btn.textContent = "Завантажити ще";
  }

  disable() { 
    this.btn.disabled = true;
    this.btn.textContent = "Loading...";
  }
}
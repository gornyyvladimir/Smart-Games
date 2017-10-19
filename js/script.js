const info = document.querySelector('.profile__info');
const menu = document.querySelector('.profile__menu');

info.onclick = () => menu.classList.toggle('profile__menu--is-active');
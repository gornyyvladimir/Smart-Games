const dropdown = document.querySelector('.profile__dropdown');
const menu = document.querySelector('.profile__menu');

dropdown.onclick = (event) => {
	event.preventDefault();
	menu.classList.toggle('profile__menu--is-active');
};
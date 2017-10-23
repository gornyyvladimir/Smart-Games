const dropdown = document.querySelector('.profile__dropdown');
const menu = document.querySelector('.profile__menu');

//Меню
dropdown.onclick = (event) => {
    event.preventDefault();
    menu.classList.toggle('profile__menu--is-active');
};

document.addEventListener('DOMContentLoaded', getData);

const gameTableContainer = document.querySelector('.games-table');

//Получить данные и вставить на страницу
function getData() {

    let data;
    const xhr = new XMLHttpRequest();

    xhr.open('GET', 'data.json');

    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
            // обработать ошибку
            // alert(xhr.status + ': ' + xhr.statusText);
            const error = document.createElement('H1');
            error.classList.add('games-table__error');
            error.appendChild(document.createTextNode('Sorry :( ' + xhr.status + ': ' + xhr.statusText));
            gameTableContainer.appendChild(error);
        } else {
            try {
                data = JSON.parse(xhr.responseText);
            } catch (e) {
                const error = document.createElement('H1');
                error.classList.add('games-table__error');
                error.appendChild(document.createTextNode('Wrong data :( ' + e.message));
                gameTableContainer.appendChild(error);
                // alert("Некорректный ответ " + e.message);
            }
            //Заполняем таблицу
            gameTableContainer.appendChild(createTable(data));

            //Вешаем обработчик на Score
            const scoreTitle = document.querySelector('.games-table__score');
            scoreTitle.addEventListener('click', sortByScore);
        }

    }

    xhr.send();

    //Значок загрузки можно воткнуть сюда

}

//очитска контейнера
function clearContainer(container) {
    // очистить всё
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

//создание таблицы из полученных данных
function createTable(data) {

    //создать тиблицу
    const table = document.createElement('TABLE');
    table.classList.add('games-table__table');

    //создать tbody и первую строку с заголовками 
    const tbody = document.createElement('TBODY');
    const trHead = document.createElement('TR');

    //создание заголовков
    const th0 = document.createElement('TH');
    th0.classList.add('games-table__title');
    th0.appendChild(document.createTextNode('Title'));

    const th1 = document.createElement('TH');
    th1.classList.add('games-table__score');
    th1.classList.add('games-table__score--sort');
    th1.appendChild(document.createTextNode('Score'));

    const th2 = document.createElement('TH');
    th2.classList.add('games-table__review');
    th2.appendChild(document.createTextNode('Reviews'));

    const th3 = document.createElement('TH');
    th3.classList.add('games-table__genre');
    th3.appendChild(document.createTextNode('Main Genre'));

    const th4 = document.createElement('TH');
    th4.classList.add('games-table__release-date');
    th4.appendChild(document.createTextNode('Release Date'));

    const th5 = document.createElement('TH');
    th5.classList.add('games-table__status');
    th5.appendChild(document.createTextNode('Status'));

    const th6 = document.createElement('TH');
    th6.classList.add('games-table__icons');

    //добавление заголвков в строку
    trHead.appendChild(th0);
    trHead.appendChild(th1);
    trHead.appendChild(th2);
    trHead.appendChild(th3);
    trHead.appendChild(th4);
    trHead.appendChild(th5);
    trHead.appendChild(th6);

    tbody.appendChild(trHead);
    table.appendChild(tbody);


    //получаем массив с данными
    const games = data.games;

    games.forEach((game) => {
        const tr = document.createElement('TR');

        const tdTitle = document.createElement('TD');
        tdTitle.classList.add('games-table__title-content');

        const img = document.createElement('IMG');
        img.classList.add('games-table__image');
        img.src = game.img;
        img.alt = game.title;
        const info = document.createElement('DIV');
        info.classList.add('games-table__info');

        const name = document.createElement('SPAN');
        name.classList.add('games-table__name');
        name.appendChild(document.createTextNode(game.title));
        const developer = document.createElement('SPAN');
        developer.classList.add('games-table__developer');
        developer.appendChild(document.createTextNode(game.developer));

        info.appendChild(name);
        info.appendChild(developer);

        tdTitle.appendChild(img);
        tdTitle.appendChild(document.createTextNode(' '));
        tdTitle.appendChild(info);

        const tdScore = document.createElement('TD');
        tdScore.classList.add('games-table__score-content');
        const mark = document.createElement('DIV');
        mark.classList.add('games-table__mark');
        //ставим цвет оценке
        if (game.score) {

            if (game.score - Math.floor(game.score) === 0)
                mark.appendChild(document.createTextNode(`${game.score}.0`));
            else
                mark.appendChild(document.createTextNode(game.score));

            if (game.score >= 3 && game.score < 6)
                mark.classList.add('games-table__mark--yellow');
            if (game.score >= 0 && game.score < 3)
                mark.classList.add('games-table__mark--red');
        } else {
            mark.appendChild(document.createTextNode('-'));
            mark.classList.add('games-table__mark--no');
        }

        tdScore.appendChild(mark);

        const tdReview = document.createElement('TD');
        tdReview.classList.add('games-table__review-content');
        const feedback = document.createElement('SPAN');
        feedback.classList.add('games-table__feedback');

        switch (game.reviews.summary) {
            case 0:
                feedback.appendChild(document.createTextNode('Negative'));
                feedback.classList.add('games-table__feedback--red');
                break;
            case 1:
                feedback.appendChild(document.createTextNode('Mixed'));
                feedback.classList.add('games-table__feedback--yellow');
                break;
            case 2:
                feedback.appendChild(document.createTextNode('Positive'));
                break;
            default:
                feedback.appendChild(document.createTextNode('No user reviews'));
                feedback.classList.add('games-table__feedback--no');
        }

        const count = document.createElement('SPAN');
        count.classList.add('games-table__review-count');

        //форматируем вывод количества оценок
        const f = Math.floor(game.reviews.number / 1000);
        let h = game.reviews.number % 1000;
        h = h.toString();
        h = h.length < 3 ? h + '00' : h;

        if (f === 0)
            count.appendChild(document.createTextNode(`(${game.reviews.number})`));
        else
            count.appendChild(document.createTextNode(`(${f},${h})`));

        tdReview.appendChild(feedback);
        if (game.reviews.number > 0)
            tdReview.appendChild(count);


        const tdGenre = document.createElement('TD');
        tdGenre.classList.add('games-table__genre-content');
        tdGenre.appendChild(document.createTextNode(game.mainGenre));

        const tdRelease = document.createElement('TD');
        tdRelease.classList.add('games-table__release-date-content');

        const date = new Date(Date.parse(game.releaseDate));

        //форматируем вывод даты
        const month = date.toLocaleString("en-GB", { month: "short" });
        const day = date.getDate();
        const year = date.getFullYear();

        const dt = `${day} ${month}, ${year}`;

        tdRelease.appendChild(document.createTextNode(dt));

        const tdStatus = document.createElement('TD');
        tdStatus.classList.add('games-table__status-content');
        const statusSale = document.createElement('SPAN');
        statusSale.classList.add('games-table__status-sale');
        switch (game.status) {
            case 0:
                statusSale.appendChild(document.createTextNode('in development'));
                statusSale.classList.add('games-table__status-sale--grey');
                break;
            case 1:
                statusSale.appendChild(document.createTextNode('on sale'));
                statusSale.classList.add('games-table__status-sale--blue');
                break;
            case 2:
                statusSale.appendChild(document.createTextNode('in library'));
                // statusSale.classList.add('games-table__status-sale--blue');          
                break;
        }

        tdStatus.appendChild(statusSale);

        const tdIcons = document.createElement('TD');
        tdIcons.classList.add('games-table__icons-content');
        const icon0 = document.createElement('I');
        icon0.className = 'fa fa-gamepad';
        const icon1 = document.createElement('I');
        icon1.className = 'fa fa-cog';
        const icon2 = document.createElement('I');
        icon2.className = 'fa fa-share-alt';
        const icon3 = document.createElement('I');
        icon3.className = 'fa fa-usd';

        switch (game.status) {
            case 0:
                tdIcons.appendChild(icon0);
                tdIcons.appendChild(document.createTextNode(' '));
                icon0.classList.add('hidden');
                tdIcons.appendChild(icon1);
                tdIcons.appendChild(document.createTextNode(' '));
                icon1.classList.add('hidden');
                tdIcons.appendChild(icon2);
                tdIcons.appendChild(document.createTextNode(' '));
                break;
            case 1:
                tdIcons.appendChild(icon3);
                tdIcons.appendChild(document.createTextNode(' '));
                tdIcons.appendChild(icon1);
                tdIcons.appendChild(document.createTextNode(' '));
                tdIcons.appendChild(icon2);
                tdIcons.appendChild(document.createTextNode(' '));
                break;
            case 2:
                tdIcons.appendChild(icon0);
                tdIcons.appendChild(document.createTextNode(' '));
                tdIcons.appendChild(icon1);
                tdIcons.appendChild(document.createTextNode(' '));
                tdIcons.appendChild(icon2);
                tdIcons.appendChild(document.createTextNode(' '));
                break;
        }


        tr.appendChild(tdTitle);
        tr.appendChild(tdScore);
        tr.appendChild(tdReview);
        tr.appendChild(tdGenre);
        tr.appendChild(tdRelease);
        tr.appendChild(tdStatus);
        tr.appendChild(tdIcons);
        tbody.appendChild(tr);
    });

    return table;
}



//сортировка по клику 
let sortInvert = false;

const sortAsc = (a, b) => {
    let x = Number(a.innerHTML);
    let y = Number(b.innerHTML);

    if (isNaN(x))
        return -1
    if (isNaN(y))
        return 1

    return Number(a.innerHTML) - Number(b.innerHTML);
};

const sortDesc = (a, b) => {
    let x = Number(a.innerHTML);
    let y = Number(b.innerHTML);

    if (isNaN(x))
        return 1
    if (isNaN(y))
        return -1

    return Number(b.innerHTML) - Number(a.innerHTML);
};


function sortByScore() {

    let marks = document.querySelectorAll('.games-table__mark');
    marks = [].slice.call(marks);

    if (sortInvert)
        marks.sort(sortDesc);
    else
        marks.sort(sortAsc);

    const tbody = gameTableContainer.querySelector('tbody');
    const thead = tbody.firstElementChild;

    clearContainer(tbody);

    //возвращаем заголовок
    tbody.appendChild(thead);

    marks.forEach((mark) => {
        const currentRow = mark.parentElement.parentElement;
        tbody.appendChild(currentRow);
    });

    sortInvert = !sortInvert;
}
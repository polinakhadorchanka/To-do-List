let data = [],
    sortType = 0;

document.getElementById('addNewElement').addEventListener('click', function () {
    if (checkData()) {
        let action = document.getElementById('action').value,
            date = document.getElementById('date').value,
            priority = document.getElementById('priority').value;

        obj = {
            id: '',
            action: action,
            date: date,
            priority: priority,
            check: false
        };

        data.push(obj);
        dataSort();
        document.getElementById('dataDiv').innerHTML = '';

        console.log(data);
        for (let i = 0; i < data.length; i++) {
            addNewElement(data[i]);
        }
    }

    clearForm();
});

document.getElementById('action').addEventListener('focus', function () {
    let element = document.getElementById('action');
    element.style.border = '1px solid #9b9b9b';

    element = document.getElementById('p-action');
    element.innerHTML = 'опишите событие';
    element.style.color = '#282828';
});

document.getElementById('date').addEventListener('focus', function () {
    let element = document.getElementById('date');
    element.style.border = '1px solid #9b9b9b';

    element = document.getElementById('p-date');
    element.innerHTML = 'выберите дату';
    element.style.color = '#282828';
});

document.getElementById('sortType').addEventListener('change', function () {
    sortType = +document.getElementById('sortType').value;

    document.getElementById('dataDiv').innerHTML = '';

    dataSort();
    for (let i = 0; i < data.length; i++) {
        addNewElement(data[i]);
    }
});

function dataSort() {
    let count,
        subarray = [],
        date,
        arr1 = [],
        arr2 = [];
    data.sort((prev, next) => {
        if (prev.date > next.date) return -1;
        if (prev.date > next.date) return 1;
    });
    subarray[0] = [];

    count = 0;
    date = data[0].date;
    for (let i = 0; i < data.length; i++) {
        if (data[i].date === date) {
            subarray[count].push(data[i]);
        } else {
            count++;
            date = data[i].date;
            subarray[count] = [];
            i--;
        }
    }

    data = [];

    for (let i = subarray.length - 1; i >= 0; i--) {
        arr1 = [];
        arr2 = [];
        for (let j = 0; j < subarray[i].length; j++) {
            if (subarray[i][j].check === false) {
                arr1.push(subarray[i][j]);
            } else {
                arr2.push(subarray[i][j]);
            }
        }

        arr1.sort((prev, next) => {
            if (prev.priority > next.priority) return -1;
            if (prev.priority > next.priority) return 1;
        });

        arr2.sort((prev, next) => {
            if (prev.priority > next.priority) return -1;
            if (prev.priority > next.priority) return 1;
        });

        subarray[i] = arr1.concat(arr2);
        data = data.concat(subarray[i]);
    }

    setCookie();
}

function addNewElement(obj) {
    if (sortType === 0 || (sortType === 1 && obj.check === false)) {
        let action = obj.action,
            date = obj.date,
            priority = obj.priority,
            block = document.getElementById('dataDiv'),
            newElement, element,
            days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
            colors = ['#598ee6', '#c466ea', '#ea2a53'],
            day = (new Date(date)).getDate(),
            month = (new Date(date)).getMonth(),
            year = (new Date(date)).getFullYear();
        if (month < 10) {
            month = '0' + month;
        }

        if (document.getElementById(date) === null) {
            // добавление таблицы
            newElement = document.createElement('div');
            newElement.id = date;
            block.append(newElement);
            block = newElement;

            newElement = document.createElement('p');
            newElement.classList.add('date');
            newElement.classList.add('' + date);
            newElement.innerHTML = days[(new Date(date)).getDay()] + ', ' + day + '.' + month + '.' + year;
            block.append(newElement);

            newElement = document.createElement('hr');
            newElement.style.height = '2px';
            block.append(newElement);

            newElement = document.createElement('table');
            newElement.id = 'table ' + date;
            block.append(newElement);

            block = newElement;
        } else {
            block = document.getElementById('table ' + date);
        }

        // добавление строки
        newElement = document.createElement('tr');
        newElement.id = 'tr ' + block.id + ' ' + block.rows.length;
        block.append(newElement);
        block = newElement;

        obj.id = 'table ' + date + ' ' +
            (document.getElementById('table ' + date).rows.length - 1);

        // добавление 1го столбца
        newElement = document.createElement('td');
        newElement.style.width = '30px';
        block.append(newElement);
        block = newElement;

        // добавление checkbox
        newElement = document.createElement('input');
        newElement.type = 'checkbox';
        newElement.id = 'check ' + 'table ' + date + ' ' +
            (document.getElementById('table ' + date).rows.length - 1);
        newElement.title = 'отметить как выполненное';
        if (obj.check === true) {
            newElement.checked = true
        }
        block.append(newElement);
        newElement = document.createElement('label');
        newElement.classList.add('l-checkbox');
        newElement.htmlFor = 'check ' + 'table ' + date + ' ' +
            (document.getElementById('table ' + date).rows.length - 1);
        newElement.style.cursor = 'pointer';
        block.append(newElement);

        // Слушатель на checkbox
        newElement.addEventListener('click', function () {
            element = this.htmlFor.split(' ');
            element = element[1] + ' ' + element[2] + ' ' + element[3];

            for (let i = 0; i < data.length; i++) {
                if (data[i].id === element) {
                    if (document.getElementById(this.htmlFor).checked === false) {
                        data[i].check = true;
                        document.getElementById('action ' + element).style.textDecoration = 'line-through';
                    } else {
                        data[i].check = false;
                        document.getElementById('action ' + element).style.textDecoration = 'none';
                    }
                }
            }

            dataSort();
            document.getElementById('dataDiv').innerHTML = '';
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                addNewElement(data[i]);
            }
        });

        block = document.getElementById('tr table ' + date + ' ' +
            (document.getElementById('table ' + date).rows.length - 1));

        // добавление 2го столбца
        newElement = document.createElement('td');
        newElement.id = 'priority table ' + date + ' ' +
            (document.getElementById('table ' + date).rows.length - 1);
        newElement.style.width = '7px';
        newElement.value = priority;
        newElement.bgColor = colors[priority];
        block.append(newElement);

        // добавление 3го столбца с событием
        block = document.getElementById('tr table ' + date + ' ' +
            (document.getElementById('table ' + date).rows.length - 1));
        newElement = document.createElement('td');
        newElement.style.width = '783px';
        newElement.style.paddingLeft = '10px';
        newElement.style.wordBreak = 'break-all';
        newElement.id = 'action table ' + date + ' ' +
            (document.getElementById('table ' + date).rows.length - 1);
        newElement.innerHTML = action;
        if (obj.check === true) {
            newElement.style.textDecoration = 'line-through';
        }
        block.append(newElement);

        // добавление 4го столбца
        block = document.getElementById('tr table ' + date + ' ' +
            (document.getElementById('table ' + date).rows.length - 1));

        // добавление кнопок 'реадактировать' и 'удалить'
        newElement = document.createElement('td');
        newElement.style.width = '50px';
        block.append(newElement);
        block = newElement;

        newElement = document.createElement('img');
        newElement.classList.add('icon');
        newElement.id = 'edit table ' + date + ' ' +
            (document.getElementById('table ' + date).rows.length - 1);
        newElement.src = 'img/edit.png';
        newElement.title = 'редактировать';
        block.append(newElement);

        // Слушатель на edit
        newElement.addEventListener('click', function () {
            element = this.id.split(' ');

            document.getElementById('date').value = element[2];

            element = element[1] + ' ' + element[2] + ' ' + element[3];

            document.getElementById('action').value =
                document.getElementById('action ' + element).innerHTML;

            document.getElementById('priority').value =
                document.getElementById('priority ' + element).value;

            window.scrollTo(0, 0);

            for (let i = 0; i < data.length; i++) {
                if (data[i].id === element) {
                    delete_cookie(i);
                    delete_cookie(data.length - 1);
                    data.splice(i, 1);
                    break;
                }
            }

            if (data.length > 0) {
                dataSort();
            }

            document.getElementById('dataDiv').innerHTML = '';
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                addNewElement(data[i]);
            }
        });

        newElement = document.createElement('img');
        newElement.classList.add('icon');
        newElement.id = 'delete table ' + date + ' ' +
            (document.getElementById('table ' + date).rows.length - 1);
        newElement.src = 'img/delete.png';
        newElement.title = 'удалить';
        block.append(newElement);

        // Слушатель на delete
        newElement.addEventListener('click', function () {
            element = this.id.split(' ');
            element = element[1] + ' ' + element[2] + ' ' + element[3];

            for (let i = 0; i < data.length; i++) {
                if (data[i].id === element) {
                    delete_cookie(i);
                    delete_cookie(data.length - 1);
                    data.splice(i, 1);
                    break;
                }
            }

            if (data.length > 0) {
                dataSort();
            }

            document.getElementById('dataDiv').innerHTML = '';
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                addNewElement(data[i]);
            }
        });
    }
}

function checkData() {
    let countOfErrors = 0,
        element = document.getElementById('action');
    if (element.value === '') {
        element.style.border = '1px solid #ff4146';

        element = document.getElementById('p-action');
        element.innerHTML = 'не может быть пустым';
        element.style.color = '#ff4146';

        countOfErrors++;
    }

    element = document.getElementById('date');
    if (element.value < getTodayDate()) {
        element.style.border = '1px solid #ff4146';

        element = document.getElementById('p-date');
        element.innerHTML = ' не может быть раньше текущей даты';
        element.style.color = '#ff4146';
        countOfErrors++;
    }

    return countOfErrors === 0;
}

function clearForm() {
    document.getElementById('action').value = '';
    document.getElementById('date').value = getTodayDate();
    document.getElementById('priority').value = 1;
}

function getTodayDate() {
    let fullDateTime = new Date(),
        day,
        month,
        year;

    function getNormalDate(date) {
        day = date.getDate();
        month = date.getMonth() + 1;
        year = date.getFullYear();

        if (month < 10) {
            month = '0' + month;
        }

        return year + '-' + month + '-' + day;
    }

    return getNormalDate(fullDateTime);
}

function setCookie() {
    let str, dd;

    for (let i = 0; i < data.length; i++) {
        dd = new Date(data[i].date);
        dd.setDate(dd.getDate() + 1);

        str = i + '=' +
            data[i].action + '//' + data[i].date + '//' + data[i].priority + '//' + data[i].check +
            ';expires=' + dd;
        document.cookie = str;
    }

    document.cookie = 'sortType=' + sortType;
}

function delete_cookie(cookie_name) {
    let cookie_date = new Date();  // Текущая дата и время
    cookie_date.setTime(cookie_date.getTime() - 1);
    document.cookie = cookie_name += "=; expires=" + cookie_date.toGMTString();
}

window.onload = function () {
    let calendar = document.getElementById('date'),
        cookie,
        array = [],
        nameValue = [],
        obj_array = [],
        obj;

    calendar.value = getTodayDate();

    cookie = document.cookie;

    if (cookie !== '') {
        array = cookie.split('; ');

        for (let i = 0; i < array.length; i++) {
            nameValue = array[i].split('=', 2);

            if (nameValue[0] === 'sortType') {
                sortType = +nameValue[1];
                if (sortType === 1) {
                    document.getElementById('sortType').value = 1;
                }
            } else {
                obj_array = nameValue[1].split('//', 4);
                obj = {
                    id: '',
                    action: obj_array[0],
                    date: obj_array[1],
                    priority: obj_array[2],
                    check: (obj_array[3] === 'true')
                };

                data.push(obj);
            }
        }

        if (data.length > 0) {
            dataSort();
            for (let i = 0; i < data.length; i++) {
                addNewElement(data[i]);
            }
        }
    }
};


import { Helpers } from './Helpers.js'

export class Sorting {


    static formaSorting(wrapper) {
        console.log(wrapper)
        const bool = wrapper.style.display === 'flex' ? true : false
        const existingModal = document.querySelector('.modal_podtver');
        if (existingModal) {
            existingModal.remove();
        }
        console.log(bool)
        // Создаем строку с условием внутри шаблона
        const statusRow = bool ? '' : `<div class="row_kritery"><i class="fa fa-check flag_sorting"></i><div class="text_sotring" rel="status">Статус</div></div>`;

        return `
    <div class="modal_podtver">
        <div class='header_podtver'>Параметры сортировки</div>
        <div class='body_podtver body_sorting'>
        ${statusRow}
      <div class="row_kritery"> <i class="fa fa-check flag_sorting"></i><div class="text_sotring" rel="tire">Тип шины</div></div>
<div class="row_kritery"> <i class="fa fa-check flag_sorting"></i><div class="text_sotring" rel="radius">Радиус</div></div>
<div class="row_kritery"> <i class="fa fa-check flag_sorting"></i><div class="text_sotring" rel="width">Ширина</div></div>
<div class="row_kritery"> <i class="fa fa-check flag_sorting"></i><div class="text_sotring" rel="profil">Профиль</div></div>
<div class="row_kritery"> <i class="fa fa-check flag_sorting"></i><div class="text_sotring" rel="type">Тип колеса</div></div>
<div class="row_kritery"> <i class="fa fa-check flag_sorting"></i><div class="text_sotring" rel="sezon">Сезонность</div></div>
<div class="row_kritery"> <i class="fa fa-check flag_sorting"></i><div class="text_sotring" rel="massa">Индекс нагрузки</div></div>
<div class="row_kritery"> <i class="fa fa-check flag_sorting"></i><div class="text_sotring" rel="speed">Индекс скорости</div></div>
<div class="row_kritery"> <i class="fa fa-check flag_sorting"></i><div class="text_sotring" rel="protektorpassport">Начальная высота протектора</div></div>
<div class="row_kritery"> <i class="fa fa-check flag_sorting"></i><div class="text_sotring" rel="psi">Максимальное давлеие PSI</div></div>
<div class="row_kritery"> <i class="fa fa-check flag_sorting"></i><div class="text_sotring" rel="ostatok">Остаток протектора</div></div>

        </div>
        <div class='button_podtver'>
            <div class="ok_podtver">Ок</div>
            <div class="cancel_podtver">Отмена</div>
        </div>
    </div>`;
    }

    static userSorting(array, parent, rows) {
        const arrayElements = Array.from(rows)
        arrayElements.sort((a, b) => {
            for (const key of array) {
                const aValue = a.getAttribute(key);
                const bValue = b.getAttribute(key);
                if (key === 'ostatok') {
                    // Сортировка от большего к меньшему для rel === 'ostatok'
                    if (Number(aValue) > Number(bValue)) {
                        return -1;
                    } else if (Number(aValue) < Number(bValue)) {
                        return 1;
                    }
                }
                if (key === 'position') {
                    // Сортировка от большего к меньшему для rel === 'ostatok'
                    if (Number(aValue) < Number(bValue)) {
                        return -1;
                    } else if (Number(aValue) > Number(bValue)) {
                        return 1;
                    }
                }
                else {
                    // Сортировка по умолчанию для других случаев
                    if (aValue !== bValue) {
                        return aValue.localeCompare(bValue);
                    }
                }
            }

            return 0;
        });

        parent.innerHTML = '';
        arrayElements.forEach(e => {
            parent.appendChild(e);
        });
    }


    static formaChangeWheel() {
        const existingModal = document.querySelector('.modal_podtver');
        if (existingModal) {
            existingModal.remove();
        }
        return `<div class="modal_podtver">
            <div class='header_podtver'>Подобрать замену?</div>
            <div class='body_podtver body_sorting'>
                 <div class="row_kritery"> <i class="fa fa-check flag_sorting activFlagSort"></i><div class="text_sotring" rel="model">Производитель</div></div>
                <div class="row_kritery"> <i class="fa fa-check flag_sorting activFlagSort"></i><div class="text_sotring" rel="radius">Радиус</div></div>
                <div class="row_kritery"> <i class="fa fa-check flag_sorting activFlagSort"></i><div class="text_sotring" rel="width">Ширина</div></div>
                <div class="row_kritery"> <i class="fa fa-check flag_sorting activFlagSort"></i><div class="text_sotring" rel="profil">Профиль</div></div>
                <div class="row_kritery"> <i class="fa fa-check flag_sorting activFlagSort"></i><div class="text_sotring" rel="type">Тип колеса</div></div>
                 <div class="row_kritery"> <i class="fa fa-check flag_sorting activFlagSort"></i><div class="text_sotring" rel="massa">Индекс нагрузки</div></div>
                <div class="row_kritery"> <i class="fa fa-check flag_sorting activFlagSort"></i><div class="text_sotring" rel="speed">Индекс скорости</div></div>
                    <div class="row_kritery"> <i class="fa fa-check flag_sorting activFlagSort"></i><div class="text_sotring" rel="sezon">Сезонность</div></div>
                </div>
            <div class='button_podtver'>
                <div class="ok_podtver">Ок</div>
                <div class="cancel_podtver">Отмена</div>
            </div>
        </div>`;
    }

    static podborWheel(array, parent, rows, etalon) {
        const arrayElements = Array.from(rows);
        console.log(etalon)
        // Функция для определения, является ли шина отличающейся по критериям от 'radius', 'width', 'profil', 'massa', 'speed'
        const isDifferentTyre = (element, referenceAttributes) => {
            for (const attr of array) {
                if (element.getAttribute(attr) !== referenceAttributes[attr]) {
                    return true;
                }
            }
            return false;
        };
        // Сохраняем атрибуты эталонного элемента
        const referenceAttributes = {
            'radius': etalon.radius,
            'width': etalon.width,
            'profil': etalon.profil,
            'massa': etalon.index_massa,
            'speed': etalon.index_speed,
            'sezon': etalon.sezon,
            'model': etalon.model,
            'type': etalon.type_tyres,
            'minn': etalon.minn
        };

        arrayElements.sort((a, b) => {
            const referenceValue = Number(referenceAttributes['minn']);
            const aValue = Number(a.getAttribute('minn'));
            const bValue = Number(b.getAttribute('minn'));
            const aValueDiff = referenceValue - Math.abs(referenceValue - aValue);
            const bValueDiff = referenceValue - Math.abs(referenceValue - bValue);
            // Сортировка по ближайшему Minn в порядке возрастания
            if (aValueDiff !== bValueDiff) {
                return bValueDiff - aValueDiff; // изменение порядка сортировки для упорядочивания по наименьшей разнице
            }
            else {
                // Если разница одинаковая, сортируем по возрастанию элементов
                return bValue - aValue;
            }

        });
        let hasVisibleTyress = false; // Флаг для проверки наличия видимых ши
        // Применяем сортировку и скрытие/отображение элементов
        arrayElements.forEach(e => {
            // Сравниваем элемент с эталоном по заданным атрибутам
            if (isDifferentTyre(e, referenceAttributes)) {
                e.style.display = 'none'; // Скрываем элементы, которые не подходят по критериям
            } else {
                if (e.getAttribute('status') == '1') e.style.display = 'flex', hasVisibleTyress = true; // Отображаем элементы, которые подходят
            }
        });
        console.log(hasVisibleTyress)
        parent.innerHTML = '';
        arrayElements.forEach(e => {
            parent.appendChild(e);
        });
        if (!hasVisibleTyress) {
            const mess = document.querySelector('.text_disklaymer')
            Helpers.viewRemark(mess, 'red', 'Подходящих шин нет на складе. Измените параметры подбора.')
        }
    }
}
$(document).ready(function () {
    $('#datatable').DataTable({
        keys: true,
        language: {
            "processing": "Подождите...",
            "search": "Поиск:",
            "lengthMenu": "Показать _MENU_ записей",
            "info": "Записи с _START_ до _END_ из _TOTAL_ записей",
            "infoEmpty": "Записи с 0 до 0 из 0 записей",
            "infoFiltered": "(отфильтровано из _MAX_ записей)",
            "infoPostFix": "",
            "loadingRecords": "Загрузка записей...",
            "zeroRecords": "Записи отсутствуют.",
            "emptyTable": "В таблице отсутствуют данные",
            "paginate": {
                "first": "Первая",
                "previous": "Предыдущая",
                "next": "Следующая",
                "last": "Последняя"
            },
            "aria": {
                "sortAscending": ": активировать для сортировки столбца по возрастанию",
                "sortDescending": ": активировать для сортировки столбца по убыванию"
            }
        },
    });
});

let rIndex, table = document.getElementById('datatable');

function add_sugar() {
    $.ajax({
        type: 'POST',
        url: `/patient/add_sugar/`,
        data: $('form').serializeJSON(),
        dataType: 'json',
        cache: false,

        success: function (result) {
            if (!result) {
                alertify.notify('HTTP Error 403 – Forbidden', 'error', 5);
            } else {
                let newRow = table.insertRow(table.length),
                    cell0 = newRow.insertCell(0),
                    cell1 = newRow.insertCell(1),
                    cell2 = newRow.insertCell(2),
                    id = document.getElementById("id").value,
                    current_time = new Date(),
                    sugar = document.getElementById("sugar").value;

                var date = current_time.getDate();
                var month = current_time.getMonth();
                var year = current_time.getFullYear();
                var hours = current_time.getHours()
                var minutes = current_time.getMinutes()
                var seconds = current_time.getSeconds()

                var last = Number(document.getElementById('datatable_info').innerHTML.split(' ')[6]);

                cell0.innerHTML = last + 1,
                    cell1.innerHTML = date + "-" + (month + 1) + "-" + year + " " + hours + ":" + minutes + ":" + seconds,
                    cell2.innerHTML = sugar
                // call the function to set the event to the new row
                selectedRowToInput();

                new PNotify({
                    title: 'Выполнено',
                    text: 'Запись добавлена!',
                    type: 'success',
                    styling: 'bootstrap3'
                });
            }
        },
        error: function () {
            new PNotify({
                title: 'Ошибка!',
                text: 'Запись не добавлена!',
                type: 'error',
                styling: 'bootstrap3'
            });
        }
    });

// call the function to set the event to the new row
    selectedRowToInput();
}

// display selected row data into input text
function selectedRowToInput() {
    for (let i = 1; i < table.rows.length; i++) {
        table.rows[i].onclick = function () {
            rIndex = this.rowIndex;
            document.getElementById("id").value = this.cells[0].innerHTML;
            document.getElementById("current_time").value = this.cells[1].innerHTML;
            document.getElementById("sugar").value = this.cells[2].innerHTML;
        }
    }
}

selectedRowToInput();

function edit_sugar() {
    $.ajax({
        type: 'POST',
        url: `/patient/edit_sugar/`,
        data: $('form').serializeJSON(),
        dataType: 'json',
        cache: false,
        success: function (result) {
            if (!result) {
                alertify.notify('HTTP Error 403 – Forbidden', 'error', 5);
            } else {
                let id = document.getElementById("id").value,
                    current_time = document.getElementById("current_time").value,
                    sugar = document.getElementById("sugar").value;

                table.rows[rIndex].cells[0].innerHTML = id;
                table.rows[rIndex].cells[1].innerHTML = current_time;
                table.rows[rIndex].cells[2].innerHTML = sugar;

                new PNotify({
                    title: 'Выполнено',
                    text: 'Запись отредактирована!',
                    type: 'success',
                    styling: 'bootstrap3'
                });
            }
        },
        error: function () {
            new PNotify({
                title: 'Ошибка!',
                text: 'Запись не отредактирована!',
                type: 'error',
                styling: 'bootstrap3'
            });
        }
    });
}

function remove_sugar() {
    $.ajax({
        type: 'POST',
        url: `/patient/delete_sugar/${document.getElementById('id').value}`,

        success: function (result) {
            if (!result) {
                alertify.notify('HTTP Error 403 – Forbidden', 'error', 5);
            } else {
                table.deleteRow(rIndex);
                // clear input text
                document.getElementById("id").value = "";
                document.getElementById("current_time").value = "";
                document.getElementById("sugar").value = "";

                new PNotify({
                    title: 'Выполнено',
                    text: 'Запис  удалена!',
                    type: 'success',
                    styling: 'bootstrap3'
                });
            }
        },
        error: function () {
            new PNotify({
                title: 'Ошибка!',
                text: 'Запись не удалена!',
                type: 'error',
                styling: 'bootstrap3'
            });
        }
    });
}


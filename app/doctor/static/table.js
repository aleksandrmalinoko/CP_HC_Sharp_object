$(document).ready(function () {
    $('#patients').DataTable({
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
$(document).ready(function () {
    $('#sugar').DataTable({
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

let rIndex, table = document.getElementById('patients');

function add_patient() {
    $.ajax({
        type: 'POST',
        url: `/doctor/add_patient/`,
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
                    cell3 = newRow.insertCell(3),
                    cell4 = newRow.insertCell(4),
                    id = document.getElementById("id").value,
                    username = document.getElementById("username").value,
                    birthday = document.getElementById("birthday").value,
                    snails = document.getElementById("snails").value,
                    date_reception = new Date();

                var date = date_reception.getDate();
                var month = date_reception.getMonth();
                var year = date_reception.getFullYear();
                var hours = date_reception.getHours()
                var minutes = date_reception.getMinutes()
                var seconds = date_reception.getSeconds()

                var last = Number(document.getElementById('patients_info').innerHTML.split(' ')[6]);

                cell0.innerHTML = last + 1,
                    cell1.innerHTML = username,
                    cell2.innerHTML = birthday,
                    cell3.innerHTML = snails,
                    cell4.innerHTML = date + "-" + (month + 1) + "-" + year + " " + hours + ":" + minutes + ":" + seconds
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
            document.getElementById("username").value = this.cells[1].innerHTML;
            document.getElementById("birthday").value = this.cells[2].innerHTML;
            document.getElementById("snails").value = this.cells[3].innerHTML;
            document.getElementById("date_reception").value = this.cells[4].innerHTML;
        }
    }
}

selectedRowToInput();

function edit_patient() {
    $.ajax({
        type: 'POST',
        url: `/doctor/edit_patient/`,
        data: $('form').serializeJSON(),
        dataType: 'json',
        cache: false,
        success: function (result) {
            if (!result) {
                alertify.notify('HTTP Error 403 – Forbidden', 'error', 5);
            } else {
                let id = document.getElementById("id").value,
                    username = document.getElementById("username").value,
                    birthday = document.getElementById("birthday").value,
                    snails = document.getElementById("snails").value,
                    date_reception = document.getElementById("date_reception").value;

                table.rows[rIndex].cells[0].innerHTML = id;
                table.rows[rIndex].cells[1].innerHTML = username;
                table.rows[rIndex].cells[2].innerHTML = birthday;
                table.rows[rIndex].cells[3].innerHTML = snails;
                table.rows[rIndex].cells[4].innerHTML = date_reception;

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

function remove_patient() {
    $.ajax({
        type: 'POST',
        url: `/doctor/delete_patient/${document.getElementById('id').value}`,

        success: function (result) {
            if (!result) {
                alertify.notify('HTTP Error 403 – Forbidden', 'error', 5);
            } else {
                table.deleteRow(rIndex);
                // clear input text
                document.getElementById("id").value = "";
                document.getElementById("username").value = "";
                document.getElementById("birthday").value = "";
                document.getElementById("snails").value = "";
                document.getElementById("date_reception").value = "";

                new PNotify({
                    title: 'Выполнено',
                    text: 'Запись  удалена!',
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

function open_patient() {

}
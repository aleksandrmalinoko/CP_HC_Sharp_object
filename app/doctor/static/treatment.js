$(document).ready(function () {
    $('#treatment').DataTable({
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

let rIndex, table = document.getElementById('treatment');

function add_treatment() {
    $.ajax({
        type: 'POST',
        url: `/doctor/add_treatment/`,
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
                    title = document.getElementById("title").value,
                    dosage = document.getElementById("dosage").value,
                    form = document.getElementById("form").value,
                    signature = document.getElementById("signature").value;


                var last = Number(document.getElementById('treatment').innerHTML.split(' ')[6]);

                cell0.innerHTML = last + 1,
                    cell1.innerHTML = title,
                    cell2.innerHTML = dosage,
                    cell3.innerHTML = form,
                    cell4.innerHTML = signature
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
            document.getElementById("title").value = this.cells[1].innerHTML;
            document.getElementById("dosage").value = this.cells[2].innerHTML;
            document.getElementById("form").value = this.cells[3].innerHTML;
            document.getElementById("signature").value = this.cells[4].innerHTML;
        }
    }
}

selectedRowToInput();

function edit_treatment() {
    $.ajax({
        type: 'POST',
        url: `/doctor/edit_treatment/`,
        data: $('form').serializeJSON(),
        dataType: 'json',
        cache: false,
        success: function (result) {
            if (!result) {
                alertify.notify('HTTP Error 403 – Forbidden', 'error', 5);
            } else {
                let id = document.getElementById("id").value,
                    title = document.getElementById("title").value,
                    dosage = document.getElementById("dosage").value,
                    form = document.getElementById("form").value,
                    signature = document.getElementById("signature").value;

                table.rows[rIndex].cells[0].innerHTML = id;
                table.rows[rIndex].cells[1].innerHTML = title;
                table.rows[rIndex].cells[2].innerHTML = dosage;
                table.rows[rIndex].cells[3].innerHTML = form;
                table.rows[rIndex].cells[4].innerHTML = signature;

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

function remove_treatment() {
    $.ajax({
        type: 'POST',
        url: `/doctor/delete_treatment/${document.getElementById('id').value}`,

        success: function (result) {
            if (!result) {
                alertify.notify('HTTP Error 403 – Forbidden', 'error', 5);
            } else {
                table.deleteRow(rIndex);
                // clear input text
                document.getElementById("id").value = "";
                document.getElementById("title").value = "";
                document.getElementById("dosage").value = "";
                document.getElementById("form").value = "";
                document.getElementById("signature").value = "";

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
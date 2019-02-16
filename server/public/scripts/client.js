$(document).ready(onReady);

function onReady() {
    console.log('jquery is running');
    closeNewCategoryInput();
    getTasklist();
    $('#category-row').on('change', openNewCategoryInput);
    $('#new-task-modal').on('click', '#close-new-category-button', closeNewCategoryInput);
    $('#category-row').on('click', '#add-category-button', addNewCategory);
    // $('#dropdown-priority').on('click', '.dropdown-existing-button', dropDownPrioritySelection);
    $('.modal-footer').on('click', '#add-task-button', submitTask);
    $('#close-modal-button').on('click', function () {
        clearForm();   
    })
}

let currentDate = new Date().getMonth() + 1 + '/' + new Date().getDate() + '/' + new Date().getFullYear()

function openNewCategoryInput() {
    console.log('add new category option clicked');
    let categoryAdd = $('#display-add-category:selected').text();
    if (categoryAdd == 'ADD NEW') {
        $('#category-row').empty();
        $('#category-row').append(`
        <div class="form-group col-md-12">
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <button class="btn btn-outline-info" id="add-category-button" type="button">Add New Category</button>
                </div>
                <input type="text" id="category-input" class="form-control" placeholder="" aria-label=""
                    aria-describedby="basic-addon1">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" id="close-new-category-button" type="button">X</button>
                </div>
            </div>
        </div>`);
        return;
    } 
}


function closeNewCategoryInput() {
    $('#category-row').empty();
    $('#category-row').append(`
        <div class="form-group col-md-8">
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text">Category</span>
                </div>
                <select id="category-dropdown" class="custom-select form-control">
                </select>
            </div>
        </div>`);
    getCategoryDropdown();
}


function addNewCategory() {
    console.log('add new category drop-down button clicked');
    let newCategory = $('#category-input').val();
   
    if (newCategory) {
        $('#category-input').val(newCategory);
        $.ajax({
            method: 'POST',
            url: '/category',
            data: {
                category: newCategory
            }
        }).then(function () {
            closeNewCategoryInput();
        })     
    }
}



function getCategoryDropdown() {
    $.ajax({
        method: 'GET',
        url: '/category'
    }).then(function (response) {
        $('#category-dropdown').empty();
        $('#category-dropdown').append(`
        <option selected>Choose...</option>`)
        response.forEach(function (category) {
            $('#category-dropdown').append(`<option value="${category.id}">${category.category}</option>`);
            })
            $('#category-dropdown').append(`
            <option id="display-add-category">ADD NEW</option>`);
    })
 }



// function dropDownPrioritySelection() {
//     console.log('priority drop-down option chosen');
//     $('#priority-input').val($(this).text());
// }



function submitTask() {
    console.log('submit button clicked');
    $.ajax({
        method: 'POST',
        url: '/task',
        data: {
            task: $('#task-input').val(),
            category: $('#category-dropdown option:selected').text(),
            priority: $('#priority-dropdown option:selected').text(),
            deadline: $('#deadline-input').val(),
            date_created: currentDate,
            completed: '0',
            note: $('#note-input').val()
        }
    }).then(function () {
        clearForm(); 
        getTasklist();
    })
}



function getTasklist() {
    $.ajax({
        method: 'GET',
        url: '/task'
    }).then(function (response) {
        $('#tasklist-body').empty();
        response.forEach(function (task) {
            $('#tasklist-body').append(`
            <tr>
            <td></td>
            <td>${task.task}</td>
            <td>${task.category}</td>
            <td>${task.priority}</td>
            <td>${task.deadline}</td>
            <td class="center-cell"><button type="button" class="btn btn-info delete-button" data-id="${task.id}">Delete</button></td>
            </tr>
            `)
        })
    })
}

function clearForm() {
    $('input').val('');
    $("#priority-dropdown option:eq(0)").prop("selected", true);
    $("#category-dropdown option:eq(0)").prop("selected", true);
}
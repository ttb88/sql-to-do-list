$(document).ready(onReady);

function onReady() {
    console.log('jquery is running');
    getCategoryDropdown();
    getTasklist();
    $('#dropdown-category').on('click', '.dropdown-existing-button', dropDownCategorySelection);
    $('#dropdown-category').on('click', '#category-dropdown-input-button', dropDownAddNewCategory);
    $('#dropdown-priority').on('click', '.dropdown-existing-button', dropDownPrioritySelection);
    $('#submit-button').on('click', submitTask);
}



function dropDownCategorySelection() {
    console.log('category drop-down existing option chosen');
    $('#category-input').val($(this).text());
}



function dropDownAddNewCategory() {
    console.log('add new category drop-down button clicked');
    let newCategory = $('#category-dropdown-input').val();
   
    if (newCategory) {

        $('#category-input').val(newCategory);

        $.ajax({
            method: 'POST',
            url: '/category',
            data: {
                category: newCategory
            }
        }).then(function () {
            getCategoryDropdown();
            $('#category-dropdown-input').val('');
        })     
    }
}



function getCategoryDropdown() {
    $.ajax({
        method: 'GET',
        url: '/category'
    }).then(function (response) {
        $('#category-dropdown-existing').empty();
        response.forEach(function (category) {
            $('#category-dropdown-existing').append(`
            <button class="dropdown-item dropdown-existing-button" type="button">${category.category}</button>
            `)  
        }) 
    })
 }



function dropDownPrioritySelection() {
    console.log('priority drop-down option chosen');
    $('#priority-input').val($(this).text());
}


function submitTask() {
    console.log('submit button clicked');
    $.ajax({
        method: 'POST',
        url: '/task',
        data: {
            task: $('#task-input').val(),
            category: $('#category-input').val(),
            priority: $('#priority-input').val(),
            deadline: $('#deadline-input').val(),
            date_created: '10/15/1978',
            completed: '0'
        }
    }).then(function () {
        $('input').val('');
        getTasklist()
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
            <td>${task.task}</td>
            <td>${task.category}</td>
            <td>${task.priority}</td>
            <td>${task.deadline}</td>
            <td class="center-cell"><input value="${task.completed}"/></td>
            <td class="center-cell"><button type="button" class="btn btn-info delete-button" data-id="${task.id}">Delete</button></td>
            </tr>
            `)
        })
    })
}
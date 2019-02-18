$(document).ready(onReady);

function onReady() {
    console.log('jquery is running');

    //get current task list and category items from database and display to DOM
    getTasklist();
    getCategoryDropdown();

    // new category event listeners
    $('#category-row').on('click', '#add-category-button', addNewCategory);
    $('#category-row').on('change', openNewCategoryInput);
    $('#modal-form').on('click', '#close-new-category-button', closeNewCategoryInput);

    // modal form event listeners
    $('#modal-form').on('click', '#add-task-button', submitTask);
    $('#modal-form').on('click', '#update-task-button', submitUpdate);
    $('#close-modal-button').on('click', function () {
        clearForm();
    });

    // table event listeners
    $('table').on('click', '.edit-button', editRow);
    $('table').on('click', '.checkbox', checkboxChecked);
    $('table').on('click', '.delete-button', deleteRow);

    // header "+ Add New Task" button event listener
    $('#open-modal-button').on('click', resetAddModalForm);
}

// format current date and set to variable "currentDate"
let currentDate = new Date().getMonth() + 1 + '/' + new Date().getDate() + '/' + new Date().getFullYear();




////////////////////////////                       
//CATEGORY OPERATIONS
///////////////////////////


// new category item will be added to "category" table in database once "Add New Category" button is clicked
function addNewCategory() {
    console.log('add new category drop-down button clicked');
    let newCategory = $('#category-input').val();

    if (newCategory) {
        $('#category-input').val(newCategory);
        $.ajax({
            method: 'POST',
            url: '/categor',
            data: {
                category: newCategory
            }
        }).then(function () {
            closeNewCategoryInput();
        }).catch(function () {
            console.log('New category could not be added');
        });
    }
}


// retrieve category list items from "category" table on database and display in drop-down list on DOM
function getCategoryDropdown() {
    $.ajax({
        method: 'GET',
        url: '/category'
    }).then(function (response) {
        // $('#category-dropdown').empty();
        $('#category-dropdown').replaceWith(`
        <select id="category-dropdown" class="custom-select form-control" required>
        <option selected value="">Choose...</option>`);
        response.forEach(function (category) {
            $('#category-dropdown').append(`<option value="${category.category}">${category.category}</option>`);
        })
        $('#category-dropdown').append(`<option id="display-add-category">ADD NEW</option>`);
        $('#category-dropdown').after(`<div class="invalid-feedback">* required</div>`);
    }).catch(function () {
        console.log('Category content was not recieved');
    });
}


// input to add new category will appear on DOM when "Add New" is chosen from "Category" drop-down list on new task form
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


// once 'x' button is clicked on add new category input, input box on DOM will close and revert back to current "Category" drop-down list
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




////////////////////////////                       
// NEW TASK OPERATIONS 
///////////////////////////


// new task will be added to "task" table on database once "Add Task" button is clicked on DOM
function submitTask() {
    console.log('submit button clicked');
    
    let categorySelected = $('#category-dropdown option:selected').text();
    let prioritySelected = $('#priority-dropdown option:selected').text();
    let taskInput = $('#task-input').val();

    // validate that "Task", "Category" and "Priority" are completed before closing modal and running POST
    if (taskInput == '' || categorySelected == 'Choose...' || prioritySelected == 'Choose...') {
        $('.modal-footer').empty().append(`<button type="submit" class="btn btn-success btn-lg" id="add-task-button">Add Task</button>`);
        $('.modal-footer').empty().append(`<button type="submit" class="btn btn-success btn-lg" id="add-task-button" data-dismiss="modal">Add Task</button>`);
    }
 
    else {
        $.ajax({
            method: 'POST',
            url: '/task',
            data: {
                task: taskInput,
                category: categorySelected,
                priority: prioritySelected,
                priority_id: $('#priority-dropdown option:selected').data().rank,
                deadline: $('#deadline-input').val(),
                date_created: currentDate,
                completed: '',
                note: $('#note-input').val()
            }
        }).then(function () {
            clearForm();
            getTasklist();
        }).catch(function () {
            console.log('New task could not be added');
        });
    } 
}


// current selected task will be updated on "task" table on database once "Update Task" button is clicked on DOM
function submitUpdate() {
    console.log('submit update button clicked');
    $.ajax({
        method: 'PUT',
        url: '/task/update/' + $(this).data().id,
        data: {
            task: $('#task-input').val(),
            category: $('#category-dropdown option:selected').text(),
            priority: $('#priority-dropdown option:selected').text(),
            priority_id: $('#priority-dropdown option:selected').data().rank,
            deadline: $('#deadline-input').val(),
            date_created: currentDate,
            completed: '',
            note: $('#note-input').val()
        }
    }).then(function () {
        clearForm();
        getTasklist();
    }).catch(function () {
        console.log('Task update could not be completed');
    });
}


// get list of tasks from "task" table on database and display on DOM table
function getTasklist() {
    $.ajax({
        method: 'GET',
        url: '/task'
    }).then(function (response) {
        $('#tasklist-body').empty();
        response.forEach(function (task) {
            $('#tasklist-body').append(`
                <tr class="d-flex ${verifyPriority(task).color}">
                <td class="col-1"><input type="checkbox" class="checkbox" data-id="${task.id}" aria-label="Checkbox for following text input" ${task.completed}></td>
                <td class="col-3">${task.task}</td>
                <td class="col-2">${task.category}</td>
                <td class="col-1 priority-row">${task.priority}</td>
                <td class="col-1">${formatDate(task.deadline)}</td>
                <td class="col-3">${task.note}</td>
                <td class="col-1 last-cell"${addDeleteButton(task)}></td>
                </tr>
                `);
        });
    }).catch(function () {
        console.log('Task-list could not be received');
    });
}




////////////////////////////                       
// UPDATE TASK OPERATIONS 
///////////////////////////


// once "Edit/Info" button is clicked on DOM, current selected row content will be set to variable "selectedRowObject"
function editRow() {
    let selectedID = $(this).data().id;

    $.ajax({
        method: 'GET',
        url: '/task'
    }).then(function (response) {
        let selectedRowObject;
        response.forEach(function (task, i) {
            if (selectedID == task.id) {
                selectedRowObject = task;
            }
        });
        console.log('selected object', selectedRowObject);
        appendEditForm(selectedRowObject);
    }).catch(function () {
        console.log('Task-list could not be received');
    });
}


// modal edit form will be set to current selected values on DOM
function appendEditForm(selectedRowObject) {
    console.log(selectedRowObject.priority);
    $('.modal-title').text('Edit Existing Task');
    $('#task-input').val(selectedRowObject.task);
    $('#category-dropdown').val(selectedRowObject.category);
    $('#priority-dropdown').val(selectedRowObject.priority);
    $('#note-input').val(selectedRowObject.note);
    $('#deadline-input').val(selectedRowObject.deadline);
    $('.modal-footer').replaceWith(`
     <div class="modal-footer">
        <button type="button" class="btn btn-success btn-lg" id="update-task-button" data-dismiss="modal" data-id="${selectedRowObject.id}">Update Task</button>
    </div>
    `);
}




/////////////////////////////////                        
// CHECKBOX & DELETE OPERATIONS 
////////////////////////////////


// receive click on checkbox and if checked will update  "task" table on database and replace "Edit/Info" button with "Delete" button on DOM
// if unchecked database will be updated and DOM will revert to original state
function checkboxChecked() {
    console.log('checkbox clicked');

    if (this.checked == true) {
        console.log('checkbox is checked');

        let addDelete = $(this).closest('tr').find('.last-cell').replaceWith(function () {
            return $('<td class="col-1 last-cell"><button type="button" class="btn btn-outline-secondary btn-sm btn-block delete-button">Delete</button></td>').hide().fadeIn(500)
        });

        $.ajax({
            method: 'PUT',
            url: '/task/' + $(this).data().id,
            data: {
                completed: 'checked',
                priority_id: '5'
            }
        }).then(function () {
            addDelete;
            setTimeout(
                function () {
                    getTasklist();
                }, 500);
        }).catch(function () {
            console.log('Checkbox check could not be sent');
        });
    }
    else {
        console.log('checkbox is unchecked');
        let priorityLabel = $(this).closest('tr').find('.priority-row').text();

        $.ajax({
            method: 'PUT',
            url: '/task/' + $(this).data().id,
            data: {
                completed: '',
                priority_id: verifyPriority(0, priorityLabel).rank
            }
        }).then(function () {
            getTasklist();
        }).catch(function () {
            console.log('Checkbox un-check could not be sent');
        });
    }
}


// replace "Edit/Info" button with "Delete" button on DOM
function addDeleteButton(task) {
    let deleteButton = ` center-cell"><button type="button" class="btn btn-outline-secondary btn-sm btn-block delete-button" data-id="${task.id}">Delete</button`;
    let editButton = ` center-cell"><button type="button" class="btn btn-outline-secondary btn-sm btn-block edit-button" data-id="${task.id}" data-toggle="modal" data-target=".bd-example-modal-lg">Edit/Info</button`;
    if (task.completed == 'checked') {
        return deleteButton;
    }
    else {
        return editButton;
    }
}


// once "Delete" button is clicked on DOM, selected row will fade out on DOM and be deleted from "task" table on database
function deleteRow() {
    console.log('delete button clicked');
    $(this).closest('tr').fadeOut(1000);
    $.ajax({
        method: 'DELETE',
        url: '/task/' + $(this).data().id
    }).then(function () {
        setTimeout(
            function () {
                getTasklist();
            }, 800);
    }).catch(function () {
        console.log('Row could not be deleted');
    });
}




/////////////////////////////                         
//  FORMATTING OPERATIONS  
////////////////////////////


// set the background color for each row based on it's checkbox and priority status
function verifyPriority(task, priority) {

    if (task.completed == 'checked') {
        return { color: 'bg-light text-muted' };
    }
    else if (task.priority == 'Today' || priority == 'Today') {
        return { color: 'table-danger', rank: 1 };
    }
    else if (task.priority == 'Tomorrow' || priority == 'Tomorrow') {
        return { color: 'table-warning', rank: 2 };
    }
    else if (task.priority == 'Soon' || priority == 'Soon') {
        return { color: 'table-success', rank: 3 };
    }
    else if (task.priority == 'Eventually' || priority == 'Eventually') {
        return { color: 'table-info', rank: 4 };
    }

}


// format date inside "Deadline" column on table
function formatDate(task) {
    if (task == '') {
        return '';
    }
    else {
        let formattedDate = new Date(task).getMonth() + 1 + '/' + new Date(task).getDate();
        return formattedDate;
    }
}


// reset modal form title heading and button text back to original 'create new task' state
function resetAddModalForm() {
    $('.modal-title').text('Create New Task');
    $('.modal-footer').replaceWith(`
     <div class="modal-footer">
        <button type="button" class="btn btn-success btn-lg" id="add-task-button" data-dismiss="modal">Add Task</button>
    </div>
    `);
    closeNewCategoryInput();
}


// clear all input and drop-down fields on modal form
function clearForm() {
    $('input').val('');
    $("#priority-dropdown option:eq(0)").prop("selected", true);
    $("#category-dropdown option:eq(0)").prop("selected", true);
}


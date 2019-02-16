$(document).ready(onReady);

function onReady() {
    console.log('jquery is running');
    $('#dropdown-category').on('click', '.dropdown-existing-button', dropDownCategorySelection);
    $('#dropdown-category').on('click', '#category-dropdown-input-button', dropDownAddNewCategory);
    $('#dropdown-priority').on('click', '.dropdown-existing-button', dropDownPrioritySelection);
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
        $('#category-dropdown-input').val('');
        $('#category-dropdown-existing').append(`
    <button class="dropdown-item dropdown-existing-button" type="button">${newCategory}</button>
    `)  
    }
}

function dropDownPrioritySelection() {
    console.log('priority drop-down option chosen');
    $('#priority-input').val($(this).text());
}

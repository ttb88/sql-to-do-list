$(document).ready(onReady);

function onReady() {
    console.log('jquery is running');
    getCategoryDropdown();
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


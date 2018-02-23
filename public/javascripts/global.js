// UserList data array for filling in info box
var userListData = [];

// DOM Ready ==================================
$(document).ready(function() {
    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddUser').on('click', addUser);

    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

    // Edit User link click
    $('#userList table tbody').on('click', 'td a.linkedituser', fillEditForm);

    // Edit User button click
    $('#btnEditUser').on('click', saveEditUser);

    // Populate the user table on initial page load
    populateTable();
});

// Functions ==================================

// Fill table with data
function populateTable() {
    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON('/users/userlist', function (data) {

        // Stick our user data array into a userlist variable in the global object
        userListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function() {
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id +
                '">delete</a></td>';
            tableContent += '<td><a href="#" class="linkedituser" rel="' + this._id +
                '">edit</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });

};

// Show user info
function showUserInfo(event) {

    // Prevent Link from firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get index of object based on id value
    // Using .map to create a new array of usernames. Sets arrayPosition to the index of each username
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

    // Get our User object
    var thisUserObject = userListData[arrayPosition];

    // Populate info box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);
}

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to our addUser service (in users.js)
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function(response) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
                populateTable();
            } else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    } else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
}

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user is confirmed
    if (confirmation === true) {

        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function(response) {

            // Check for a successful (blank) response
            if (response.msg === '') {

            } else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();
        });
    } else {

        // No to confirmation
        return false;
    }
}

// Edit User
function fillEditForm(event) {
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisId = $(this).attr('rel');

    // Get index of object based on id value
    // Using .map to create a new array of usernames. Sets arrayPosition to the index of each username
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisId);

    // Get our User object
    var thisUserObject = userListData[arrayPosition];

    // Populate edit form
    $('#inputEditUserName').val(thisUserObject.username);
    $('#inputEditUserEmail').val(thisUserObject.email);

    $('#inputEditUserFullname').val(thisUserObject.fullname);
    $('#inputEditUserAge').val(thisUserObject.age);

    $('#inputEditUserLocation').val(thisUserObject.location);
    $('#inputEditUserGender').val(thisUserObject.gender);

    // add the id to the form object
    $('#editUser').attr('data-uid', thisId);
}

// Save Edit User
function saveEditUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#editUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var replaceUser = {
            'uid': $('#editUser').attr('data-uid'),
            'username': $('#editUser fieldset input#inputEditUserName').val(),
            'email': $('#editUser fieldset input#inputEditUserEmail').val(),
            'fullname': $('#editUser fieldset input#inputEditUserFullname').val(),
            'age': $('#editUser fieldset input#inputEditUserAge').val(),
            'location': $('#editUser fieldset input#inputEditUserLocation').val(),
            'gender': $('#editUser fieldset input#inputEditUserGender').val()
        }

        $.ajax({
            type: 'PUT',
            data: replaceUser,
            url: '/users/edituser/' + replaceUser.uid,
            dataType: 'JSON'
        }).done(function(response) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#editUser fieldset input').val('');

                // Update the table
                populateTable();

                // refreshUserInfo(replaceUser.uid);
                //$("#userInfoName").html(replaceUser.fullname);

                // Populate info box
                $('#userInfoName').html(replaceUser.fullname);
                $('#userInfoAge').html(replaceUser.age);
                $('#userInfoGender').html(replaceUser.gender);
                $('#userInfoLocation').html(replaceUser.location);


            } else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });



    } else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
}


function refreshUserInfo(userId) {

    event.preventDefault();

    var currId = userId;
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(currId);

    // Get our User object
    var thisUserObject = userListData[arrayPosition];

    // Populate info box
    $('#userInfoName').html(thisUserObject.fullname);
    $('#userInfoAge').html(thisUserObject.age);
    $('#userInfoGender').html(thisUserObject.gender);
    $('#userInfoLocation').html(thisUserObject.location);
}

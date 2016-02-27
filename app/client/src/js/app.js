$(document).ready(function() {
  "use strict"


  // Create New User
  $('.user-selection button').on('click', function() {
    var usernameInput = $('#username').val();
    var newUser = {"username": usernameInput};
    console.log(newUser);
    $.ajax({
      url: '/users',
      type: 'POST',
      dataType: 'json',
      data: newUser,
      success: function(res, status) {
        console.log('created new user: ' + res.username + 'with id: ' + res._id );
        window.location.replace('users/' + res._id + '/');
      }
    });
    return false;
  });

  // Setup User Info
  $.get('username', function(username) {
    $('.user-info .username').text(username);
  });
    // add the complete and remaining part here and make it a FXN

  // Create Tabs
  var tabs = [];
  tabs.push($('<a href="#"><span class="tab" data-tab="1">Latest</span></a>'));
  tabs.push($('<a href="#"><span class="tab" data-tab="2">Oldest</span></a>'));
  tabs.push($('<a href="#"><span class="tab" data-tab="3">Tags</span></a>'));
  tabs.push($('<a href="#"><span class="tab" data-tab="4">Add</span></a>'));
  $('.tab-list').append(tabs);

  $('.tab-list a span').on('click', function() {
    $('.tab-list a span').removeClass('active');
    $(this).addClass('active');
    $('.tab-content').empty();

    var tabNumber = parseInt($(this).attr('data-tab'));

    switch (tabNumber) {
      case 1:
        $.get('todos.json', function(todoList) {
          var $content = $('<ul>');
          for(var i=todoList.length-1; i>=0; i--) {
            var $li = $('<li>'),
                $input = $('<input type="checkbox" id="' + todoList[i]._id + '">'),
                $label = $('<label for="' + todoList[i]._id + '">' + todoList[i].description + '</label>');
                if (todoList[i].complete) {
                  $input.attr('checked', 'checked');
                }
                $content.append($li, $input, $label);
          }
          $('.tab-content').html($content);
          $content.before('<label>Latest Todos:</label>');
        }); // end GET
        break;

      case 2:
        $.get('todos.json', function(todoList) {
          var $content = $('<ul>');
          todoList.forEach(function(todo) {
            var $li = $('<li>'),
                $input = $('<input type="checkbox" id="' + todo._id + '">'),
                $label = $('<label for="' + todo._id + '">' + todo.description + '</label>');
                if (todo.complete) {
                  $input.attr('checked', 'checked');
                }
                $content.append($li, $input, $label);
          });
          $('.tab-content').html($content);
          $content.before('<label>Oldest Todos:</label>');
        }); // end GET
        break;

      case 3:
        $.get('todos.json', function(todoList) {
          // call organizedByTags to organize todos by tags
          var tagTodos = organizedByTags(todoList);
          // will receive array: [{tag: ... , descriptions: [{id: '', description: '', complete: ''}] }];
          tagTodos.forEach(function(tag) {
            var $content = $('<div>');
            $content.append('<h3>' + tag.tag + '</h3>');
            var $todosList = $('<ul>');
            tag.descriptions.forEach(function(description) {
              var $li = $('<li>'),
                  $input = $('<input type="checkbox" id="' + description._id + '">'),
                  $label = $('<label for="' + description._id + '">' + description.description + '</label>');
                  if (description.complete) {
                    $input.attr('checked', 'checked');
                  }
                  $li.append($input, $label);
                  $todosList.append($li);
            });
            $content.append($todosList);
            $('.tab-content').append($content);
          });
        }); // end GET
        break;

      case 4:
        var $content = $('<form class="new-todo">'),
            $descriptionLabel = $('<label for="description">Description</label>'),
            $descriptionInput = $('<input type="text" id="description" placeholder="Cook dinner">'),
            $tagsLabel = $('<label for="tags">Tags</label>'),
            $tagsInput = $('<input type="text" id="tags" placeholder="Food, Chores, Cooking">'),
            $submitButton = $('<button class="primary-btn">Add Todo</button>');

        $content.append($descriptionLabel, $descriptionInput, $tagsLabel, $tagsInput, $submitButton);
        $('.tab-content').append($content);


        // form sumbit: add new todo
        $submitButton.on('click', function() {
          // create JSON object for server
          var description = $('#description').val().trim(),
              tags = $('#tags').val().split(', '),
              newTodo = {"description": description, "tags": tags};

          // POST request to server
          $.post('todos', newTodo, function(res) {
            console.log('we posted and the server responded: ' + res);
            $('.tab-list a:first-child span').trigger('click');
          });
          return false;
        }); // end button click
        break;
    } // end switch statement
    return false;
  });

  var organizedByTags = function(todoList) {
    // extract and store unique tags into array
    var tags = [];
    todoList.forEach(function(todo) {
      // find unique tags and add them to tags[]
      todo.tags.forEach(function(tag) {
        if (tags.indexOf(tag) === -1) {
          tags.push(tag);
        }
      });
    });

    // now get descriptions based on unique tags
    var tagDescriptions = tags.map(function(tag) {
      // hold all descriptions linked to tag
      var descriptions = [];
      todoList.forEach(function(todo) {
        if (todo.tags.indexOf(tag) !== -1) {
          descriptions.push({_id: todo._id, description: todo.description, complete: todo.complete});
        }
      });
      // return a final object per tag with corresponding descriptions
      return {tag: tag, descriptions: descriptions};
    });
    return tagDescriptions;
  }; // end organizedByTags

  // trigger click on first tab
  $('.tab-list a:first-child span').trigger('click');


  // complete todo (event delegation)
  $('.tab-content').on('click', 'label', function() {
    console.log($(this).attr('for'));
    var id = $(this).attr('for');
    $.ajax({
      'url': 'todos/' + id,
      'type': 'PUT',
    }).done(function(res) {
      console.log('updated todo complete status');
    }).fail(function(err) {
      console.log(err);
    });
  }); // end complete todo

  // clear completed
  $('.user-info button').on('click', function() {
    $.ajax({
      'url': 'todos',
      'type': 'DELETE'
    }).done(function(res) {
      console.log('all completed todos were cleared');
    }).fail(function(err) {
      console.log(err);
    });
    $('.tab-list a:first-child span').trigger('click');
    return false;
  });
});

$(document).ready(function() {
  "use strict"

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
            var $todo = $('<li>');
            $todo.append('<input type="checkbox" id="c' + todoList[i].id + '">');
            $todo.append('<label for="c' + todoList[i].id + '">' + todoList[i].description + '</label>');
            $content.append($todo);
          }
          $('.tab-content').html($content);
          $content.before('<label>Latest Todos:</label>');
        }); // end GET
        break;

      case 2:
        $.get('todos.json', function(todoList) {
          var $content = $('<ul>');
          todoList.forEach(function(todo) {
            var $todo = $('<li>');
            $todo.append('<input type="checkbox" id="c' + todo.id + '">');
            $todo.append('<label for="c' + todo.id + '">' + todo.description + '</label>');
            $content.append($todo);
          });
          $('.tab-content').html($content);
          $content.before('<label>Oldest Todos:</label>');
        }); // end GET
        break;

      case 3:
        $.get('todos.json', function(todoList) {
          // call organizedByTags to organize todos by tags
          var tagTodos = organizedByTags(todoList);
          // will receive array: [{tag: ... , descriptions: [{id: '', description: ''}] }];

          tagTodos.forEach(function(tag) {
            var $content = $('<div>');
            $content.append('<h3>' + tag.tag + '</h3>');
            var $todosList = $('<ul>');
            tag.descriptions.forEach(function(description) {
              var $todoListItem = $('<li>');
              $todoListItem.append('<input type="checkbox" id="c' + description.id + '">');
              $todoListItem.append('<label for="c'+ description.id + '">' + description.description +'</label>');
              $todosList.append($todoListItem);
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
            $tagLabel = $('<label for="tag">Tags</label>'),
            $tagInput = $('<input type="text" id="tags" placeholder="Food, Chores, Cooking">'),
            $submitButton = $('<button class="primary-btn">Add Todo</button>');

        $content.append($descriptionLabel, $descriptionInput, $tagLabel, $tagInput, $submitButton);
        $('.tab-content').append($content);


        // form sumbit: add new todo
        $submitButton.on('click', function() {
          // create JSON object for server
          var description = $('#description').val().trim(),
              tags = $('#tags').val().split(', '),
              newTodo = {"description": description, "tags": tags};

          // POST request to server
          console.log(newTodo);
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
          descriptions.push({id: todo.id, description: todo.description});
        }
      });
      // return a final object per tag with corresponding descriptions
      return {tag: tag, descriptions: descriptions};
    });
    return tagDescriptions;
  }; // end organizedByTags

  // trigger click on first tab
  $('.tab-list a:first-child span').trigger('click');
});

$(document).ready(function() {
  "use strict"

  var todoList = [
    {id: 1, description: 'Throw out the trash', tags: ['chores'], complete: false},
    {id: 2, description: 'Finish reading book', tags: ['reading', 'fun'], complete: false},
    {id: 3, description: 'Listen to entire music library', tags: ['music', 'fun'], complete: false}
  ];

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
    console.log(tabNumber);

    switch (tabNumber) {
      case 1:
        var $content = $('<ul>');
        for(var i=todoList.length-1; i>=0; i--) {
          var $todo = $('<li>');
          $todo.append('<input type="checkbox" id="c' + todoList[i].id + '">');
          $todo.append('<label for="c' + todoList[i].id + '">' + todoList[i].description + '</label>');
          $content.append($todo);
        }
        $('.tab-content').html($content);
        $content.before('<label>Latest Todos:</label>');
        break;

      case 2:
        var $content = $('<ul>');
        todoList.forEach(function(todo) {
          var $todo = $('<li>');
          $todo.append('<input type="checkbox" id="c' + todo.id + '">');
          $todo.append('<label for="c' + todo.id + '">' + todo.description + '</label>');
          $content.append($todo);
        });
        $('.tab-content').html($content);
        $content.before('<label>Oldest Todos:</label>');
        break;

      case 3:
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
        break;

      case 4:
        var $content = $('<form>'),
            $descriptionLabel = $('<label for="description">Description</label>'),
            $descriptionInput = $('<input type="text" id="description" placeholder="Cook dinner">'),
            $tagLabel = $('<label for="tag">Tags</label>'),
            $tagInput = $('<input type="text" id="tag" placeholder="Food, Chores, Cooking">'),
            $submitButton = $('<button class="primary-btn">Add Todo</button>');

        $content.append($descriptionLabel, $descriptionInput, $tagLabel, $tagInput, $submitButton);
        $('.tab-content').append($content);
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

  $('.tab-list a:first-child span').trigger('click');
});

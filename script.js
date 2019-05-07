var TodoList = function () {
    var doc = document;
    // todos to show
    var todos = [];
    var showCompleted = false;
    // Checking the localStorage
    var hasLocalStorage = function () {
        if( 'localStorage' in window){
            try {
                localStorage.setItem('test',1) ;
                return localStorage.getItem('test');
            } catch (e){
                return false;
            }
        }
    }

    if (hasLocalStorage()) {
        var lCompleted = localStorage.getItem('showCompleted');
        if (lCompleted && lCompleted !== 'false') {
            showCompleted = true;
        }
    }
    // Create an element "li" with text toDo
    var createLi = function (obj, id) {
        var id = id || 0;
        var li = doc.createElement('li');
        li.id = id;
        li.appendChild(doc.createTextNode(obj.name));
        if (obj.completed) {
            li.classList.add('checked');
            if (!showCompleted) {
                li.classList.add('hidden');
            }
        }

        return li;
    }
    // Reassign the ID to element li when a toDo is added
    var orderList = function (todolist) {
        var list = todolist.getElementsByTagName('li');

        for (var i = 1; list[i]; i++) {
            list[i].id = i - 1;
        }
    }
    // Change complited to no complited

    var toggleComplete = function (id) {
        todos[id].completed = !todos[id].completed;
    }

    // Insert object in the localStorage
    var syncLocalStorage = function () {
        if(!hasLocalStorage()){
            return false;
        }
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // add listener to button and list of toDo
    var initListener = function () {
      
        var doc = document;
        var todolist = doc.querySelector('#todolist');
        var todoInput = doc.querySelector('#todo');
        var showCompleteBtn = doc.querySelector('#showCompleteBtn');
        
        toggleButtonLabel(showCompleteBtn);
        
        showCompleteBtn.addEventListener('click', function (e) {

            toggleViewCompleted();
            toggleButtonLabel(e.target);
            var checkedElements = todolist.getElementsByClassName('checked');

            for (var i = 0; checkedElements[i]; i++) {
                checkedElements[i].classList.toggle('hidden');
            }
        });
        todolist.addEventListener('click', function (e) {
            var ele = e.target;
            if (ele.id != 'addElementLi') {
                
                var offetset = ele.clientWidth - e.offsetX;
                
                if (offetset < 14 && offetset > 8) {
                    ele.parentNode.removeChild(ele);
                    removeTodo(ele.id);
                } else if (e.offsetX < 16 && e.offsetX > 5) {


                    toggleCompleteAndSync(ele.id);
                    ele.classList.toggle('checked');

                    if (!showCompleted) {
                        ele.classList.add('hidden');
                    }
                }
            }
        });

        // Verify if click ENTER and if toDo has at least 3 letters
        todoInput.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 && e.target.value && e.target.value.length >= 3) {
                var todo = e.target.value;
                addTodo(todo);
                e.target.value = '';
                var li = createLi({name: todo, completed: false});

                todolist.insertBefore(li, todolist.firstElementChild.nextElementSibling);
                orderList(todolist);


            }
        });

    }
    // Helper methods
    
    var removeTodo = function (id) {
        todos.splice(id, 1);
        syncLocalStorage();
    }
    var toggleButtonLabel = function (showCompleteBtn) {
        showCompleteBtn.innerHTML = showCompleted ? 'Hide Completed' : 'Show completed';
    }
    var toggleViewCompleted = function () {
        showCompleted = !showCompleted;
        if (hasLocalStorage()) {
            localStorage.setItem('showCompleted', showCompleted);
        }
    }
    var getTodos = function () {

        if (todos.length) {
            return todos;
        }
        if (hasLocalStorage() && localStorage.getItem('todos')) {
            todos = JSON.parse(localStorage.getItem('todos'));
            return todos;
        }

    }
    var toggleCompleteAndSync = function (id) {
        toggleComplete(id);
        syncLocalStorage();
    }
    var addTodo = function (todo) {
        todos.unshift({name: todo, completed: false});
        syncLocalStorage();

    }
    var showTodos = function () {
        var todos = getTodos() || [];
        todos.forEach(function (todo, id) {
            todolist.appendChild(createLi(todo, id));
        });
    }
    return {
        init: initListener,
        showTodos: showTodos,
        removeTodo: removeTodo,
        toggleButtonLabel: toggleButtonLabel,
        toggleViewCompleted: toggleViewCompleted,
        getShowCompleted: toggleComplete,
        orderList: orderList,
        getTodos: getTodos,
        addTodo: addTodo,
        createLi: createLi,
        
       
    }
};

document.addEventListener('DOMContentLoaded', function () {
    var myApp = TodoList();
    myApp.init();
    myApp.showTodos();
});

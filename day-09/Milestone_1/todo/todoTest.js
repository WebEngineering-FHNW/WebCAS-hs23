import {TodoListController, TodoItemsView, TodoTotalView, TodoOpenView, TodoChartView} from "./todo.js";
import { Suite }                                                                       from "../test/test.js";

const todoSuite = Suite("todo");

todoSuite.add("todo-crud", assert => {

    // setup
    const todoContainer = document.createElement("div");
    const numberOfTasks = document.createElement("span");
    numberOfTasks.textContent = '0';
    const openTasks = document.createElement("span");
    openTasks.textContent = '0';
    const chartWrapperElement = document.createElement("div");

    const assertState = ({rows, tasks, open}) => {
        const elementsPerRow = 3;
        assert.is(todoContainer.children.length, rows * elementsPerRow);
        assert.is(numberOfTasks.textContent, tasks);
        assert.is(openTasks.textContent, open);
    };
    const getChartProgress = () =>
        chartWrapperElement
        .querySelector("div")
        .style.getPropertyValue("--chart-divider");

    const todoController = TodoListController();

    TodoItemsView(todoController, todoContainer);  // three views that share the same controller and thus model
    TodoTotalView(todoController, numberOfTasks);
    TodoOpenView (todoController, openTasks);
    TodoChartView(todoController, chartWrapperElement);

    assertState({rows:0, tasks:'0', open:'0'});
    assert.is(getChartProgress(), "0deg");

    todoController.addTodo();

    assertState({rows:1, tasks:'1', open:'1'});
    assert.is(getChartProgress(), "0deg");

    todoController.addTodo();

    assertState({rows:2, tasks:'2', open:'2'});

    const firstCheckbox = todoContainer.querySelectorAll("input[type=checkbox]")[0];
    assert.is(firstCheckbox.checked, false);

    firstCheckbox.click();

    assert.is(firstCheckbox.checked, true);
    assert.is(getChartProgress(), "180deg");

    assertState({
        rows:  2,     // did not change
        tasks: '2',   // did not change
        open:  '1'    // changed
    });

    // add a test for the deletion of a todo-item

    // delete a checked item

    const firstDeleteBtn = todoContainer.querySelectorAll("button.delete")[0];
    firstDeleteBtn.click();

    assertState({
        rows:  1,
        tasks: '1',
        open:  '1'    // remains!
    });

    // delete an unchecked item

    const secondDeleteBtn = todoContainer.querySelectorAll("button.delete")[0];
    secondDeleteBtn.click();

    assertState({rows:  0, tasks: '0', open:  '0' /* changes */ })

});

todoSuite.add("todo-memory-leak", assert => {  // variant with remove-me callback
    const todoController = TodoListController();

    todoController.onTodoAdd(todo => {
       todoController.onTodoRemove( (todo, _, removeMe) => {
           removeMe(); // un- / comment to see the difference
       });
    });

    for (let i=0; i<10000; i++){   // without removeMe:  10000 : 2s, 20000: 8s, 100000: ???s
        const todo = todoController.addTodo();
        todoController.removeTodo(todo);
    }
});

todoSuite.add("todo-memory-leak-2", assert => {  // variant with listener identity
    const todoController = TodoListController();

    todoController.onTodoAdd(todo => {

       const removeListener = todo => {
           // do the normal stuff, e.g. remove view elements
           // then remove yourself
           todoController.removeTodoRemoveListener(removeListener);
       };
       todoController.onTodoRemove( removeListener );
    });

    for (let i=0; i<10000; i++){
        const todo = todoController.addTodo();
        todoController.removeTodo(todo);
    }
});


todoSuite.add("todo-controller", assert => {
    const todoListController = TodoListController();

    const todoControls = [] ;
    todoListController.onTodoAdd( ctrl => todoControls.push(ctrl) );

    const assertNumberOpen = (number, open) => {
        assert.is(todoListController.numberOfTodos(),     number);
        assert.is(todoListController.numberOfopenTasks(), open);
    };

    assertNumberOpen(0, 0);

    todoListController.addTodo();
    assertNumberOpen(1, 1);

    todoListController.addTodo();
    assertNumberOpen(2, 2);

    todoControls[0].setDone(true);
    assertNumberOpen(2, 1);

    todoListController.removeTodo(todoControls[0]); // removing a done todoController
    assertNumberOpen(1, 1);                         // does not reduce the open count

    todoListController.removeTodo(todoControls[1]); // removing an open todoController
    assertNumberOpen(0, 0);                         // reduces the open count

});

todoSuite.run();

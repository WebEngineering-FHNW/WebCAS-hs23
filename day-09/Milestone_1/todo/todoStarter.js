
import {TodoListController,
    TodoOpenView,
    TodoTotalView,
    TodoItemsView,
    TodoChartView,
    chartStyle
} from './todo.js';

const styleElement = document.createElement("STYLE");
styleElement.innerHTML = chartStyle;
document.head.appendChild(styleElement);

const todoController = TodoListController();

// binding of the main view

document.getElementById('plus')   .onclick = _ => todoController.addTodo();
document.getElementById('fortune').onclick = _ => todoController.addFortuneTodo();

// create the sub-views, incl. binding

TodoItemsView(todoController, document.getElementById('todoContainer'));
TodoTotalView(todoController, document.getElementById('numberOfTasks'));
TodoOpenView (todoController, document.getElementById('openTasks'));
TodoChartView(todoController, document.getElementById('chart'));

// init the model

todoController.addTodo();

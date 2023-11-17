import { ObservableList, Observable } from "../observable/observable.js";
import { Attribute }      from "../presentationModel/presentationModel.js";
import { Scheduler }      from "../dataflow/dataflow.js";
import { fortuneService } from "./fortuneService.js";

export { TodoController, TodoItemsView, TodoTotalView, TodoOpenView, TodoChartView, chartStyle}

const TodoController = () => {

    const Todo = () => {                               // facade
        const textObservable = Observable("text");
        const doneObservable = Observable(false);

        return {
            getDone:            doneObservable.getValue,
            setDone:            doneObservable.setValue,
            onDoneChanged:      doneObservable.onChange,
            getText:            textObservable.getValue,
            setText:            textObservable.setValue,
            onTextChanged:      textObservable.onChange,
            onTextValidChanged: textObservable.onChange, // TODO ????
        }
    };

    const todoModel = ObservableList([]); // observable array of Todos, this state is private
    const scheduler = Scheduler();

    const addTodo = () => {
        const newTodo = Todo();
        todoModel.add(newTodo);
        return newTodo;
    };

    const addFortuneTodo = () => {

        const newTodo = Todo();

        todoModel.add(newTodo);
        newTodo.setText('...');

        scheduler.add( ok =>
           fortuneService( text => {
                   newTodo.setText(text);
                   ok();
               }
           )
        );

    };

    return {
        numberOfTodos:      todoModel.count,
        numberOfopenTasks:  () => todoModel.countIf( todo => ! todo.getDone() ),
        addTodo:            addTodo,
        addFortuneTodo:     addFortuneTodo,
        removeTodo:         todoModel.del,
        onTodoAdd:          todoModel.onAdd,
        onTodoRemove:       todoModel.onDel,
        removeTodoRemoveListener: todoModel.removeDeleteListener, // only for the test case, not used below
    }
};


// View-specific parts

const TodoItemsView = (todoController, rootElement) => {

    const render = todo => {

        function createElements() {
            const template = document.createElement('DIV'); // only for parsing
            template.innerHTML = `
                <button class="delete">&times;</button>
                <input type="text" size="42">
                <input type="checkbox">            
            `;
            return template.children;
        }
        const [deleteButton, inputElement, checkboxElement] = createElements();

        checkboxElement.onclick = _ => todo.setDone(checkboxElement.checked);
        deleteButton.onclick    = _ => todoController.removeTodo(todo);

        todoController.onTodoRemove( (removedTodo, _, removeMe) => {
            if (removedTodo !== todo) return;
            rootElement.removeChild(inputElement);
            rootElement.removeChild(deleteButton);
            rootElement.removeChild(checkboxElement);
            removeMe();
        } );

        inputElement.oninput = _ => todo.setText(inputElement.value);

        todo.onTextChanged(() => inputElement.value = todo.getText());

        todo.onTextValidChanged(
            valid => valid
              ? inputElement.classList.remove("invalid") // TODO set custom validity
              : inputElement.classList.add("invalid")
        );

        rootElement.appendChild(deleteButton);
        rootElement.appendChild(inputElement);
        rootElement.appendChild(checkboxElement);
    };

    // binding

    todoController.onTodoAdd(render);

    // we do not expose anything as the view is totally passive.
};

const TodoTotalView = (todoController, numberOfTasksElement) => {

    const render = () =>
        numberOfTasksElement.textContent = String(todoController.numberOfTodos());

    // binding

    todoController.onTodoAdd(render);
    todoController.onTodoRemove(render);
};

const TodoOpenView = (todoController, numberOfOpenTasksElement) => {

    const render = () =>
        numberOfOpenTasksElement.textContent = String(todoController.numberOfopenTasks());

    // binding

    todoController.onTodoAdd(todo => {
        render();
        todo.onDoneChanged(render); // TODO should use the controller only
    });
    todoController.onTodoRemove(render);
};

const chartId = "Todo_chart_id4711";
const TodoChartView = (todoController, chartWrapperElement) => {

    const chartElement = document.createElement("DIV");
    chartElement.setAttribute("id",chartId);
    chartElement.style.setProperty("--chart-divider","0deg");
    chartWrapperElement.appendChild(chartElement);

    const render = () =>{
        const s = 360 - 360 * todoController.numberOfopenTasks() / todoController.numberOfTodos();
        chartElement.style.setProperty("--chart-divider", s + "deg");
    };

    // binding

    todoController.onTodoAdd(todo => {
        render();
        todo.onDoneChanged(render); // TODO should use the controller only
    });
    todoController.onTodoRemove(render);
};

const chartStyle = `#${chartId} {
            width: 20%;
            aspect-ratio: 1 / 1;
            background-color: black;
            border-radius: 50%;
            background-image: conic-gradient(
                               green  0deg,
                               green  var(--chart-divider),
                               red var(--chart-divider),
                               red 360deg);
            transform: scaleY(0.7);
            box-shadow: 0 .2em 0 .2em rebeccapurple;
        }`;

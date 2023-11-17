import { ObservableList, Observable } from "../observable/observable.js";
import { Attribute }      from "../presentationModel/presentationModel.js";
import { Scheduler }      from "../dataflow/dataflow.js";
import { fortuneService } from "./fortuneService.js";

export { TodoListController, TodoItemsView, TodoTotalView, TodoOpenView, TodoChartView, chartStyle}

const TodoListController = () => {

    const TodoModel = () => {
        const textObservable         = Observable("...");
        const textValidObservable    = Observable(false);
        const textEditableObservable = Observable(true);
        const doneObservable         = Observable(false);
        return {
            textObservable,
            doneObservable,
            textValidObservable,
            textEditableObservable
        }
    };

    const TodoController = () => {
        const { textObservable, doneObservable, textValidObservable,
              textEditableObservable } = TodoModel();

        textObservable.onChange( newText =>
            textValidObservable.setValue(newText.length >= 4)
        );
        doneObservable.onChange( newDone =>
            textEditableObservable.setValue(!newDone));

        const setText = newText =>
            textObservable.setValue(newText.toUpperCase());

        return {
            getDone:            doneObservable.getValue,
            setDone:            doneObservable.setValue,
            onDoneChanged:      doneObservable.onChange,
            getText:            textObservable.getValue,
            setText:            setText,
            onTextChanged:      textObservable.onChange,
            getTextValid:       textValidObservable.getValue,
            // setTextValid:       textValidObservable.setValue,
            onTextValidChanged: textValidObservable.onChange,
            onTextEditableChanged: textEditableObservable.onChange
        }
    };

    const todoModel = ObservableList([]); // observable array of Todos, this state is private
    const scheduler = Scheduler();

    const addTodo = () => {
        const newTodo = TodoController();
        todoModel.add(newTodo);
        return newTodo;
    };

    const addFortuneTodo = () => {

        const newTodo = TodoController();

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

const TodoItemsView = (todoListController, rootElement) => {

    const render = todoController => {

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

        checkboxElement.onclick = _ => todoController.setDone(checkboxElement.checked);
        deleteButton.onclick    = _ => todoListController.removeTodo(todoController);

        todoListController.onTodoRemove( (removedTodoController, _, removeMe) => {
            if (removedTodoController !== todoController) return;
            rootElement.removeChild(inputElement);
            rootElement.removeChild(deleteButton);
            rootElement.removeChild(checkboxElement);
            removeMe();
        } );

        inputElement.oninput = _ => todoController.setText(inputElement.value);

        todoController.onTextChanged(() => inputElement.value = todoController.getText());

        todoController.onTextValidChanged(
            valid => valid
              ? inputElement.setCustomValidity("") // I know this is crazy....
              : inputElement.setCustomValidity("must have more than 3 characters")
        );
        todoController.onTextEditableChanged(
            editable => editable
            ? inputElement.removeAttribute("disabled")
            : inputElement.setAttribute("disabled", "ON")
        );

        rootElement.appendChild(deleteButton);
        rootElement.appendChild(inputElement);
        rootElement.appendChild(checkboxElement);
    };

    // binding

    todoListController.onTodoAdd(render);

    // we do not expose anything as the view is totally passive.
};

const TodoTotalView = (todoController, numberOfTasksElement) => {

    const render = () =>
        numberOfTasksElement.textContent = String(todoController.numberOfTodos());

    // binding

    todoController.onTodoAdd(render);
    todoController.onTodoRemove(render);
};

const TodoOpenView = (todoListController, numberOfOpenTasksElement) => {

    const render = () =>
        numberOfOpenTasksElement.textContent = String(todoListController.numberOfopenTasks());

    // binding

    todoListController.onTodoAdd(todoController => {
        render();
        todoController.onDoneChanged(render);
    });
    todoListController.onTodoRemove(render);
};

const chartId = "Todo_chart_id4711";
const TodoChartView = (todoListController, chartWrapperElement) => {

    const chartElement = document.createElement("DIV");
    chartElement.setAttribute("id",chartId);
    chartElement.style.setProperty("--chart-divider","0deg");
    chartWrapperElement.appendChild(chartElement);

    const render = () =>{
        const s = 360 - 360 * todoListController.numberOfopenTasks() / todoListController.numberOfTodos();
        chartElement.style.setProperty("--chart-divider", s + "deg");
    };

    // binding

    todoListController.onTodoAdd(todoController => {
        render();
        todoController.onDoneChanged(render);
    });
    todoListController.onTodoRemove(render);
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

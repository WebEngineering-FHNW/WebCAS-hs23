import {EDITABLE, LABEL, VALID, VALUE} from "../presentationModel/presentationModel.js";

export { listItemProjector, formProjector, pageCss }

// should be unique for this projector
const classNameMasterGrid    = 'subgrid-master-grid';
const classNameMasterRow     = 'subgrid-master-row';
const classNameDetail        = 'subgrid-detail';

// this might move to a general place
const bindTextInput = (textAttr, inputElement) => {
    inputElement.oninput = _ => textAttr.setConvertedValue(inputElement.value);

    textAttr.getObs(VALUE).onChange(text => inputElement.value = text);

    textAttr.getObs(VALID, true).onChange(
        valid => valid
          ? inputElement.classList.remove("invalid")
          : inputElement.classList.add("invalid")
    );

    textAttr.getObs(EDITABLE, true).onChange(
        isEditable => isEditable
        ? inputElement.removeAttribute("readonly")
        : inputElement.setAttribute("readonly", true));

    textAttr.getObs(LABEL, '').onChange(label => inputElement.setAttribute("title", label));
};

// this might also move to a general place
const textInputProjector = textAttr => {

    const inputElement = document.createElement("INPUT");
    inputElement.type = "text";

    bindTextInput(textAttr, inputElement);

    return inputElement;
};

const listItemProjector = (masterController, selectionController, rootElement, model, attributeNames) => {

    rootElement.classList.add(classNameMasterGrid);
    rootElement.style.setProperty("--attribute-count",attributeNames.length );

    const rowElement = document.createElement("DIV");
    rowElement.classList.add(classNameMasterRow);

    const deleteButton      = document.createElement("Button");
    deleteButton.setAttribute("class","delete");
    deleteButton.innerHTML  = "&times;";
    deleteButton.onclick    = _ => masterController.removeModel(model);

    const inputElements = [];

    attributeNames.forEach( attributeName => {
        const inputElement = textInputProjector(model[attributeName]);
        inputElement.onfocus = _ => selectionController.setSelectedModel(model);
        inputElements.push(inputElement);
    });

    selectionController.onModelSelected(
        selected => selected === model
          ? rowElement.classList.add("selected")
          : rowElement.classList.remove("selected")
    );

    masterController.onModelRemove( (removedModel, removeMe) => {
        if (removedModel !== model) return;
        rootElement.removeChild(rowElement);
        selectionController.clearSelection();
        removeMe();
    } );

    rowElement.appendChild(deleteButton);
    inputElements.forEach( inputElement => rowElement.appendChild(inputElement));
    rootElement.appendChild(rowElement);
    selectionController.setSelectedModel(model);
};

const formProjector = (detailController, rootElement, model, attributeNames) => {

    const divElement = document.createElement("DIV");
    divElement.innerHTML = `
    <FORM>
        <DIV class="${classNameDetail}">
        </DIV>
    </FORM>`;
    const detailFormElement = divElement.querySelector("." + classNameDetail);

    attributeNames.forEach(attributeName => {
        const labelElement = document.createElement("LABEL"); // add view for attribute of this name
        labelElement.setAttribute("for", attributeName);
        const inputElement = document.createElement("INPUT");
        inputElement.setAttribute("TYPE", "text");
        inputElement.setAttribute("SIZE", "20");        // make this observable?
        inputElement.setAttribute("ID", attributeName); // make this unique in case of multiple forms
        detailFormElement.appendChild(labelElement);
        detailFormElement.appendChild(inputElement);

        bindTextInput(model[attributeName], inputElement);
        model[attributeName].getObs(LABEL, '').onChange(label => labelElement.textContent = label);
    });

    if (rootElement.firstChild) {
        rootElement.firstChild.replaceWith(divElement);
    } else {
        rootElement.appendChild(divElement);
    }
};


const pageCss = `
    .${classNameMasterGrid} {
        display:        grid;
        grid-column-gap: 0.5em;
        grid-template-columns: 1.7em repeat(var(--attribute-count, 1), minmax(min(4em, 100%), 1fr));
        margin-bottom:  0.5em ;
        overflow:       hidden;
    }
    
    .${classNameMasterRow} {
        display: grid; 
        grid-column: 1 / -1; 
        grid-template-columns: subgrid; 
    }
        
    .${classNameDetail} {
        display:        grid;
        grid-column-gap: 0.5em;
        grid-template-columns: 1fr 3fr;
        margin-bottom:  0.5em ;
    }
`;

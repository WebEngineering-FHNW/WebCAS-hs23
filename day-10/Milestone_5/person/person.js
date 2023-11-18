import { Attribute, LABEL, EDITABLE }                                 from "../presentationModel/presentationModel.js";
import { listItemProjector, formProjector, pageCss }        from "./instantUpdateProjector.js";
// import { listItemProjector, formProjector, pageCss }        from "./tableProjector.js";

export { MasterView, DetailView, Person, NoPerson, ALL_ATTRIBUTE_NAMES }

// page-style change, only executed once
const style = document.createElement("STYLE");
style.innerHTML = pageCss;
document.head.appendChild(style);

const ALL_ATTRIBUTE_NAMES = ['firstname', 'lastname', 'birthdate'];

const Person = () => {                               // facade
    const firstnameAttr = Attribute("Monika");
    firstnameAttr.getObs(LABEL).setValue("First Name");

    const lastnameAttr  = Attribute("Mustermann");
    lastnameAttr.getObs(LABEL).setValue("Last Name");

    const birthAttr  = Attribute("1968-04-19");
    birthAttr.getObs(LABEL).setValue("Birthdate");

    // 1) commented out since we do not use this at the moment
    // 2) un-comment in case you need some converters or validators
    lastnameAttr.setConverter( input => input.toUpperCase() );
    lastnameAttr.setValidator( input => input.length >= 3   );

    return {
        firstname:          firstnameAttr,
        lastname:           lastnameAttr,
        birthdate:          birthAttr
    }
};

// View-specific parts

const MasterView = (listController, selectionController, rootElement) => {

    const render = person =>
        listItemProjector(listController, selectionController, rootElement, person, ALL_ATTRIBUTE_NAMES);

    // binding
    listController.onModelAdd(render);
};

const NoPerson = (() => { // one time creation, singleton
    const johnDoe = Person();
    ALL_ATTRIBUTE_NAMES.forEach(propertyName => {
        johnDoe[propertyName].setConvertedValue("");
        johnDoe[propertyName].getObs(EDITABLE).setValue(false);
    });
    return johnDoe;
})();

const DetailView = (selectionController, rootElement) => {

    const render = person =>
        formProjector(selectionController, rootElement, person, ALL_ATTRIBUTE_NAMES);

    selectionController.onModelSelected(render);
};

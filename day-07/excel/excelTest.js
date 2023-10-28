// requires ../util/test.js
// requires excel.js

test("excel", assert => {

    const tbody = document.createElement("TBODY");
    tbody.setAttribute("ID","dataContainer");
    const body = document.getElementsByTagName("BODY")[0];
    body.appendChild(tbody);

    startExcel();
    refresh();
    assert.is(n(C3), 6);

    body.removeChild(tbody);

});

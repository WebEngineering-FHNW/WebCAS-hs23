// Todo:

// create a proper Player construction with
// state:
//   fallbackIndex = 0 // place to fall back on oopsie
//   progressIndex = 0 // place having been proceeding to
// and functions:
//   proceed(stride) // proceed so many places
//   fallback()      // "oopsie": go back to last start (fallback position)
//   turn()          // cash in your win, update fallback position for next turn
//

// todo: Player constructor

const Player = name => {
    let fallbackIndex = 0;
    let progressIndex = 0;
    return {
        getFallbackIndex : () => fallbackIndex,
        getProgressIndex : () => progressIndex,
        proceed          : stride => progressIndex = progressIndex + stride,
        turn             : () => fallbackIndex = progressIndex,
        fallback         : () => progressIndex = fallbackIndex,
    };
};


function start() {
    const fields = document.getElementById('fields');

    for (let i = 0; i < 100; i++) {
        const field = document.createElement("DIV");
        field.setAttribute("ID", "FIELD-"+i);
        field.textContent = " ";
        fields.appendChild(field);
    }
    display();
}

function dice() {
    const stride = Math.round(1 + Math.random() * 5);
    document.getElementById('dice').textContent = ""+ stride;
    if (stride === 3) {
        player.fallback();
    } else {
        player.proceed(stride);
    }
    display();
}

function turn() {
    player.turn();
    display();
}

function display() {
    for (let i = 0; i < 100; i++) {
        const field = document.getElementById("FIELD-"+i);
        field.setAttribute("CLASS", "field");
    }
    const fallbackfield = document.getElementById("FIELD-"+ player.getFallbackIndex());
    fallbackfield.setAttribute("CLASS", "field fallback");
    const progressfield = document.getElementById("FIELD-"+ player.getProgressIndex());
    progressfield.setAttribute("CLASS", "field progress");
}

player = Player("One");

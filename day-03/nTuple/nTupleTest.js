// requires lambda.js

let tupleOk = [];

// tuple
const [Person, fn, ln, ag] = Tuple(3);
const person = Person("Dierk")("König")(53);
tupleOk.push(person(fn) === "Dierk");
tupleOk.push(person(ln) === "König");
tupleOk.push(person(ag) === 53);

// composed Tuple

const [Team, lead, deputy] = Tuple(2);
const team = Team (person) (Person("Roger")("Federer")(35));
tupleOk.push(team(lead)(fn)   === "Dierk");
tupleOk.push(team(deputy)(ln) === "Federer");


const [Cash, CreditCard, Invoice, PayPal] = Choice(4);
const cash = Cash ();
const card = CreditCard ("0000-1111-2222-3333");
const invo = Invoice    ({name:"Roger", number:"4711"});
const pal  = PayPal     (person);  // the payload can be a partially applied function, e.g. Tuple ctor
const doPay = payingMethod =>
    payingMethod
        ( _       => "paid cash")
        ( number  => "credit card "+number)
        ( account => account.name + " " + account.number )
        ( person  => "pal: " + person(fn) );

tupleOk.push(doPay(cash) === "paid cash");
tupleOk.push(doPay(card) === "credit card 0000-1111-2222-3333");
tupleOk.push(doPay(invo) === "Roger 4711");
tupleOk.push(doPay(pal ) === "pal: Dierk");

// test result report
if ( tupleOk.every(elem => elem) ) {
    document.writeln("All " + tupleOk.length + " tests tupleOk.");
} else {
    document.writeln("Not all tests tupleOk! Details:");
    for (let i = 0; i < tupleOk.length; i++) {
        if(tupleOk[i]) {
            document.writeln("Test "+ i +" tupleOk");
        } else {
            document.writeln("Test "+ i +" failed");
        }
    }
}

// ======================
// CONFIGURAZIONE TURNI
// ======================

const turni = {

    Mattina: {
        inizio: "07:00",
        fine: "13:00",
        colore: "mattina"
    },

    Pomeriggio: {
        inizio: "13:00",
        fine: "19:00",
        colore: "pomeriggio"
    },

    Sera: {
        inizio: "19:00",
        fine: "00:00",
        colore: "sera"
    },

    Notte: {
        inizio: "00:00",
        fine: "07:00",
        colore: "notte"
    },

    Riposo: {
        inizio: "",
        fine: "",
        colore: "riposo"
    },

    Ferie: {
        inizio: "",
        fine: "",
        colore: "ferie"
    },

    Permesso: {
        inizio: "",
        fine: "",
        colore: "permesso"
    }
};

// ======================
// STORAGE
// ======================

let eventi =
JSON.parse(
    localStorage.getItem("turniAlessioGiada")
) || [];

// ======================
// ELEMENTI DOM
// ======================

const dataInput =
document.getElementById("data");

const personaInput =
document.getElementById("persona");

const turnoInput =
document.getElementById("turno");

const oraInizioInput =
document.getElementById("oraInizio");

const oraFineInput =
document.getElementById("oraFine");

const titoloInput =
document.getElementById("titolo");

const listaEventi =
document.getElementById("listaEventi");

const statistiche =
document.getElementById("stats");

// ======================
// TURNI AUTOMATICI
// ======================

turnoInput.addEventListener("change", () => {

    const turno =
    turni[turnoInput.value];

    if(!turno)
        return;

    oraInizioInput.value =
    turno.inizio;

    oraFineInput.value =
    turno.fine;
});

// ======================
// SALVATAGGIO
// ======================

function salvaEventi(){

    localStorage.setItem(
        "turniAlessioGiada",
        JSON.stringify(eventi)
    );

}

// ======================
// AGGIUNTA EVENTO
// ======================

function aggiungiEvento(){

    if(!dataInput.value){

        alert(
            "Seleziona una data."
        );

        return;
    }

    const nuovoEvento = {

        id:
        Date.now(),

        data:
        dataInput.value,

        persona:
        personaInput.value,

        turno:
        turnoInput.value,

        oraInizio:
        oraInizioInput.value,

        oraFine:
        oraFineInput.value,

        titolo:
        titoloInput.value.trim()

    };

    eventi.push(
        nuovoEvento
    );

    salvaEventi();

    pulisciForm();

    render();
}

// ======================
// PULIZIA FORM
// ======================

function pulisciForm(){

    titoloInput.value = "";

}

// ======================
// ELIMINA EVENTO
// ======================

function eliminaEvento(id){

    if(
        !confirm(
            "Eliminare questo evento?"
        )
    ){
        return;
    }

    eventi =
    eventi.filter(
        e => e.id !== id
    );

    salvaEventi();

    render();
}

// ======================
// CALCOLO ORE
// ======================

function calcolaOreEvento(evento){

    if(
        !evento.oraInizio ||
        !evento.oraFine
    ){
        return 0;
    }

    let [h1,m1] =
    evento.oraInizio
    .split(":")
    .map(Number);

    let [h2,m2] =
    evento.oraFine
    .split(":")
    .map(Number);

    let start =
    h1 * 60 + m1;

    let end =
    h2 * 60 + m2;

    if(end < start){

        end += 1440;

    }

    return (
        (end - start) / 60
    );
}

// ======================
// STATISTICHE
// ======================

function aggiornaStatistiche(){

    let oreAlessio = 0;
    let oreGiada = 0;

    eventi.forEach(evento => {

        const ore =
        calcolaOreEvento(
            evento
        );

        if(
            evento.persona ===
            "Alessio"
        ){

            oreAlessio += ore;

        }

        if(
            evento.persona ===
            "Giada"
        ){

            oreGiada += ore;

        }

    });

    statistiche.innerHTML = `

    <div class="stats-grid">

        <div class="stat-box stat-alessio">

            <div>
                Alessio
            </div>

            <div class="stat-numero">
                ${oreAlessio.toFixed(1)}
            </div>

            <div>
                ore
            </div>

        </div>

        <div class="stat-box stat-giada">

            <div>
                Giada
            </div>

            <div class="stat-numero">
                ${oreGiada.toFixed(1)}
            </div>

            <div>
                ore
            </div>

        </div>

    </div>

    `;
}

// ======================
// RENDER EVENTI
// ======================

function render(){

    listaEventi.innerHTML =
    "";

    eventi.sort(
        (a,b) =>
        a.data.localeCompare(
            b.data
        )
    );

    if(eventi.length === 0){

        listaEventi.innerHTML =

        `
        <div class="empty">
            Nessun evento inserito
        </div>
        `;

        aggiornaStatistiche();

        return;
    }

    eventi.forEach(evento => {

        const classeTurno =
        evento.turno
        .toLowerCase();

        const classePersona =
        evento.persona ===
        "Alessio"
        ?
        "alessio"
        :
        "giada";

        const div =
        document.createElement(
            "div"
        );

        div.className =
        `card ${classePersona}`;

        div.innerHTML =

        `
        <div class="
            evento
            ${classeTurno}
        ">

            <span
                class="rimuovi"
                onclick="
                eliminaEvento(
                ${evento.id}
                )">
                ❌
            </span>

            <div class="persona">
                ${evento.persona}
            </div>

            <div class="data">
                📅 ${evento.data}
            </div>

            <div>
                👮 ${evento.turno}
            </div>

            <div class="orario">
                ⏰
                ${evento.oraInizio}
                -
                ${evento.oraFine}
            </div>

            <div class="titolo">
                📌 ${evento.titolo}
            </div>

        </div>
        `;

        listaEventi.appendChild(
            div
        );

    });

    aggiornaStatistiche();
}

// ======================
// SERVICE WORKER
// ======================

if(
    "serviceWorker"
    in navigator
){

    window.addEventListener(
        "load",
        () => {

            navigator
            .serviceWorker
            .register(
                "service-worker.js"
            );

        }
    );

}

// ======================
// AVVIO
// ======================

render();

// ======================
// BOTTONE AGGIUNGI
// ======================

window.aggiungiEvento =
aggiungiEvento;

window.eliminaEvento =
eliminaEvento;

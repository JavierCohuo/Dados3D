const rollButton = document.getElementById('rollButton');
const addDiceButton = document.getElementById('addDiceButton');
const changeColorButton = document.getElementById('changeColorButton');
const eliminarDadoButton = document.getElementById('eliminarDadoButton');
const dadoContainer = document.querySelector('.dadoContainer');
const previousRollsTable = document.getElementById('previousRolls').getElementsByTagName('tbody')[0];

let dados = [];
let tiradas = {}; // Objeto para almacenar las tiradas
let myChart; // Variable para almacenar la instancia de Chart.js

rollButton.addEventListener('click', () => {
    rollAllDice();
});

addDiceButton.addEventListener('click', () => {
    if (dados.length < 5) {
        addDice();
    }
});

changeColorButton.addEventListener('click', () => {
    dados.forEach(changeDiceColor);
});


// Configurar y renderizar la gráfica una vez al cargar la página
const ctx = document.getElementById('myChart').getContext('2d');

// Inicializar la gráfica con datos vacíos
myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: []
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function rollDice(dadoIndex, tirada) {
    const dado = dados[dadoIndex - 1];
    const cube = dado.querySelector('.cubo3D');
    const faces = dado.querySelectorAll('.cubo3D .cara');
    
    // Detenemos la animación
    cube.style.animation = 'none';

    // Generamos un número aleatorio del 1 al 6
    const randomNumber = Math.floor(Math.random() * 6) + 1;

    // Registramos el resultado en la tirada correspondiente
    if (!tiradas[tirada]) {
        tiradas[tirada] = [];
    }
    tiradas[tirada].push({ dado: dadoIndex, number: randomNumber });

    // Mostramos el resultado en una de las caras del cubo
    faces.forEach(face => face.textContent = randomNumber);
}

function rollAllDice() {
    const tirada = Object.keys(tiradas).length + 1; // Número de la nueva tirada

    dados.forEach((dado, index) => rollDice(index + 1, tirada));
    updatePreviousRollsTable();
    updateFrequencyTable();
}

function addDice() {
    const newDado = document.createElement('div');
    newDado.classList.add('dado', 'espacio3D');

    const newCubo = document.createElement('div');
    newCubo.classList.add('cubo3D');

    for (let i = 1; i <= 6; i++) {
        const newSide = document.createElement('aside');
        newSide.classList.add('cara', `cara${i}`);
        newSide.textContent = i;
        newCubo.appendChild(newSide);
    }

    const newBase = document.createElement('div');
    newBase.classList.add('base');

    newDado.appendChild(newCubo);
    newDado.appendChild(newBase);
    dadoContainer.appendChild(newDado);

    dados.push(newDado);
}

function updatePreviousRollsTable() {
    previousRollsTable.innerHTML = '';

    Object.keys(tiradas).forEach(tirada => {
        const row = previousRollsTable.insertRow();
        row.insertCell().textContent = `Tirada ${tirada}`;
        dados.forEach((dado, index) => {
            const result = tiradas[tirada].find(roll => roll.dado === index + 1);
            row.insertCell().textContent = result ? result.number : '-';
        });
    });
}

function changeDiceColor(dado) {
    const cube = dado.querySelector('.cubo3D');
    const faces = dado.querySelectorAll('.cubo3D .cara');

    faces.forEach(face => {
        const randomColor = getRandomColor();
        face.style.backgroundColor = randomColor;
    });
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function updateFrequencyTable() {
    const numDices = dados.length;
    const data = {
        labels: [],
        datasets: []
    };

    // Iterar sobre cada dado
    for (let i = 0; i < numDices; i++) {
        const frequency = new Array(6).fill(0); // Inicializar la frecuencia para cada dado
        const tableRows = document.querySelectorAll(`#previousRolls tbody tr td:nth-child(${i + 2})`); // Seleccionar la columna correspondiente al dado

        // Contar la frecuencia de cada resultado para el dado actual
        tableRows.forEach(cell => {
            const result = parseInt(cell.textContent);
            if (!isNaN(result)) {
                frequency[result - 1]++;
            }
        });

        // Agregar los datos del dado al conjunto de datos de la gráfica
        data.datasets.push({
            label: `Dado ${i + 1}`,
            data: frequency,
            backgroundColor: getRandomColor(),
            borderColor: getRandomColor(),
            borderWidth: 1
        });
    }

    // Crear una etiqueta para cada resultado posible en la gráfica
    for (let j = 1; j <= 6; j++) {
        data.labels.push(j.toString());
    }

    // Actualizar los datos de la gráfica
    myChart.data = data;
    myChart.update();
}


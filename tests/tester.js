const Habitacion = require('../habitacion');
const Climatizador = require('../climatizador');
const Termostato = require('../termostato');
const Programador = require('../programador');
const dormitorio = new Habitacion();
dormitorio.temperatura = 22;
const climatizador = new Climatizador(dormitorio);
const termostato = new Termostato(dormitorio);
const config = [
	{ hora: "07:00",
	  temperatura: 22
	},
];
const programador = new Programador(config);
termostato.on('muchofrio', () => climatizador.calentar());
termostato.on('muchocalor', () => climatizador.enfriar());
termostato.on('tic', (temp) => console.log(`${temp.toFixed(1)}ºC`));
termostato.indicarTemperaturaIdeal(20);
programador.on('ideal' , (temp) => termostato.indicarTemperaturaIdeal(temp));
termostato.encender();


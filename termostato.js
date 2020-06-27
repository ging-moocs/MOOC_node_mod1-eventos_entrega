
const EventEmitter = require('events');


// Diferencia de temperatura permitida entre la temperatura real y la ideal.
const MARGEN_ERROR = 0.3;


// Clase Termostato.
// Mira la temperatura de una habitacion y avisa si hace demasiado calor o frio.
// Tambien informa sobre la temperatura actual de la habitacion.
// Metodos:
//    indicarTemperaturaIdeal
//    encender
//    apagar
// Eventos:
//    tic
//    muchocalor
//    muchofrio
class Termostato  extends EventEmitter {

	constructor(habitacion) {
		super();

		this.habitacion = habitacion;
	
		// Temperatura ideal programada:
		this.temperaturaIdeal = 16;

		// para cancelar el temporizador setInterval:
		this.intervalId = null;
	}

	indicarTemperaturaIdeal(temperaturaIdeal) {
		this.temperaturaIdeal = temperaturaIdeal;
	}

	encender() {
		console.log('Encendiendo el termostato.');
		clearInterval(this.intervalId);
		this.intervalId = setInterval(() => {
			this.emit('tic', this.habitacion.temperatura);

			if (this.habitacion.temperatura > this.temperaturaIdeal+MARGEN_ERROR) {
				this.emit('muchocalor');
			} else if (this.habitacion.temperatura < this.temperaturaIdeal-MARGEN_ERROR) {
				this.emit('muchofrio');
			}
		}, 500);
	}

	apagar() {
		console.log('Apagando el termostato.');
		clearInterval(this.intervalId);
	}
}

exports = module.exports = Termostato;



// Clase habitacion.
// Su temperatura cambia aleatoriamente. (Simula el invierno o el verano)
class Habitacion {
	
	constructor() {

		// Temperatura actual de la habitacion:
		this.temperatura = 20.0;

		// Cada 10 segundos sube o baja aleatoriamente la temperatura 
		// hasta +/- un grado:
		setInterval(() => {
			this.temperatura += Math.random() * 2 - 1,
			console.log(`Cambio aleatorio a ${this.temperatura.toFixed(1)}ºC`);
		}, 10000);
	}
}

exports = module.exports = Habitacion;


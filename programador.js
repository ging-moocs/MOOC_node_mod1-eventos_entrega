
const EventEmitter = require('./events');

const later = require('later');

class Programador extends EventEmitter {
	
	constructor(config) {
		super();

 		later.date.localTime();

		config.forEach(({hora, temperatura}) => {

			console.log(`Programador: ${hora} configurar ${temperatura}ºC.`);

			const sched = later.parse.text(`at ${hora}`);

			console.log(later.schedule(sched).next(5));

			later.setInterval(
				() => {
					console.log(`Programador: Ajustando temperatura ideal a ${temperatura}`);
				    this.emit('ideal', temperatura);
                },
				sched);
		});
	}
}

exports = module.exports = Programador;

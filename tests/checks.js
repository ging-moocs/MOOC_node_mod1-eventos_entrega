/**
 * Corrector para la práctica de cmd
 */

// IMPORTS
const path = require('path');
const Utils = require('./utils');
const child_process = require("child_process");
const spawn = require("child_process").spawn;
const fs = require("fs");
const path_assignment = path.resolve(path.join(__dirname, "../"));

// CRITICAL ERRORS
let error_critical = null;
let error_critical_prog = null;
let error_critical_ev = null;

// CONSTANTS
const JS_RUNNER = 'main.js';
const JS_PROGRAMMER = 'programador.js';
const JS_PROGRAMMER_CLASS = 'Programador';

const JS_EVENTS = 'events.js';
const JS_EVENTS_CLASS = 'EventEmitter';
const JS_EVENTS_CLASS_ON = 'on';
const JS_EVENTS_CLASS_EMIT = 'emit';

const T_WAIT = 2; // Time between commands
const T_TEST = 2 * 60; // Time between tests (seconds)

// HELPERS
const timeout = ms => new Promise(res => setTimeout(res, ms));
// to.js

const to = (promise) => {
    return promise
        .then(data => {
            return [null, data];
        })
        .catch(err => [err]);
};

const checkFileExistsOrError = async (path, err) => {
    const fileexists = await Utils.checkFileExists(path);
    if (!fileexists) {
        return err;
    }
    fileexists.should.be.equal(true);
}

//TESTS
describe("Node eventos", function () {

    this.timeout(T_TEST * 1000);

    it(`1(Precheck): Comprobando que existe el directorio de la entrega...`, async function () {
        const expected = path_assignment;
        this.score = 0;
        this.msg_ok = `Encontrado el directorio de la entrega '${expected}'`;
        this.msg_err = `No se encuentra el directorio '${expected}'`;
        
        const err = await checkFileExistsOrError(expected, this.msg_err, error_critical);
        if (err) {
            error_critical = err;
        }
    });

    it(`2(Precheck): Comprobando que existe '${'package.json'}'...`, async function () {
        const expected = 'package.json';
        this.score = 0;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = `Encontrado '${expected}'`;
            this.msg_err = `No se encuentra '${expected}'`;
            const err = await checkFileExistsOrError(expected, this.msg_err, error_critical);
            if (err) {
                error_critical = err;
                should.not.exist(error_critical);
            }
        }
    });

    it(`3(Precheck): Comprobando que el fichero '${'package.json'}' tiene una sintaxis válida...`, async function () {
        const expected = 'package.json';
        this.score = 0;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = `El fichero '${expected}' tiene el formato adecuado`;
            this.msg_err = `No se ha podido leer '${expected}'`;
            const output = fs.readFileSync(expected, { encoding: 'utf8' });

            const is_json = Utils.isJSON(output);
            if (!is_json) {
                this.msg_err = `El fichero '${expected}' NO tiene el formato adecuado`;
                error_critical = this.msg_err;
                should.not.exist(error_critical);
            }
            is_json.should.be.equal(true);
        }
    });

    it(`4: Comprobando que '${JS_PROGRAMMER}' existe...`, async function () {
        const expected = JS_PROGRAMMER;
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = `Encontrado '${expected}'`;
            this.msg_err = `No se encuentra '${expected}'`;
            const err = await checkFileExistsOrError(expected, this.msg_err);
            if (err) {
                error_critical_prog = err;
                should.not.exist(error_critical_prog);
            }
        }
    });

    it(`5: Comprobando que '${JS_PROGRAMMER}' contiene código Javascript válido...`, async function () {
        const expected = JS_PROGRAMMER;
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            if (error_critical_prog) {
                this.msg_err = error_critical_prog;
                should.not.exist(error_critical_prog);
            } else {
                this.msg_ok = `El fichero '${expected}' tiene la sintaxis correcta`;
                [error, output] = await to(new Promise((resolve, reject) => {
                    child_process.exec(` node --check ${expected}`, {cwd: path_assignment}, (err, stdout) => {
                        err ? reject(err) : resolve(stdout)
                    })
                    
                }));
                if (error) {
                    this.msg_err = `Error al parsear el fichero '${expected}'`;
                    error_critical_prog = this.msg_err;
                    should.not.exist(error_critical_prog);
                }
                should.not.exist(error);
            }
        }
    });

    it(`6: Comprobando que el fichero '${JS_PROGRAMMER}' exporta la clase '${JS_PROGRAMMER_CLASS}'......`, async function () {
        const expected = JS_PROGRAMMER_CLASS;
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            let output = "";
            if (error_critical_prog) {
                this.msg_err = error_critical_prog;
                should.not.exist(error_critical_prog);
            } else {
                this.msg_ok = `Export class '${expected}' encontrada en el fichero '${JS_PROGRAMMER}'`;
                try {
                    // output = require.resolve(path.join(path_assignment, JS_PROGRAMMER)).toString();
                    output = fs.readFileSync(JS_PROGRAMMER, { encoding: 'utf8' });
                } catch (error) {
                    this.msg_err = `Export class '${expected}' NO encontrada en el fichero '${JS_PROGRAMMER}'`;
                    error.should.not.exist();
                }
                this.msg_err = `Export class '${expected}' NO encontrada en el fichero '${JS_PROGRAMMER}'`;
                Utils.search(expected, output).should.be.equal(true);
                Utils.search("exports", output).should.be.equal(true);
            }
        }
    });

    it(`7: Comprobando que el fichero '${JS_EVENTS}' existe...`, async function () {
            const expected = JS_EVENTS;
            this.score = 1;
            if (error_critical) {
                this.msg_err = error_critical;
                should.not.exist(error_critical);
            } else {
                this.msg_ok = `Encontrado el fichero '${expected}'`;
                this.msg_err = `No se encuentra '${expected}'`;
                const err = await checkFileExistsOrError(path.join(path_assignment, expected),this.msg_err,error_critical);
                if (err) {
                    error_critical_ev = err;
                    should.not.exist(error_critical_ev);
                }
            }
        }
    );

    it(`8: Comprobando que el fichero '${JS_EVENTS}' contiene código Javascript válido...`, async function () {
        const expected = JS_EVENTS;
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            if (error_critical_ev) {
                this.msg_err = error_critical_ev;
                should.not.exist(error_critical_ev);
            } else {
                this.msg_ok = `El fichero '${expected}' tiene el formato adecuado`;
                [error, output] = await to(new Promise((resolve, reject) => {
                    child_process.exec(` node --check ${expected}`, {cwd: path_assignment}, (err, stdout) => 
                        err ? reject(err) : resolve(stdout))
                }));
                if (error) {
                    this.msg_err = `Error al parsear '${expected}'`;
                    error_critical = this.msg_err;
                    should.not.exist(error_critical);
                }
                should.not.exist(error);
            }
        }
    });

    it(`9: Comprobando que el fichero '${JS_EVENTS}' exporta la clase '${JS_EVENTS_CLASS}'......`, async function () {
        const expected = JS_EVENTS_CLASS;
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            if (error_critical_ev) {
                this.msg_err = error_critical_ev;
                should.not.exist(error_critical_ev);
            } else {
                let output = "";
                this.msg_ok = `Export class '${expected}' encontrada en el fichero '${JS_EVENTS}'`;
                try {
                    output = require(path.join(path_assignment, JS_EVENTS)).toString();
                } catch (error) {
                    this.msg_err = `Export class '${expected}' NO encontrada en el fichero '${JS_EVENTS}'`;
                    should.not.exist(error);
                }
                this.msg_err = `Export class '${expected}' NO encontrada en el fichero '${JS_EVENTS}'`;
                Utils.search(expected, output).should.be.equal(true);
            }
        }
    });

    it(`10: Comprobando que la clase '${JS_EVENTS_CLASS}' implementa el método '${JS_EVENTS_CLASS_ON}'...`, async function () {
        const expected = JS_EVENTS_CLASS_ON;
        this.score = 0.5;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            if (error_critical_ev) {
                this.msg_err = error_critical_ev;
                should.not.exist(error_critical_ev);
            } else {
                let output = "";
                this.msg_ok = `El método '${expected}' se ha encontrado en la clase '${JS_EVENTS_CLASS}'`;
                try {
                    output = require(path.join(path_assignment, JS_EVENTS)).toString();
                } catch (error) {
                    this.msg_err = `El método '${expected}' NO se ha encontrado en la clase '${JS_EVENTS_CLASS}'`;
                    should.not.exist(error);
                }
                this.msg_err = `El método '${expected}' NO se ha encontrado en la clase '${JS_EVENTS_CLASS}'`;
                Utils.search(expected, output).should.be.equal(true);
            }
        }
    });

    it(`11: Comprobando que el método '${JS_EVENTS_CLASS_ON}' acepta los parámetros correcots...`, async function () {
        const expected = JS_EVENTS_CLASS_ON;
        this.score = 0.5;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            if (error_critical_ev) {
                this.msg_err = error_critical_ev;
                should.not.exist(error_critical_ev);
            } else {
                this.msg_ok = `El método '${expected}' acepta los parámetros correctos`;
                try {
                    const myclass = new(require(path.join(path_assignment, JS_EVENTS)));
                    myclass.on("ideal", () => {});
                } catch (error) {
                    this.msg_err = `El método '${expected}' no acepta los parámetros ["ideal", ()=>{}]`;
                    should.not.exist(error);
                }
                should.not.exist(error);
            }
        }
    });

    it(`12: Comprobando que la clase '${JS_EVENTS_CLASS}' implementa el método '${JS_EVENTS_CLASS_EMIT}'...`, async function () {
        const expected = JS_EVENTS_CLASS_EMIT;
        this.score = 0.5;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            if (error_critical_ev) {
                this.msg_err = error_critical_ev;
                should.not.exist(error_critical_ev);
            } else {
                let output = "";
                this.msg_ok = `El método  '${expected}' está en la clase '${JS_EVENTS_CLASS}'`;
                try {
                    output = require(path.join(path_assignment, JS_EVENTS)).toString();
                } catch (error) {
                    this.msg_err = `El método  '${expected}' NO se ha encontrado en la clase '${JS_EVENTS_CLASS}'`;
                    should.not.exist(error);
                }
                this.msg_err = `El método '${expected}' NO se ha encontrado en la clase '${JS_EVENTS_CLASS}'`;
                Utils.search(expected, output).should.be.equal(true);
            }
        }
    });

    it(`14: Comprobando que el método '${JS_EVENTS_CLASS_EMIT}' acepta los parámetros adecuados...`, async function () {
        const expected = JS_EVENTS_CLASS_EMIT;
        this.score = 0.5;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            if (error_critical_ev) {
                this.msg_err = error_critical_ev;
                should.not.exist(error_critical_ev);
            } else {
                this.msg_ok = `El método '${expected}' acepta los parámetros adecuados'`;
                try {
                    const myclass = new(require(path.join(path_assignment, JS_EVENTS)));
                    myclass.on("ideal", () => {});
                    myclass.emit("ideal", 20.0);
                } catch (error) {
                    this.msg_err = `El método '${expected}' NO acepta los parámetros ["ideal", 20.0]`;
                    should.not.exist(error);
                }
                should.not.exist(error);
            }
        }
    });

    it(`15: Comprobando que el programa funciona con el nuevo '${JS_PROGRAMMER}' y '${JS_EVENTS}'. Ejecutando '${JS_RUNNER}'...`, async function () {
        const expected = "Enfriando";
        this.score = 2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            if (error_critical_ev) {
                this.msg_err = error_critical_ev;
                should.not.exist(error_critical_ev);
            } else {
                let output = "";
                let error = "";
                const client = spawn("node", ["./tester.js"], {cwd: path.join(path_assignment, "tests")});
                client.on('error', function (data) {
                    error += data
                });
                client.stdin.on('data', function (data) {
                    output += data
                });
                client.stdout.on('data', function (data) {
                    output += data
                });
                client.stderr.on('data', function (data) {
                    error += data
                });
                await timeout(T_WAIT * 1000);
                if (client) {
                    client.kill();
                }

                this.msg_ok = `El programa funciona correctamente`;
                this.msg_err = `El programa NO funciona correctamente`;
                error.should.be.equal("");
                Utils.search(expected, output).should.be.equal(true);
            }
        }
    });
});
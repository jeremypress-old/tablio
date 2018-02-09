const LIFX = require('./API/LIFX.js');
console.log('Starting Tablio');
const tablioLight = new LIFX('Bright Light');
tablioLight.init().then(() => {
    console.log('ready')
    tablioLight.off()
});

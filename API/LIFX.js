// Toggle light on/off
// Turn brightness up/down via a given value
// Change color by standard
const { LIFX_API_KEY } = require('./secrets.js');
const fetch = require('node-fetch');

class LIFX {
    constructor(label) {
        this.lightName = label;
    }

    init() {
        return this.getCurrentState(this.lightName).then((state) => {
            this.power = state.power === 'on';
            this.color = state.color;
            this.brightness = state.brightness;
            this.id = state.id;
            console.log(this.id)
        });
    }

    getCurrentState(label) {
        const url = 'https://api.lifx.com/v1/lights/all';
        return fetch(url, {method: 'GET', headers: {'Authorization': `Bearer ${LIFX_API_KEY}`}})
	       .then(res => res.json())
           .then((response) => {
               const targetLight = response.find((entry) => {
                   return entry.label === label;
               });
               return {
                   power: targetLight.power,
                   color: targetLight.color,
                   brightness: targetLight.brightness,
                   id: targetLight.id
               }
           })
    }

    on() {
        const url = `https://api.lifx.com/v1/lights/${this.id}/state/delta`;
        const body = {power: 'on', duration: 2};
        console.log(JSON.stringify(body))
        fetch(url, { method: 'POST', body: JSON.stringify(body), headers: {'Authorization': `Bearer ${LIFX_API_KEY}`, 'Content-Type': 'application/json'}})
    	   .then(res => res.json())
    	   .then(json => {
               this.power = true;
        });
    }

    off() {
        const url = `https://api.lifx.com/v1/lights/${this.id}/state/delta`;
        const body = {power: 'off', duration: 2};
        console.log(JSON.stringify(body))
        fetch(url, { method: 'POST', body: JSON.stringify(body), headers: {'Authorization': `Bearer ${LIFX_API_KEY}`, 'Content-Type': 'application/json'}})
    	   .then(res => res.json())
    	   .then(json => {
               this.power = false;
        });
    }

    toggle() {
        if (this.power) {
            this.off()
        } else {
            this.on();
        }
    }

    setBrightness(value) {
        const url = `https://api.lifx.com/v1/lights/${this.id}/state/delta`;
        const body = {brightness: value, duration: 2};
        fetch(url, { method: 'POST', body: JSON.stringify(body), headers: {'Authorization': `Bearer ${LIFX_API_KEY}`, 'Content-Type': 'application/json'}})
    	   .then(res => res.json())
    	   .then(json => {
               this.brightness = value;
        });
    }

    setColor(value) {
        const url = `https://api.lifx.com/v1/lights/${this.id}/state/delta`;
        const body = {hue: value, duration: 2};
        fetch(url, { method: 'POST', body: JSON.stringify(body), headers: {'Authorization': `Bearer ${LIFX_API_KEY}`, 'Content-Type': 'application/json'}})
    	   .then(res => res.json())
    	   .then(json => {
               this.color.hue = value;
        });
    }

}

module.exports = LIFX;

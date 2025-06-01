/*jshint esversion: 6 */

const dgram = require("dgram");
const server = dgram.createSocket("udp4");
const EventEmitter = require("events");
const regexInput = require("./helpers/regex");
const helper = require("./helpers/helper");

class HLDS_Log extends EventEmitter {
  constructor(port, raw = false, cvarEmitWaitTime = 10000) {
    super();
    this.raw = raw;
    this.port = port;
    this.cvarEmitWaitTime = cvarEmitWaitTime;
    this.cvarList = [];
  }

  start() {
    this.onError();
    this.messageParser();
    this.listenSocket();
    this.bindPort(this.port);

    this.once("_cvar", (info) => {
      setTimeout(() => {
        this.emit('cvarsDone', { cvars: this.cvarList });
      }, this.cvarEmitWaitTime);
    });

    this.on("_cvar", (info) => {
      this.setCvars(info.cvarName, info.cvarValue);
    });
  }

  onError() {
    server.on("error", (err) => {
      this.emit('error', err);
      server.close();
    });
  }

  messageParser() {
    server.on("message", (msg, info) => {
      const message = msg.toString("ascii").replace(/[\n\t\r]/g, "");
      this.emit("hlds_connect", info);

      if (this.raw) this.emit('raw', msg.toString("ascii"));
      this.regexSearch(message.split(" "), message);
    });
  }

  listenSocket() {
    server.on("listening", () => {
      const address = server.address();
      console.log(`server listening ${address.address}:${address.port}`);
    });
  }

  regexSearch(array, line) {
    try {
      regexInput.forEach((parameter) => {
        if (array.includes(parameter)) {
          const cleanParam = parameter.replace(/\0.*$/g, "");
          const type = helper[cleanParam](line);
          if (type) this.emit(type.event, type);
        }
      });
    } catch (error) {
      console.error('Error spotted: ' + error);
      this.emit('error', error);
    }
  }

  setCvars(cvarName, cvarValue) {
    return this.cvarList.push([cvarName, cvarValue]);
  }

  bindPort(port) {
    server.bind(port);
  }
}

module.exports = HLDS_Log;
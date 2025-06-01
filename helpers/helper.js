




  // log L 01/06/2025 - 18:47:11: "monster_shocktrooper<monster><NoAuthID><x-race_shock>" has been killed by "DeteCT0R<1><STEAM_0:0:57831462><player>"
const killAction = (line) => {
  let items = line.match(
    /log L (\d{2})\/(\d{2})\/(\d{4}) - ([\d]{1,2}):([\d]{2}):([\d]{2}): "([^<]*)<([^>]*)><([^>]*)><([^>]*)>" killed "([^<]*)<([^>]*)><([^>]*)><([^>]*)>" with "([^"]*)"/i
  );

  if (items != null) {
    return KillWith(items);
  }

  items = line.match(
    /log L (\d{2})\/(\d{2})\/(\d{4}) - ([\d]{1,2}):([\d]{2}):([\d]{2}): "([^<]*)<([^>]*)><([^>]*)><([^>]*)>" has been killed by "([^<]*)<([^>]*)><([^>]*)><([^>]*)>"/i
  );

  if (items != null) {
    return KillBy(items);
  }  
};

const KillBy = (items) => {
  return {
    event: "kill",
    killer: {
      name: items[11],
      id: items[12],
      steamid: items[13],
      side: items[14]
    },
    victim: {
      name: items[7],
      id: items[8],
      steamid: items[9],
      side: items[10],
      weapon: items[15]
    },
    time: {
      ss: items[6],
      mm: items[5],
      hh: items[4]
    },
    date: {
      dd: items[2],
      mm: items[1],
      yy: items[3]
    }
  };
};

const KillWith = (items) => {
  return {
    event: "kill",
    killer: {
      name: items[11],
      id: items[12],
      steamid: items[13],
      side: items[14]
    },
    victim: {
      name: items[7],
      id: items[8],
      steamid: items[9],
      side: items[10],
      weapon: items[15]
    },
    time: {
      ss: items[6],
      mm: items[5],
      hh: items[4]
    },
    date: {
      dd: items[2],
      mm: items[1],
      yy: items[3]
    }
  };
};

const say = (line) => {
  const items = line.match(
    /log L ([0-9]{2})\/([0-9]{2})\/([0-9]{4}) - ([01]?\d|2[0-3]):([0-5]\d):([0-5]\d): "(.+)<(\d+)><(.+)><([A-Z]+)>" say "(.+)"/i
  );

  if (!items) return null;

  return {
    event: "say",
    player: {
      name: items[7],
      id: items[8],
      steamid: items[9],
      side: items[10],
      message: items[11]
    },
    time: {
      ss: items[6],
      mm: items[5],
      hh: items[4]
    },
    date: {
      dd: items[2],
      mm: items[1],
      yy: items[3]
    }
  };
};


const disconnected = (line) => {
  const items = line.match(
    /log L ([0-9]{2})\/([0-9]{2})\/([0-9]{4}) - ([01]?\d|2[0-3]):([0-5]\d):([0-5]\d): "(.+)<(.*)><(.*)><(.*)>" disconnected/i
  );

  if (!items) return null;

  return {
    event: "leave",
    player: {
      name: items[7],
      id: items[8],
      steamid: items[9],
      side: items[10]
    },
    time: {
      ss: items[6],
      mm: items[5],
      hh: items[4]
    },
    date: {
      dd: items[2],
      mm: items[1],
      yy: items[3]
    }
  };
};

const enter = (line) => {
  const items = line.match(
    /log L ([0-9]{2})\/([0-9]{2})\/([0-9]{4}) - ([01]?\d|2[0-3]):([0-5]\d):([0-5]\d): "(.+)<(\d+)><(.+)><(.+)>" entered the game/i
  );

  if (!items) return null;

  return {
    event: "enter",
    player: {
      name: items[7],
      id: items[8],
      steamid: items[9]
    },
    time: {
      ss: items[6],
      mm: items[5],
      hh: items[4]
    },
    date: {
      dd: items[2],
      mm: items[1],
      yy: items[3]
    }
  };
};

const map_end = (line) => {
  const items = line.match(
    /log L ([0-9]{2})\/([0-9]{2})\/([0-9]{4}) - ([01]?\d|2[0-3]):([0-5]\d):([0-5]\d): Team "([A-Z]+)" scored "(.+)" with "(.+)" players/i
  );

  if (!items) return null;

  return {
    event: "end_score",
    team: items[7],
    score: items[8],
    playersNumber: items[9],
    time: {
      ss: items[6],
      mm: items[5],
      hh: items[4]
    },
    date: {
      dd: items[2],
      mm: items[1],
      yy: items[3]
    }
  };
};

const triggerChoose = (line) => {
  let items = line.match(
    /log L ([0-9]{2})\/([0-9]{2})\/([0-9]{4}) - ([01]?\d|2[0-3]):([0-5]\d):([0-5]\d): Team "([A-Z]+)" triggered "(.+)" \(CT "(.+)"\) \(T "(.+)"\)/i
  );
  if (items != null) {
    return roundEnd(items);
  }

  items = line.match(
    /log L ([0-9]{2})\/([0-9]{2})\/([0-9]{4}) - ([01]?\d|2[0-3]):([0-5]\d):([0-5]\d): "(.+)<(\d+)><(.+)><(.+)>" triggered "(.+)"/i
  );
  if (items != null) {
    return playerAction(items);
  }

  items = line.match(
    /log L ([0-9]{2})\/([0-9]{2})\/([0-9]{4}) - ([01]?\d|2[0-3]):([0-5]\d):([0-5]\d): World triggered "(.+)"/i
  );
  if (items != null) {
    return serverAction(items);
  }
};

const roundEnd = (items) => {
  return {
    event: "round_end",
    team: items[7],
    eventName: items[8],
    score: {
      CT: items[9],
      TT: items[10]
    },
    time: {
      ss: items[6],
      mm: items[5],
      hh: items[4]
    },
    date: {
      dd: items[2],
      mm: items[1],
      yy: items[3]
    }
  };
};

const playerAction = (items) => {
  return {
    event: "player_action",
    player: {
      name: items[7],
      id: items[8],
      steamid: items[9],
      side: items[10],
      eventName: items[11]
    },
    time: {
      ss: items[6],
      mm: items[5],
      hh: items[4]
    },
    date: {
      dd: items[2],
      mm: items[1],
      yy: items[3]
    }
  };
};

const serverAction = (items) => {
  return {
    event: "server_action",
    eventName: items[7],
    time: {
      ss: items[6],
      mm: items[5],
      hh: items[4]
    },
    date: {
      dd: items[2],
      mm: items[1],
      yy: items[3]
    }
  };
};

const connect = (line) => {
  const items = line.match(
    /log L ([0-9]{2})\/([0-9]{2})\/([0-9]{4}) - ([01]?\d|2[0-3]):([0-5]\d):([0-5]\d): "(.+)<(\d+)><(.+)><>" connected, address "(.+)"/i
  );

  if (!items) return null;

  return {
    event: "connect",
    player: {
      name: items[7],
      id: items[8],
      steamid: items[9],
      address: items[10]
    },
    time: {
      ss: items[6],
      mm: items[5],
      hh: items[4]
    },
    date: {
      dd: items[2],
      mm: items[1],
      yy: items[3]
    }
  };
};

const mapChoose = (line) => {
  let items = line.match(
    /log L ([0-9]{2})\/([0-9]{2})\/([0-9]{4}) - ([01]?\d|2[0-3]):([0-5]\d):([0-5]\d): Loading map "(.+)"/i
  );

  if (items != null) {
    return mapChange(items);
  }

  items = line.match(
    /log L ([0-9]{2})\/([0-9]{2})\/([0-9]{4}) - ([01]?\d|2[0-3]):([0-5]\d):([0-5]\d): Started map "(.+)" \(CRC "(.+)"\)/i
  );

  if (items != null) {
    return mapStarted(items);
  }
};

const mapChange = (items) => {
  return {
    event: "map_change",
    mapName: items[7],
    time: {
      ss: items[6],
      mm: items[5],
      hh: items[4]
    },
    date: {
      dd: items[2],
      mm: items[1],
      yy: items[3]
    }
  };
};

const mapStarted = (items) => {
  return {
    event: "map_start",
    mapName: items[7],
    CRC: items[8],
    time: {
      ss: items[6],
      mm: items[5],
      hh: items[4]
    },
    date: {
      dd: items[2],
      mm: items[1],
      yy: items[3]
    }
  };
};

const suicide = (line) => {
  const items = line.match(
    /log L ([0-9]{2})\/([0-9]{2})\/([0-9]{4}) - ([01]?\d|2[0-3]):([0-5]\d):([0-5]\d): "(.+)<(\d+)><(.+)><(.+)>" committed suicide with "(.+)"/i
  );

  if (!items) return null;

  return {
    event: "suicide",
    triggerType: items[11],
    player: {
      name: items[7],
      id: items[8],
      steamid: items[9],
      team: items[10],
    },
    time: {
      ss: items[6],
      mm: items[5],
      hh: items[4]
    },
    date: {
      dd: items[2],
      mm: items[1],
      yy: items[3]
    }
  };
};

const shutdown = (line) => {
  const items = line.match(
    /log L ([0-9]{2})\/([0-9]{2})\/([0-9]{4}) - ([01]?\d|2[0-3]):([0-5]\d):([0-5]\d): Server shutdown/
  );

  if (!items) return null;

  return {
    event: "shutdown",
    time: {
      ss: items[6],
      mm: items[5],
      hh: items[4]
    },
    date: {
      dd: items[2],
      mm: items[1],
      yy: items[3]
    }
  };
};

const _closed = (line) => {
  const items = line.match(
    /log L ([0-9]{2})\/([0-9]{2})\/([0-9]{4}) - ([01]?\d|2[0-3]):([0-5]\d):([0-5]\d): Log file closed/
  );

  if (!items) return null;

  return {
    event: "log_off",
    time: {
      ss: items[6],
      mm: items[5],
      hh: items[4]
    },
    date: {
      dd: items[2],
      mm: items[1],
      yy: items[3]
    }
  };
};

const kick = (line) => {
  const items = line.match(
    /log L ([0-9]{2})\/([0-9]{2})\/([0-9]{4}) - ([01]?\d|2[0-3]):([0-5]\d):([0-5]\d): Kick: "(.+)<(\d+)><(.+)><>" was kicked by "(.+)"/i
  );

  if (!items) return null;

  return {
    event: "kick",
    kickInvoker: items[10],
    player: {
      name: items[7],
      id: items[8],
      steamid: items[9],
    },
    time: {
      ss: items[6],
      mm: items[5],
      hh: items[4]
    },
    date: {
      dd: items[2],
      mm: items[1],
      yy: items[3]
    }
  };
};

module.exports = {
  killed: killAction,
  say,
  disconnected,
  entered: enter,
  scored: map_end,
  triggered: triggerChoose,
  "connected,": connect,
  map: mapChoose,
  suicide,
  shutdown,
  closed: _closed,
  kicked: kick,
};
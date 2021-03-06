// -------------------------------------------------------------------------- //
// Example: basic.js
// For more cec-events: http://www.cec-o-matic.com/
// -------------------------------------------------------------------------- //
require('console-stamp')(console, { pattern: 'dd/mm/yyyy HH:MM:ss.l' });
var nodecec = require( 'node-cec' );

var NodeCec = nodecec.NodeCec;
var CEC     = nodecec.CEC;

var cec = new NodeCec( 'node-cec-monitor' );
var POWER_ON = false;

// -------------------------------------------------------------------------- //
//- KILL CEC-CLIENT PROCESS ON EXIT

process.on( 'SIGINT', function() {
  if ( cec != null ) {
    cec.stop();
  }
  process.exit();
});


// -------------------------------------------------------------------------- //
//- CEC EVENT HANDLING

cec.once( 'ready', function(client) {
  console.log( ' -- READY -- ' );
  client.sendCommand( 0xf0, CEC.Opcode.GIVE_DEVICE_POWER_STATUS );
});

cec.on( 'REPORT_POWER_STATUS', function (packet, status) {
  var keys = Object.keys( CEC.PowerStatus );

  for (var i = keys.length - 1; i >= 0; i--) {
    if (CEC.PowerStatus[keys[i]] == status) {
      console.log('POWER_STATUS:', keys[i]);
      if(keys[i] === 'ON') POWER_ON=true;
      if(keys[i] === 'STANDBY') POWER_ON=false;
      break;
    }
  }

});

cec.on( 'ROUTING_CHANGE', function(packet, fromSource, toSource) {
  console.log( 'Routing changed from ' + fromSource + ' to ' + toSource + '.');
});

cec.on( 'ACTIVE_SOURCE', function(packet, source ){
  console.log( 'Active source changed ' + source + '.' );
  if(source == "20480" && POWER_ON) {
    console.log("forcing audio back");
  //  cec.send("tx 45:70:11:00");      
    cec.send("tx 4f:82:51:00");      
  }
});


// -------------------------------------------------------------------------- //
//- START CEC CLIENT

// -m  = start in monitor-mode
// -d8 = set log level to 8 (=TRAFFIC) (-d 8)
// -br = logical address set to `recording device`
cec.start( 'cec-client', '-m', '-d', '8', '-b', 'r' );

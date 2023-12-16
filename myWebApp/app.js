var createError = require('http-errors');
var path = require('path');
const express = require("express");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var path = require('path')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const chalk = require("chalk");
const { Server } = require("socket.io");
const exsession = require("express-session");
const sharedsession = require("express-socket.io-session");
const mime = require('mime');
const { MessageSecurityMode, SecurityPolicy, AttributeIds, OPCUAClient, TimestampsToReturn } = require("node-opcua");
const hostname = require("os").hostname().toLowerCase();
const endpointUrl = "opc.tcp://localhost:4840/";
const nodeIdToMonitor = "ns=1;s=Temperature";
const node1IdToMonitor = "ns=4;s=Robot1/Position";

var app = express();
const server = http.createServer(app);
const io = new Server(server);
//************************************************************ */
//Declare Variables
/**
 * Get port from environment and store in Express.
*/
let client, session, subscription;
let login_successful = false;

var port = 3700;
app.set('port', port);
var nodesToWrite = [{
    nodeId: "ns=4;s=Robot1/Temperature",
    attributeId: AttributeIds.Value,
    indexRange: null,
    value: {
        value: {
            dataType: "Double",
            value: "0"
                }
        }
    },
    {
        nodeId: "ns=4;s=Robot1/Position",
        attributeId: AttributeIds.Value,
        indexRange: null,
        value: {
            value: {
                dataType: "Double",
                value: "11"
            }
        }
    },
    {
        nodeId: "ns=4;s=Robot1/Position",
        attributeId: AttributeIds.Value,
        indexRange: null,
        value: {
            value: {
                dataType: "Double",
                value: "22"
            }
        }
    },
    {
        nodeId: "ns=4;s=Robot1/Position",
        attributeId: AttributeIds.Value,
        indexRange: null,
        value: {
            value: {
                dataType: "Double",
                value: "33"
            }
        }
    },
    {
        nodeId: "ns=4;s=Robot1/Position",
        attributeId: AttributeIds.Value,
        indexRange: null,
        value: {
            value: {
                dataType: "Double",
                value: "44"
            }
        }
    },
    {
        nodeId: "ns=4;s=Robot1/Position",
        attributeId: AttributeIds.Value,
        indexRange: null,
        value: {
            value: {
                dataType: "Double",
                value: "55"
            }
        }
    }];
const nodeRobot1 = [
  "ns=4;s=Robot1/ToolNumber", 
  "ns=4;s=Robot1/JogSpeed",
  "ns=4;s=Robot1/Coordinate",
  "ns=4;s=Robot1/ServoStt",
  "ns=4;s=Robot1/SystemStt",
  "ns=4;s=Robot1/LockRBC",
  "ns=4;s=Robot1/Mode",
  "ns=4;s=Robot1/SecLevel",
  "ns=4;s=Robot1/theta1",
  "ns=4;s=Robot1/theta2",
  "ns=4;s=Robot1/theta3",
  "ns=4;s=Robot1/theta4",
  "ns=4;s=Robot1/XYZ1",
  "ns=4;s=Robot1/XYZ2",
  "ns=4;s=Robot1/XYZ3",
  "ns=4;s=Robot1/XYZ4",
  "ns=4;s=Robot1/XYZ5",
  "ns=4;s=Robot1/XYZ6",
  ]
  const nodeRobot2 = [
      "ns=4;s=Robot2/ToolNumber",
      "ns=4;s=Robot2/JogSpeed",
      "ns=4;s=Robot2/Coordinate",
      "ns=4;s=Robot2/ServoStt",
      "ns=4;s=Robot2/SystemStt",
      "ns=4;s=Robot2/LockRBC",
      "ns=4;s=Robot2/Mode",
      "ns=4;s=Robot2/SecLevel",
      "ns=4;s=Robot2/theta1",
      "ns=4;s=Robot2/theta2",
      "ns=4;s=Robot2/theta3",
      "ns=4;s=Robot2/theta4",
      "ns=4;s=Robot2/XYZ1",
      "ns=4;s=Robot2/XYZ2",
      "ns=4;s=Robot2/XYZ3",
      "ns=4;s=Robot2/XYZ4",
      "ns=4;s=Robot2/XYZ5",
      "ns=4;s=Robot2/XYZ6",
  ]  
//************************************************************ */
async function createOPCUAClient(io, data, socket) {
  client = OPCUAClient.create({
      endpointMustExist: false,
      securityMode: MessageSecurityMode.NONE,
      securityPolicy: SecurityPolicy.None,
      serverCertificate: null,
  });
  client.on("backoff", (retry, delay) => {
    console.log("Retrying to connect to ", endpointUrl, " attempt ", retry);
  });
      console.log(" connecting to ", chalk.cyan(endpointUrl));
        try {
            // await client.connect(endpointUrl);
            // console.log("Connected to OPC UA server.");
            // const userIdentity = {
            //     userName: data.username,
            //     password: data.password
            // };
            // session = await client.createSession(userIdentity);
            // Save the user's session ID in the Socket.IO session
            //socket.request.session.opcSessionId = session.sessionId.toString();
            socket.emit("login-response", { success: true });
            login_successful = true;
        }
        catch (err) {
            console.error("Failed to connect to OPC UA server:", err);
            socket.emit("login-response", { success: false, message: "Failed to authenticate user." });
            login_successful = false;
        }    
      console.log(" session created".yellow);

//   subscription = await session.createSubscription2({
//     requestedPublishingInterval: 250,
//     requestedMaxKeepAliveCount: 50,
//     requestedLifetimeCount: 6000,
//     maxNotificationsPerPublish: 1000,
//     publishingEnabled: true,
//     priority: 10,
//   });

//   subscription
//     .on("keepalive", function () {
//       console.log("keepalive");
//     })
//     .on("terminated", function () {
//       console.log(" TERMINATED ------------------------------>");
//     });

//   const itemToMonitor = {
//     nodeId: nodeIdToMonitor,
//     attributeId: AttributeIds.Value,
//   };
//   const item1ToMonitor = {
//     nodeId: node1IdToMonitor,
//     attributeId: AttributeIds.Value,
// };
// /* ------------------------------------- */
// const itemRobot1ToMonitor = [
// {
//     nodeId: nodeRobot1[0],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[1],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[2],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[3],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[4],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[5],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[6],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[7],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[8],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[9],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[10],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[11],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[12],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[13],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[14],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[15],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[16],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[17],
//     attributeId: AttributeIds.Value,
// },
// ];
// const itemRobot2ToMonitor = [
// {
//     nodeId: nodeRobot2[0],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[1],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[2],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[3],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[4],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[5],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[6],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[7],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[8],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[9],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[10],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[11],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[12],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[13],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[14],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[15],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[16],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[17],
//     attributeId: AttributeIds.Value,
// },
// ];
// /* ------------------------------------- */
// const parameters = {
//   samplingInterval: 100,
//   discardOldest: true,
//   queueSize: 100,
// };
// const monitoredItem = await subscription.monitor(
//   itemToMonitor,
//   parameters,
//   TimestampsToReturn.Both
// );
// const monitoredItem1 = await subscription.monitor(
//   item1ToMonitor,
//   parameters,
//   TimestampsToReturn.Both
// );
// const monitoredItemRobot1 = [
//   await subscription.monitor(
//       itemRobot1ToMonitor[0],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[1],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[2],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[3],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[4],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[5],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[6],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[7],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[8],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[9],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[10],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[11],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[12],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[13],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[14],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[15],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[16],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[17],
//       parameters,
//       TimestampsToReturn.Both
//   ),
// ];
// const monitoredItemRobot2 = [
//   await subscription.monitor(
//       itemRobot2ToMonitor[0],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[1],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[2],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[3],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[4],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[5],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[6],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[7],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[8],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[9],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[10],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[11],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[12],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[13],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[14],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[15],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[16],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[17],
//       parameters,
//       TimestampsToReturn.Both
//   ),
// ];

// monitoredItem.on("changed", (dataValue) => {
//   console.log(dataValue.value.toString());
//   //console.log(dataValue.attributeid.toString());
// io.sockets.emit("temp", {
//   value: dataValue.value.value,
//   timestamp: dataValue.serverTimestamp,
//   nodeId: nodeIdToMonitor,
//   browseName: "Temperature",
// });
// });
// monitoredItem1.on("changed", (dataValue) => {
//   console.log("Position: " + dataValue.value.toString());
//   io.sockets.emit("pos", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Position",
//   });
// });
// monitoredItemRobot1[0].on("changed", (dataValue) => {
//   console.log("Robot1/ToolNumber: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/ToolNumber", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/ToolNumber",
//   });
// });
// monitoredItemRobot1[1].on("changed", (dataValue) => {
//   console.log("Robot1/JogSpeed: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/JogSpeed", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/JogSpeed",
//   });
// });
// monitoredItemRobot1[2].on("changed", (dataValue) => {
//   console.log("Robot1/Coordinate: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/Coordinate", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/Coordinate",
//   });
// });
// monitoredItemRobot1[3].on("changed", (dataValue) => {
//   console.log("Robot1/ServoStt: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/ServoStt", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/ServoStt",
//   });
// });
// monitoredItemRobot1[4].on("changed", (dataValue) => {
//   console.log("Robot1/SystemStt: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/SystemStt", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/SystemStt",
//   });
// });
// monitoredItemRobot1[5].on("changed", (dataValue) => {
//   console.log("Robot1/LockRBC: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/LockRBC", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/LockRBC",
//   });
// });
// monitoredItemRobot1[6].on("changed", (dataValue) => {
//   console.log("Robot1/Mode: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/Mode", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/Mode",
//   });
// });
// monitoredItemRobot1[7].on("changed", (dataValue) => {
//   console.log("Robot1/SecLevel: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/SecLevel", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/SecLevel",
//   });
// });
// monitoredItemRobot1[8].on("changed", (dataValue) => {
//   console.log("Robot1/theta1: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/theta1", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/theta1",
//   });
// });
// monitoredItemRobot1[9].on("changed", (dataValue) => {
//   console.log("Robot1/theta2: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/theta2", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/theta2",
//   });
// });
// monitoredItemRobot1[10].on("changed", (dataValue) => {
//   console.log("Robot1/theta3: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/theta3", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/theta3",
//   });
// });
// monitoredItemRobot1[11].on("changed", (dataValue) => {
//   console.log("Robot1/theta4: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/theta4", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/theta4",
//   });
// });
// monitoredItemRobot1[12].on("changed", (dataValue) => {
//   console.log("Robot1/XYZ1: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/XYZ1", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/XYZ1",
//   });
// });
// monitoredItemRobot1[13].on("changed", (dataValue) => {
//   console.log("Robot1/XYZ2: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/XYZ2", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/XYZ2",
//   });
// });
// monitoredItemRobot1[14].on("changed", (dataValue) => {
//   console.log("Robot1/XYZ3: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/XYZ3", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/XYZ3",
//   });
// });
// monitoredItemRobot1[15].on("changed", (dataValue) => {
//   console.log("Robot1/XYZ4: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/XYZ4", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/XYZ4",
//   });
// });
// monitoredItemRobot1[16].on("changed", (dataValue) => {
//   console.log("Robot1/XYZ5: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/XYZ5", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/XYZ5",
//   });
// });
// monitoredItemRobot1[17].on("changed", (dataValue) => {
//   console.log("Robot1/XYZ6: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/XYZ6", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/XYZ6",
//   });
// });
// //-----------------------------
// monitoredItemRobot2[0].on("changed", (dataValue) => {
//   console.log("Robot2/ToolNumber: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/ToolNumber", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/ToolNumber",
//   });
// });
// monitoredItemRobot2[1].on("changed", (dataValue) => {
//   console.log("Robot2/JogSpeed: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/JogSpeed", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/JogSpeed",
//   });
// });
// monitoredItemRobot2[2].on("changed", (dataValue) => {
//   console.log("Robot2/Coordinate: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/Coordinate", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/Coordinate",
//   });
// });
// monitoredItemRobot2[3].on("changed", (dataValue) => {
//   console.log("Robot2/ServoStt: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/ServoStt", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/ServoStt",
//   });
// });
// monitoredItemRobot2[4].on("changed", (dataValue) => {
//   console.log("Robot2/SystemStt: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/SystemStt", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/SystemStt",
//   });
// });
// monitoredItemRobot2[5].on("changed", (dataValue) => {
//   console.log("Robot2/LockRBC: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/LockRBC", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/LockRBC",
//   });
// });
// monitoredItemRobot2[6].on("changed", (dataValue) => {
//   console.log("Robot2/Mode: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/Mode", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/Mode",
//   });
// });
// monitoredItemRobot2[7].on("changed", (dataValue) => {
//   console.log("Robot2/SecLevel: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/SecLevel", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/SecLevel",
//   });
// });
// monitoredItemRobot2[8].on("changed", (dataValue) => {
//   console.log("Robot2/theta1: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/theta1", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/theta1",
//   });
// });
// monitoredItemRobot2[9].on("changed", (dataValue) => {
//   console.log("Robot2/theta2: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/theta2", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/theta2",
//   });
// });
// monitoredItemRobot2[10].on("changed", (dataValue) => {
//   console.log("Robot2/theta3: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/theta3", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/theta3",
//   });
// });
// monitoredItemRobot2[11].on("changed", (dataValue) => {
//   console.log("Robot2/theta4: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/theta4", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/theta4",
//   });
// });
// monitoredItemRobot2[12].on("changed", (dataValue) => {
//   console.log("Robot2/XYZ1: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/XYZ1", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/XYZ1",
//   });
// });
// monitoredItemRobot2[13].on("changed", (dataValue) => {
//   console.log("Robot2/XYZ2: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/XYZ2", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/XYZ2",
//   });
// });
// monitoredItemRobot2[14].on("changed", (dataValue) => {
//   console.log("Robot2/XYZ3: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/XYZ3", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/XYZ3",
//   });
// });
// monitoredItemRobot2[15].on("changed", (dataValue) => {
//   console.log("Robot2/XYZ4: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/XYZ4", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/XYZ4",
//   });
// });
// monitoredItemRobot2[16].on("changed", (dataValue) => {
//   console.log("Robot2/XYZ5: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/XYZ5", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/XYZ5",
//   });
// });
// monitoredItemRobot2[17].on("changed", (dataValue) => {
//   console.log("Robot2/XYZ6: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/XYZ6", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/XYZ6",
//   });
// });
//   AttriId_value = AttributeIds.Value;

}
// async function stopOPCUAClient() {
//   if (subscription) await subscription.terminate();
//   if (session) await session.close();
//   if (client) await client.disconnect();
// }
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get("/", function (req, res) {
  res.render(__dirname + '/views/index.ejs');
  io.sockets.emit("login", "You have to login first!");
  console.log("Hello inside")
});
app.get ("/scara", function(req, res, next){
  if (!login_successful) {
      res.redirect('..');
      io.sockets.emit("login", "You have to login first!");
  } else {
      res.render('scara');
  }
});
app.get("/delta1", function (req, res, next) {
  if (!login_successful) {
    res.redirect('..');
  } else {
    next();
    res.render('delta1')
  }
});
app.get("/vas", function (req, res, next) {
  if (!login_successful) {
    res.redirect('..');
  } else {
    next();
    res.render('vas')
  }
});
console.log("Hello outside")
const sessionMiddleware = exsession({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
});
app.use(sessionMiddleware);

io.use(sharedsession(sessionMiddleware));
io.sockets.on("connection", function (socket) {
  socket.on("login", data => {
    console.log(data);
    createOPCUAClient(io, data, socket);
  });
  socket.on('send-chat-message', message => {
    console.log(message);
    socket.emit('received-chat-message', message);
});
socket.on('Robot1/SVON', message => {
    console.log("Robot1/SVON " + message);
    // session.write(nodesToWrite[0], function (err, statusCode, diagnosticInfo) {
    //     if (!err) {
    //         console.log(" write ok");
    //         console.log(nodesToWrite[0])
    //         console.log(diagnosticInfo);
    //         console.log(statusCode);
    //     }
    // });
});
socket.on('Robot1/SVOFF', message => {
    console.log("Robot1/SVOFF " + message);
    // session.write(nodesToWrite[1], function (err, statusCode, diagnosticInfo) {
    //     if (!err) {
    //       console.log(" write ok");
    //       console.log(nodesToWrite[1])
    //       console.log(diagnosticInfo);
    //       console.log(statusCode);
    //     }
    // });
});
socket.on('Robot1/Sel_Cor', message => {
    console.log("Robot1/Sel_Cor: " + message);
    // switch (message) {
    //   case "Joint Coordinates":
    //     session.write(nodesToWrite[2], function (err, statusCode, diagnosticInfo) {
    //     if (!err) {
    //       console.log(" write ok");
    //       console.log(nodesToWrite[2])
    //       console.log(diagnosticInfo);
    //       console.log(statusCode);
    //     }
    //     });
    //     break;
    //   case "Cartesian Coordinates":
    //     session.write(nodesToWrite[3], function (err, statusCode, diagnosticInfo) {
    //       if (!err) {
    //         console.log(" write ok");
    //         console.log(nodesToWrite[3])
    //         console.log(diagnosticInfo);
    //         console.log(statusCode);
    //       }
    //     });
    //     break;
    //   case "Tool Coordinates":

    //     break;
    //   case "User Coordinates":

    //     break;
    //   default:

    // }
});
socket.on('Robot1/pressed', message => {
    console.log(message + " pressed");
    // switch (message) {
    //   case 'J1_neg':
    //     session.write(nodesToWrite[4], function (err, statusCode, diagnosticInfo) {
    //     if (!err) {
    //       console.log(" write ok");
    //       console.log(nodesToWrite[4])
    //       console.log(diagnosticInfo);
    //       console.log(statusCode);
    //     }
    //     });
    //     break;
    //   case 'J1_pos':

    //     break;
    //   case 'J2_neg':

    //     break;
    //   case 'J2_pos':

    //     break;
    //   case 'J3_neg':

    //     break;
    //   case 'J3_pos':

    //     break;
    //   case 'J4_neg':

    //     break;
    //   case 'J4_pos':

    //     break;
    //   case 'J5_neg':

    //     break;
    //   case 'J5_pos':

    //     break;
    //   case 'J6_neg':

    //     break;
    //   case 'J6_pos':

    //     break;

    //   default:
    //     console.log("Undefined message");
    // }
});
socket.on('Robot1/released', message => {
    console.log(message + " released");
    // switch (message) {
    //   case 'J1_neg':
    //     session.write(nodesToWrite[5], function (err, statusCode, diagnosticInfo) {
    //     if (!err) {
    //       console.log(" write ok");
    //       console.log(nodesToWrite[5])
    //       console.log(diagnosticInfo);
    //       console.log(statusCode);
    //     }
    //     });
    //     break;
    //   case 'J1_pos':

    //     break;
    //   case 'J2_neg':

    //     break;
    //   case 'J2_pos':

    //     break;
    //   case 'J3_neg':

    //     break;
    //   case 'J3_pos':

    //     break;
    //   case 'J4_neg':

    //     break;
    //   case 'J4_pos':

    //     break;
    //   case 'J5_neg':

    //     break;
    //   case 'J5_pos':

    //     break;
    //   case 'J6_neg':

    //     break;
    //   case 'J6_pos':

    //     break;

    //   default:
    //     console.log("Undefined message");
    // }
});      
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
server.listen(port, () => {
  console.log("Listening on port " + port);
  console.log("visit http://localhost:" + port);
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

const express = require("express");
require("dotenv").config();
const {PORT} = process.env

var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: 'fb4a86e5a2b04deb9a54874f5c699d12',
  captureUncaught: true,
  captureUnhandledRejections: true,
})
rollbar.log('Hello world!')


const bots = require("./src/botsData");
const shuffle = require("./src/shuffle");
const playerRecord = {
  wins: 0,
  losses: 0,
};
const app = express();

app.use(express.json());
// app.use(express.static("./public"));
app.use(express.static(`${__dirname}/public`))


// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
  robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
  robots
    .map(({ attacks }) =>
      attacks.reduce((total, { damage }) => total + damage, 0)
    )
    .reduce((total, damage) => total + damage, 0);

// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
  const compAttack = calculateTotalAttack(compDuo);
  const playerHealth = calculateTotalHealth(playerDuo);
  const playerAttack = calculateTotalAttack(playerDuo);
  const compHealth = calculateTotalHealth(compDuo);

  return {
    compHealth: compHealth - playerAttack,
    playerHealth: playerHealth - compAttack,
  };
};

app.get("/api/robots", (req, res) => {
  try {
    res.status(200).send(botsArr);
  } catch (error) {
    console.error("ERROR GETTING BOTS", error);
    rollbar.error("ERROR GETTING BOTS", {error});
    res.sendStatus(400);
  }
});

app.get("/api/robots/shuffled", (req, res) => {
  try {
    let shuffled = shuffle(bots);
    res.status(200).send(shuffled);
  } catch (error) {
    console.error("ERROR GETTING SHUFFLED BOTS", error);
    rollbar.error("Error getting shuffled bots", {error});
    res.sendStatus(400);
  }
});

app.post("/api/duel", (req, res) => {
  rollbar.info("Duel started")
  try {
    const { compDuo, playerDuo } = req.body;

    const { compHealth, playerHealth } = calculateHealthAfterAttack({
      compDuo,
      playerDuo,
    });

    // comparing the total health to determine a winner
    if (compHealth > playerHealth) {
      Rollbar.info("CPU is the winner")
      playerRecord.losses += 1;
      res.status(200).send("You lost!");
    } else {
      Rollbar.info("User is the winner")
      playerRecord.losses += 1;
      res.status(200).send("You won!");
    }
  } catch (error) {
    console.log("ERROR DUELING", error);
    res.sendStatus(400);
  }
});

app.get("/api/player", (req, res) => {
  try {
    res.status(200).send(playerRecord);
  } catch (error) {
    console.log("ERROR GETTING PLAYER STATS", error);
    res.sendStatus(400);
  }
});


function logEndpointHitToRollbar(req, res, next) {
  rollbar.log(`Endpoint ${req.path} was hit`);
  next();
}
app.use(logEndpointHitToRollbar);
app.use(rollbar.errorHandler());


app.listen(PORT || 8000, () => {
  console.log(`Listening on ${PORT}`);
  rollbar.info('Duel Duo App started');

});

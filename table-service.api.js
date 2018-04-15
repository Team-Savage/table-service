// LIB
const _ = require('ramda');

// HTTP
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// DB
const MongoClient = require('mongodb').MongoClient;
const dbUrl = `mongodb://localhost`;
const dbName = 'birdtable-table-service';

const API = (client) => {
  const db = client.db(dbName);

  // Get the current outstanding subtotal on a table
  app.get('/table/:table_id', (req, res) => {

  });

  // Create new table
  app.post('/table', async (req, res) => {
    const tables = db.collection('tables');
    const seats  = db.collection('seats');
    const numSeats  = parseInt(req.body.numSeats);

    const seatInserts = _.map(() => {
      return { currentOrders: [], pastOrders: [] };
    }, _.range(0, numSeats));

    const seatInsertResults = await seats.insertMany(seatInserts);
    const seatIds = _.map((key) => seatInsertResults.insertedIds[key],Object.keys(seatInsertResults.insertedIds));
    const tableInsertResults = tables.insert({ seats: seatIds });

    res.send({ status: 'ok', data: tableInsertResults });
  });

  app.post('/table/add_order/:table_id', (req, res) => {

  });

  app.delete('/table/remove_order/:table_id/:order_id', (req, res) => {

  });

  app.get('/table/subtotal/:table_id', (req, res) => {

  });

  app.post('/table/close/:table_id', (req, res) => {

  });

  app.post('/table/undo/:table_id', (req, res) => {

  });
}

MongoClient.connect(dbUrl).then(API).catch((err) => {
  console.log('some crud', err);
});

app.listen(3000);
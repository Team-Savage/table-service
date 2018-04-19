// LIB
const _ = require('ramda');

// HTTP
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// DB
const MongoClient = require('mongodb').MongoClient;
const ObjectId    = require('mongodb').ObjectId;
const dbUrl = `mongodb://localhost`;
const dbName = 'birdtable-table-service';

const API = (client) => {
  const db = client.db(dbName);

  // Get the current outstanding subtotal on a table
  app.get('/table/:table_id', async (req, res) => {
    const tableId = req.params.table_id;

    // first get all the orders on this table that are not closed
    // const tables = db.collection('tables');
    const orders = db.collection('orders');
    // const outstandingOrders = await orders.find({ tid: new ObjectId(tableId), paid_at: null }).toArray();
    // const subtotal = _.reduce((acc, order) => order.outstandingOrders
    const subtotalResult = await orders.aggregate([
     { $lookup:
       {
         from: 'items',
         localField: 'iid',
         foreignField: '_id',
         as: 'item'
       }
     },
     // { $group: { _id: '$item.rid', total: { $sum: '$item.price' } } }
    ]).toArray();

    console.log(subtotalResult);
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
    const seatIds = _.map((key) => seatInsertResults.insertedIds[key], Object.keys(seatInsertResults.insertedIds));
    const tableInsertResults = tables.insert({ seats: seatIds });

    res.send({ status: 'ok', data: tableInsertResults });
  });

  app.post('/table/add_order/:table_id', async (req, res) => {
    const orders = db.collection('orders');

    const tableId = req.params.table_id;
    const orderItemId   = req.body.orderItemId;
    const order = {
      idd: new ObjectId(orderItemId),
      tid: new ObjectId(tableId),
      created_at: new Date(), 
      billed_at: null,
      paid_at: null,
      fulfilled_at: null
    };

    const insertOrder = await orders.insertOne(order);

    res.send({ status: 'ok', data: insertOrder });
  });

  app.delete('/table/remove_order/:table_id/:order_id', (req, res) => {

  });

  app.get('/table/subtotal/:table_id', (req, res) => {

  });

  app.post('/table/close/:table_id', (req, res) => {

  });

  app.post('/table/undo/:table_id', (req, res) => {

  });

  app.post('/item/create/:restaurant_id', async (req, res) => {
    const items = db.collection('items');
    const restaurantId = req.params.restaurant_id;
    const item = req.body.item;

    const itemResult = await items.insertOne({ rid: new ObjectId(restaurantId), ...item });

    res.send({ status: 'ok', data: itemResult });
  });

  app.post('/restaurant/new', async (req, res) => {
    const restaurants = db.collection('restaurants');
    const restaurantResults = await restaurants.insertOne({});
    res.send({ status: 'ok', data: restaurantResults });
  });
}

MongoClient.connect(dbUrl).then(API).catch((err) => {
  console.log('some crud', err);
});

app.listen(3000);
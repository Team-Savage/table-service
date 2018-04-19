/*

Table:

{
  _id: ObjectId,
  rid: ObjectId -> Restaurant
}

Order: {
  _id: ObjectId,
  tid: ObjectId,
  iid: ObjectId -> Item,
  created_at: Date,
  billed_at: Date,
  paid_at: Date,
  fulfilled_at: Date
}

Item: {
  _id: ObjectId,
  rid: ObjectId,
  name: String,
  price: Float
}

Financial Rules:
Used for taxes and tips in subtotal operations
(not yet fleshed out)


{
  _id: ObjectId,
  name: String,
  operations: [Op...]
}

Table record: {
  _id: ObjectId,
  action: String
}

*/
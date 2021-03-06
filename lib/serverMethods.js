const { ObjectId } = require("mongodb");
const { collection } = require("./database");

async function getAllBids({ collectionName }) {
  const cursor = collection(collectionName).find();
  return await cursor.toArray();
}

async function getUnverifiedBids({ collectionName }) {
  const cursor = collection(collectionName).find({ verification: 0 });
  return await cursor.toArray();
}

async function getHighestBid({ collectionName }) {
  const cursor = collection(collectionName)
    .find({ verification: 1 })
    .sort({ money: -1 })
    .limit(1);
  return await cursor.toArray();
}

async function insertData({ collectionName, data }) {
  return await collection(collectionName).insertOne(data);
}

async function updateData({ collectionName, id, data }) {
  await collection(collectionName).updateOne(
    { _id: ObjectId(id) },
    { $set: data }
  );
}

async function deleteData({ collectionName, id }) {
  return await collection(collectionName).deleteOne({ _id: ObjectId(id) });
}

async function validateUser({ username, password }) {
  const validation = await collection("users").findOne({ username: username });
  if (validation.password === password) {
    return true;
  } else {
    return false;
  }
}

async function getLoginToken({ username }) {
  await collection("users").updateOne(
    { username: username },
    { $set: { token: `${username} + ${new Date()}`.toString() } }
  );
  const token = await collection("users").findOne(
    { username: username },
    { projection: { _id: 0, token: 1 } }
  );
  return token;
}

async function getUserRights({ token }) {
  const rank = await collection("users").findOne(
    { token: token },
    { projection: { _id: 0, rank: 1 } }
  );
  return rank;
}

async function checkAvailability({ username }) {
  const exists = await collection("users").findOne({ username: username });
  console.log(exists);
  if (exists !== null) {
    return false;
  } else {
    return true;
  }
}

exports.getAllBids = getAllBids;
exports.getUnverifiedBids = getUnverifiedBids;
exports.getHighestBid = getHighestBid;
exports.insertData = insertData;
exports.updateData = updateData;
exports.deleteData = deleteData;
exports.validateUser = validateUser;
exports.getLoginToken = getLoginToken;
exports.getUserRights = getUserRights;
exports.checkAvailability = checkAvailability;

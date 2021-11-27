require("dotenv").config();
const dbUrl = process.env.ATLAS_URI;
const { MongoClient, ObjectId } = require("mongodb");

//connecting to the database, creating a collection, inserting many, and disconnecting
let instance = null;

class DAO {
  //constructor for DAO object
  constructor() {
    if (!instance) {
      instance = this;
      this.client = new MongoClient(dbUrl);
      this.db = null;
      this.collection = null;
    }
    return instance;
  }

  //connect to MongoDB
  async connect(dbName, collName) {
    //if db exist return 
    if (this.db) {
      return;
    }
    //Else connect to db
    await this.client.connect();
    //Create db
    this.db = await this.client.db(dbName);
    console.log("Successfully connected to MongoDB database " + dbName);
    //And create the collection 
    this.collection = await this.db.collection(collName)
  }

  //insert the parsed dataset into MongoDB 
  async insertMany(array) {
    let result = await this.collection.insertMany(array);
    console.log(result.insertedCount)
    return result.insertedCount;
  }

  //create indexers for collection
  async createIndex(index) {
    return await this.collection.createIndex(index)
  }

  //Query for one document that has the the id gotten in input
  async findSingleCase(id) {
    let result = await this.collection.findOne({ "_id": new ObjectId(id) });
    return result;
  }

  //Query for all the document in the collection
  async findAll() {
    let result = await this.collection.find();
    return result.toArray();
  }

  //Find all document in which the geo is inside the polygon 
  async findPolygon(neLon, neLat, swLon, swLat) {
    let northEast = [neLon, neLat];
    let southWest = [swLon, swLat];
    //Changed for box because it's easier to deal with
    let result = await this.collection.find({
      Geo: {
        $geoWithin: {
          $box: [
            southWest, northEast
          ]
        }
      }
    });
    return result.toArray();
  }

  //disconnect from MongoDB
  async disconnect() {
    this.client.close();
  }
}

module.exports = DAO;
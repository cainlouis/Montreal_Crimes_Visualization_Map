/* eslint-disable max-len */
const express = require("express");
const router = express.Router();
const DAO = require("../db/conn");
const db = new DAO();

/**
 * @swagger
 * /all:
 *   get:
 *     summary: Retrieve a list of Criminal Records
 *     description: Retrieve a list of Criminal Records of Montreal from 2015 until now
 *     responses: 
 *       200:
 *         description: A list of Criminal Records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Object ID in MongoDB
 *                   example: "619d4fbf9ef2242d17fee333"
 *                 CATEGORIE:
 *                   type: string
 *                   description: Category of the crime
 *                   example: "Vol de véhicule à moteur"
 *                 DATE:
 *                   type: string
 *                   description: Date of the crime(YYYY-MM-DD)
 *                   example: "2018-09-13"
 *                 QUART:
 *                   type: string
 *                   description: Shift of the crime(jour, soir, nuit)
 *                   example: "jour"
 *                 PDQ:
 *                   type: string
 *                   description: The number of the police department in charge
 *                   example: "30"
 *                 Geo:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: type of the geospatial object
 *                       example: "Point"
 *                     coordinates:
 *                       type: number
 *                       description: coordinate of the crime scence
 *                       example: [-73.62677804694519, 45.567779812980355] 
 */
router.get("/all", async function(req, res){
  await db.connect("CriminalRecord", "CriminalActs");
  let response = await db.findAll();
  return res.send(response);
});

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Retrieve a single case of Criminal Records
 *     description: Retrieve single case from the Criminal Records of Montreal from 2015 until now
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ObjectId of the case in MongoDB to retrieve
 *         schema: 
 *           type: string
 *     responses: 
 *       200:
 *         description: A case of Criminal Records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Object ID in MongoDB
 *                   example: "619d4fbf9ef2242d17fee333"
 *                 CATEGORIE:
 *                   type: string
 *                   description: Category of the crime
 *                   example: "Vol de véhicule à moteur"
 *                 DATE:
 *                   type: string
 *                   description: Date of the crime(YYYY-MM-DD)
 *                   example: "2018-09-13"
 *                 QUART:
 *                   type: string
 *                   description: Shift of the crime(jour, soir, nuit)
 *                   example: "jour"
 *                 PDQ:
 *                   type: string
 *                   description: The number of the police department in charge
 *                   example: "30"
 *                 Geo:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: type of the geospatial object
 *                       example: "Point"
 *                     coordinates:
 *                       type: number
 *                       description: coordinate of the crime scence
 *                       example: [-73.62677804694519, 45.567779812980355] 
 */
router.get("/:id", async function(req, res){
  await db.connect("CriminalRecord", "CriminalActs");
  if(req.params.id === undefined){
    console.log("No param")
    return res.sendStatus(404)
  } else{
    try{
      let singleCase = await db.findSingleCase(req.params.id);
      return res.send(singleCase);
    } catch(e){
      return res.sendStatus(404)
    }
  }
});

/**
 * @swagger
 * /area:
 *   get:
 *     summary: Retrieve a list of Criminal Records in a rectangle-shaped area
 *     description: Retrieve a list from the Criminal Records of Montreal from 2015 until now in a rectangle-shaped area
 *     parameters:
 *       - in: path
 *         name: neLat
 *         required: true
 *         description: North East Latitude of the area
 *         schema: 
 *           type: number
 *       - in: path
 *         name: neLon
 *         required: true
 *         description: North East Longitude of the area
 *         schema:
 *           type: number
 *       - in: path
 *         name: swLat
 *         required: true
 *         description: South West Latitude of the area
 *         schema:
 *           type: number
 *       - in: path
 *         name: swLon
 *         required: true
 *         description: South West Longitude of the area
 *         schema:
 *           type: number
 *     responses: 
 *       200:
 *         description: A case of Criminal Records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Object ID in MongoDB
 *                   example: "619d4fbf9ef2242d17fee333"
 *                 CATEGORIE:
 *                   type: string
 *                   description: Category of the crime
 *                   example: "Vol de véhicule à moteur"
 *                 DATE:
 *                   type: string
 *                   description: Date of the crime(YYYY-MM-DD)
 *                   example: "2018-09-13"
 *                 QUART:
 *                   type: string
 *                   description: Shift of the crime(jour, soir, nuit)
 *                   example: "jour"
 *                 PDQ:
 *                   type: string
 *                   description: The number of the police department in charge
 *                   example: "30"
 *                 Geo:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: type of the geospatial object
 *                       example: "Point"
 *                     coordinates:
 *                       type: number
 *                       description: coordinate of the crime scence
 *                       example: [-73.62677804694519, 45.567779812980355] 
 */
router.get("/area", async function(req, res){
  await db.connect("CriminalRecord", "CriminalActs");
  let neLat = req.params.neLat ? req.params.neLat : 0;
  let neLon = req.params.neLon ? req.params.neLon : 0;
  let swLat = req.params.swLat ? req.params.swLat : 0;
  let swLon = req.params.swLon ? req.params.swLon : 0;
  let polygon = await db.findPolygon(neLat, neLon, swLat, swLon);
  if(polygon === {}){
    return res.sendStatus(404)
  }
  return polygon;
})

module.exports = router;
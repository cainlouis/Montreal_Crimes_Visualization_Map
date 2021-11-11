const { test, expect } = require("@jest/globals")
const load = require("../server/utils/load.js")
const path = "./__test__/test.csv"
test("get json file from csv file", async () => {
    let testobj = await load(path)
    console.log(testobj[0])
    let expected = { "CATEGORIE": "Méfait", "DATE": "2021-04-12", "QUART": "soir", "PDQ": "50", "Geo": { "type": "Point", "coordinates": [-73.62308621281647, 45.49686399748815] } }
    expect(testobj[0]).toEqual(expected)
})

test("validate the length of the array", async () => {
    let testobj = await load(path)
    console.log(testobj)
    expect(testobj.length).toEqual(2)
})
import dbPromise from "./connection.js"

dbPromise.then(db => {
  db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS movies`)
  })
})
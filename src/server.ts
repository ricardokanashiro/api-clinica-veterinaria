import express from "express"

import Database from "./database/database"

const server = express()

server.use(express.json())

const PORT = process.env.PORT || 3000

server.listen(PORT, () =>
   console.log(`Server listening on port ${PORT}`)
)
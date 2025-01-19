import { Pool } from 'pg'
import sqlite from 'sqlite3'

import "dotenv/config"

class Database {

   public db: Pool | sqlite.Database

   constructor() {
      this.db = this.InitializeDatabase()
   }

   private InitializeDatabase(): Pool | sqlite.Database {

      const isPostgres = process.env.PGHOST && process.env.PGUSER && process.env.PGPASSWORD

      const db = isPostgres
      ? new Pool({
         user: process.env.PGUSER,
         host: process.env.PGHOST,
         database: process.env.PGDB,
         password: process.env.PGPASSWORD,
         port: parseInt(process.env.PORT || '5432'),
         ssl: true
      })
      : new sqlite.Database('./src/database/db.sqlite', (err) => err 
         ? console.log("Erro ao conectar ao SQLite " + err) : console.log("Sucesso ao conectar ao SQLite")
      )

      if (isPostgres && this.db instanceof Pool) {
         this.db.connect()
      }

      return db
   }

   public async closeConnection(): Promise<void> {

      if(this.db instanceof Pool) {
         await this.db.end()
         return
      }

      this.db.close((err) => console.error("Erro ao fechar banco de dados SQLite: " + err))
   }

   public async query(sql: string, params: any[] = []): Promise<any> {

      if(this.db instanceof Pool) {

         try {
            const result = await this.db.query(sql, params)
            return result.rows
         }
         catch (err) {
            throw new Error("Erro ao fazer consulta no banco de dados PostgreSQL: " + err)
         }

      }

      if(this.db instanceof sqlite.Database) {

         return new Promise((resolve, reject) => {

            if(sql.includes("select")) {

               (this.db as sqlite.Database).all(sql, params, (err, rows) => {

                  if(err) {
                     reject("Erro ao executar select no SQLite: " + err)
                     return
                  }

                  resolve(rows)
               })
            }

            (this.db as sqlite.Database).run(sql, params, (err) => {

               if(err) {
                  reject("Erro ao executar comando do SQLite " + err)
                  return
               }

               resolve(this)

            })
         })
      }
   
   }
}

export default new Database()
import { Pool } from 'pg'

import Database from "./database"

const createTables = async () => {

   const queries = [

      `CREATE TABLE veterinarios (
         id VARCHAR(40) NOT NULL,
         nome VARCHAR(60) NOT NULL,
         email VARCHAR(60) NOT NULL,
         cpf VARCHAR(12) NOT NULL,
         telefone VARCHAR(12) NOT NULL,

         PRIMARY KEY (id)
      );`,

      `CREATE TABLE clientes (
         id VARCHAR(40) NOT NULL,
         nome VARCHAR(60) NOT NULL,
         email VARCHAR(60) NOT NULL,
         cpf VARCHAR(12) NOT NULL,
         telefone VARCHAR(12) NOT NULL,

         PRIMARY KEY (id)
      );`,

      `CREATE TABLE administradores (
         id VARCHAR(40) NOT NULL,
         nome VARCHAR(60) NOT NULL,
         email VARCHAR(60) NOT NULL,
         senha VARCHAR(30) NOT NULL,

         PRIMARY KEY (id)
      );`,

      `CREATE TABLE pets (
         id VARCHAR(40) NOT NULL,
         nome VARCHAR(60) NOT NULL,
         idade INTEGER NOT NULL,
         clienteId VARCHAR(40) NOT NULL,
         tipo VARCHAR(80) NOT NULL,
         raca VARCHAR(80) NOT NULL,

         PRIMARY KEY (id),
         FOREIGN KEY (clienteId) REFERENCES clientes (id)
      );`,

      `CREATE TABLE consultas (
         id VARCHAR(40) NOT NULL,
         clienteId VARCHAR(40) NOT NULL,
         petId VARCHAR(40) NOT NULL,
         veterinarioId VARCHAR(40) NOT NULL,
         data VARCHAR(8) NOT NULL,
         horario VARCHAR(6) NOT NULL,

         FOREIGN KEY (clienteId) REFERENCES clientes (id),
         FOREIGN KEY (petId) REFERENCES pets (id),
         FOREIGN KEY (veterinarioId) REFERENCES veterinarios (id)
      );`
   ]

   if(Database.db instanceof Pool) {
      await Database.query(queries.join(''))
      return
   }

   for(let query of queries) {
      await Database.query(query)
   }
}

const dropTables = async () => {
   const queries = [
      `DROP TABLE consultas;`,
      `DROP TABLE pets;`,
      `DROP TABLE veterinarios;`,
      `DROP TABLE clientes;`,
      `DROP TABLE administradores`
   ]

   if(Database.db instanceof Pool) {
      await Database.query(queries.join(''))
      console.log(queries.join(''))
      return
   }

   for(let query of queries) {
      await Database.query(query)
   }
}

createTables()
// dropTables()
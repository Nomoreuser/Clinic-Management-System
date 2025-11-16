import pkg from "pg"

const {Pool} = pkg;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "Clinic_Inventory",
    password: "gerald04",
    port: 5432
})

export default pool;
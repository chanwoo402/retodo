const sql = require('mssql')
const config = require('../config')

const pool = new sql.ConnectionPool(config.dbconfig).connect().then(async pool => {
    console.log('connection to mssql')
    await pool.query`use edu_and_test2`
    return pool
}).catch(err => console.log('failed, ', err))

module.exports = {
    sql, pool
}

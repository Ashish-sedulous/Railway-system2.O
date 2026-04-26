import pool from '../config/db.js'

export const getalltrains= async ()=>{
    const result=await pool.query("SELECT * FROM trains");
    return result.rows
};
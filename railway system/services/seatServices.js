import pool from '../config/db.js'

export const getSeatByScheduleId= async (scheduleId)=>{
    const results= await pool.query(
        "SELECT * FROM seats WHERE schedule_id=$1",
        [scheduleId]
    )
    return results.rows;
};
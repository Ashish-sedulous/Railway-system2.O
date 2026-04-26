import pool from '../config/db.js';

export const createBooking=async ({ userId, scheduleId,amount })=>{
    const client=await pool.connect();
    
    try{
        await client.query('BEGIN');

        // //lock seats using seat no manually
        // const seat=await client.query(
        //     "SELECT * FROM seats WHERE seat_id=$1 AND schedule_id=$2 FOR UPDATE ",
        //     [seatId,scheduleId]
        // );

        //find and lock seat automatically
        const seat=await client.query(
            `SELECT * FROM seats 
            WHERE schedule_id=$1 AND STATUS='AVAILABLE'
            LIMIT 1
            FOR UPDATE`,
            [scheduleId]
        );

        // if(!seat.rows.length){
        //     throw new Error("No Seats Available");
        // }

        // if(seat.rows[0].status !== 'AVAILABLE'){
        //     throw new Error("Seat already boooked");
        // }


        //const seatId = seat.rows[0].seat_id;

        let seatId = null;
        let status = 'WAITING';
        let waitingNumber = null;

        if (seat.rows.length) {
            seatId = seat.rows[0].seat_id;
            status = 'CONFIRMED';

            await client.query(
                "UPDATE seats SET status='BOOKED' WHERE seat_id=$1 AND schedule_id=$2",
                [seatId,scheduleId]
            );
        }else {
            // 🔥 Get next waiting number
            const result = await client.query(
              `SELECT COALESCE(MAX(waiting_number), 0) AS max_waiting FROM booking 
              WHERE schedule_id=$1 AND status='WAITING'`,
               [scheduleId]
            );

            waitingNumber = result.rows[0].max_waiting + 1;
        }

         // Generate PNR
        const pnr = "PNR" + Date.now() + Math.floor(Math.random()*1000);

        //insert booking
        const booking=await client.query(
            `INSERT INTO booking (user_id, schedule_id, seat_id, pnr, status,waiting_number)
             VALUES ($1,$2,$3,$4,$5,$6)
             RETURNING booking_id`,
            [userId, scheduleId, seatId, pnr,status,waitingNumber]
        );

        // //update seat
        // await client.query(
        //     "UPDATE seats SET status='BOOKED' WHERE seat_id=$1",
        //     [seatId]
        // );

        // Insert payment
        await client.query(
            "INSERT INTO payment (booking_id, amount, status) VALUES ($1,$2,'SUCCESS')",
            [booking.rows[0].booking_id, amount]
        );

        await client.query("COMMIT");

        //return { message: "Booking successful", seatId,pnr };
        return {
            message: status === 'CONFIRMED' 
                ? "Booking Confirmed" 
                : `Added to Waiting List(WL${waitingNumber})`,
            seatId,
            pnr,
            waitingNumber,
            status
        };
    }catch (err){
        await client.query("ROLLBACK");
        throw err;
    } finally{
        client.release();
    }
};

export const cancelBooking = async (bookingId) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Get booking details
        const booking = await client.query(
            "SELECT * FROM booking WHERE booking_id=$1 FOR UPDATE",
            [bookingId]
        );

        if (!booking.rows.length) {
            throw new Error("Booking not found");
        }

        const { seat_id, schedule_id, status } = booking.rows[0];

        // Mark booking cancelled
        await client.query(
            "UPDATE booking SET status='CANCELLED' WHERE booking_id=$1",
            [bookingId]
        );

        //  If it was CONFIRMED → free seat
        if (status === 'CONFIRMED') {

            await client.query(
                "UPDATE seats SET status='AVAILABLE' WHERE seat_id=$1 AND schedule_id=$2",
                [seat_id,schedule_id]
            );

            //  Find first waiting user (WL1)
            const waiting = await client.query(
                `SELECT * FROM booking
                 WHERE schedule_id=$1 AND status='WAITING'
                 ORDER BY waiting_number ASC
                 LIMIT 1
                 FOR UPDATE`,
                [schedule_id]
            );

            if (waiting.rows.length) {
                const nextUser = waiting.rows[0];

                //Assign seat to WL1
                await client.query(
                    `UPDATE booking
                     SET status='CONFIRMED',
                         seat_id=$1,
                         waiting_number=NULL
                     WHERE booking_id=$2`,
                    [seat_id, nextUser.booking_id]
                );

                // Update seat again
                await client.query(
                    "UPDATE seats SET status='BOOKED' WHERE seat_id=$1 AND schedule_id=$2",
                    [seat_id,schedule_id]
                );

                //  Shift waiting numbers
                await client.query(
                    `UPDATE booking
                     SET waiting_number = waiting_number - 1
                     WHERE schedule_id=$1 AND status='WAITING'`,
                    [schedule_id]
                );
            }
        }

        await client.query("COMMIT");

        return { message: "Booking cancelled and waiting updated" };

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};

export const getBookingByUser=async(userId)=>{
    const result=await pool.query(
        `SELECT b.*, s.seat_number, t.train_id
         FROM booking b
         LEFT JOIN seats s ON b.seat_id = s.seat_id
         LEFT JOIN train_schedule ts ON b.schedule_id = ts.schedule_id
         LEFT JOIN trains t ON ts.train_id = t.train_id
         WHERE b.user_id=$1`,
        [userId]
    );
    return result.rows;
}
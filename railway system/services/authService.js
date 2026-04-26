import pool from "../config/db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser=async({user_name,email,password})=>{
    const existing = await pool.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
    );

    if (existing.rows.length) {
        throw new Error("Email already exists");
    }

    const hashedPassword=await bcrypt.hash(password,10);

    const result=await pool.query(
        `INSERT INTO users(user_name,email,password)
        VALUES($1,$2,$3)
        RETURNING user_id`,
        [user_name,email,hashedPassword]
    );
    return result.rows[0];
};

export const loginUser=async({email,password})=>{
    const result=await pool.query(
        `SELECT * FROM users WHERE email=$1`,
        [email]
    );

    if(!result.rows.length){
        throw new Error("User Not Found");
    }

    const user=result.rows[0];

    const isMatch=await bcrypt.compare(password,user.password);

    if(!isMatch){
        throw new Error("Invalid Password");
    }

    const token=jwt.sign(
        {userId:user.user_id},
        process.env.JWT_SECRET,
        {expiresIn:'1h'}
    );

    return { token };
};


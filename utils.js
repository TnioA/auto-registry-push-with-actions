import jwt from 'jsonwebtoken';
import db from './db.js';
const JWT_PRIVATE_KEY = 'sdfgh1ed56fgG15346451HH56GRSB15y1H46156fgvb51df6D5bg1sdfgg665';

export async function getBody(req) {
    const buffers = [];

    for await (const chunk of req) {
        buffers.push(chunk);
    }

    const data = Buffer.concat(buffers).toString();
    return data.length > 0 ? JSON.parse(data) : undefined;
}

export function buildResponse(res, data) {
    res.writeHead(data?.success ? 200 : 400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data, null, 2));

    return res;
}

export function getUserById(id) {
    const user = db.find(x => x.id === id);
    return user;
}

export function getuserByEmailAndPassword(email, password) {
    if (email !== "teste@teste.com" || password !== "123")
        return null;

    const user = db.find(x => x.email === email && x.password === password);
    return user;
}

export async function authenticate(req) {
    const authorization = req.headers.authorization;
    if (!authorization)
        return false;

    const token = authorization.replace("Bearer ", "");
    const tokenValidationResult = validateToken(token);
    if (!tokenValidationResult)
        return false;

    req.userId = tokenValidationResult.id;
    return true;
}

export function generateToken(data) {
    return jwt.sign(data, JWT_PRIVATE_KEY, { expiresIn: '30s' });
}

export function generateRefreshToken(id) {
    return jwt.sign({ id: id }, JWT_PRIVATE_KEY, { expiresIn: '1m' });
}

export function validateToken(token) {
    try {
        const data = jwt.verify(token, JWT_PRIVATE_KEY);
        return data;
    } catch (err) {
        return null;
    }
}
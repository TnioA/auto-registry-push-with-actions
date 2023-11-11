import {
    getUserById,
    getuserByEmailAndPassword,
    generateToken,
    generateRefreshToken,
    validateToken
} from './utils.js';
const refreshTokenList = [];

export async function healthCheck(req, res) {
    return { success: true, data: req.body };
}

export async function login(req, res) {
    const body = req.body;
    if (!body?.email || !body?.password)
        return { success: false, error: "Informe email e senha." };

    const user = getuserByEmailAndPassword(body.email, body.password);
    if (!user)
        return { success: false, error: "Dados incorretos." };

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user.id);
    refreshTokenList.push(refreshToken);

    return { success: true, data: { token: token, refresh: refreshToken } };
}

export async function refresh(req, res) {
    const refreshToken = req.body?.refreshToken;
    if (!refreshToken)
        return { success: false, error: "Informe o refresh token." };

    const refreshTokenResult = refreshTokenList.find(x => x === refreshToken);
    if (!refreshTokenResult)
        return { success: true, data: null };

    const validateTokenResult = validateToken(refreshTokenResult);
    if (!validateTokenResult)
        return { success: true, data: null };

    const user = getUserById(validateTokenResult.id);

    return { success: true, data: { token: user } };
}
const {hash,compare} = require('bcrypt');
const saltRounds = 12;

/**
 * Hash a password.
 * @param {string} password - The plain text password to hash.
 * @returns {Promise<string>} - A promise that resolves to the hashed password.
 */

async function hashPassword(password) {
    try {
        const _hash = await hash(password, saltRounds);
        return _hash;
    } catch (err) {
        throw new Error('Error hashing password: ' + err.message);
    }
}

/**
 * Verify a password against a hash.
 * @param {string} password - The plain text password to verify.
 * @param {string} hash - The hashed password to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to true if the password matches the hash, otherwise false.
 */

async function verifyPassword(password, hash) {
    try {
        const result = await compare(password, hash);
        return result;
    } catch (err) {
        throw new Error('Error verifying password: ' + err.message);
    }
}

module.exports = {verifyPassword,hashPassword}
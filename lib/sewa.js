
const fs = require('fs')
const toMs = require('ms')
const { 
	WAConnection: _WAConnection,
	MessageType,
} = require("@adiwajshing/baileys");
const simple = require("./simple.js");
const WAConnection = simple.WAConnection(_WAConnection);
const alpha = new WAConnection()
const { color } = require('./color')

/**
 * Add Sewa group.
 * @param {String} gid 
 * @param {String} expired 
 * @param {Object} _dir 
 */
const addSewaGroup = (gid, expired, _dir) => {
    const objj = { id: gid, expired: Date.now() + toMs(expired), status: true }
    _dir.push(objj)
    fs.writeFileSync('./database/group/sewa.json', JSON.stringify(_dir))
}

/**
 * Get sewa group position.
 * @param {String} gid 
 * @param {Object} _dir 
 * @returns {Number}
 */
const getSewaPosition = (gid, _dir) => {
    let position = null
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === gid) {
            position = i
        }
    })
    if (position !== null) {
        return position
    }
}

/**
 * Get sewa group expire.
 * @param {String} gid 
 * @param {Object} _dir 
 * @returns {Number}
 */
const getSewaExpired = (gid, _dir) => {
    let position = null
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === gid) {
            position = i
        }
    })
    if (position !== null) {
        return _dir[position].expired
    }
}

/**
 * Check group is sewa.
 * @param {String} userId 
 * @param {Object} _dir 
 * @returns {Boolean}
 */
const checkSewaGroup = (gid, _dir) => {
    let status = false
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === gid) {
            status = true
        }
    })
    return status
}

/**
 * Constantly checking sewa.
 * @param {object} WAConnection
 * @param {Object} _dir 
 */
const expiredCheck = (alpha, _dir) => {
    setInterval(() => {
        let position = null
        Object.keys(_dir).forEach((i) => {
            if (Date.now() >= _dir[i].expired) {
                position = i
            }
        })
        if (position !== null) {
            console.log(`Sewa expired: ${_dir[position].id}`)
            console.log(color('Silahkan gunakan pm2 agar bot tidak mati otomatis','yellow'))
            if (_dir[position].status === true){
                alpha.sendMessage(_dir[position].id, `Waktu sewa di grup ini sudah habis, bot akan keluar otomatis`, MessageType.text)
                .then(() => {
                    alpha.groupLeave(_dir[position].id)
                    .then(() => {
                        _dir.splice(position, 1)
                        fs.writeFileSync('./database/group/sewa.json', JSON.stringify(_dir))
                    })
                })
            }
        }
    }, 1000)
}

/**
 * Get all premium user ID.
 * @param {Object} _dir 
 * @returns {String[]}
 */
const getAllPremiumUser = (_dir) => {
    const array = []
    Object.keys(_dir).forEach((i) => {
        array.push(_dir[i].id)
    })
    return array
}

module.exports = {
    addSewaGroup,
    getSewaExpired,
    getSewaPosition,
    expiredCheck,
    checkSewaGroup,
    getAllPremiumUser
}

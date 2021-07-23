const bcryptjs = require('bcryptjs');


const createPasswordHash = (password = '') => {
    const salt = bcryptjs.genSaltSync()
    return bcryptjs.hashSync(password, salt)
}



module.exports = {
    createPasswordHash
}
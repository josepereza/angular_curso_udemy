const validateFields = require('./validate-fields');
const validateJWT = require('./validate-jwt');


module.exports = {
    ...validateFields,
    ...validateJWT
}
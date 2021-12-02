const mongoose = require('mongoose');


const formStepSchema = mongoose.Schema({
    'token': {
        type: String
    },
    'formToken': {
        type: String
    },
    'title': {
        type: String
    },
    'details': {
        type: String
    },
    'previousStepToken': {
        type: String
    },
    'nextStepToken': {
        type: String
    },
    'status': {
        type: String
    },
    'existence': {
        type: Number
    },
    'createdBy': {
        type: String
    },
    'sessionToken': {
        type: String
    },

}, {
    timestamps: true,
})


module.exports = mongoose.model('FormStep', formStepSchema);
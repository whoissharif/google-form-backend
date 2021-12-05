const mongoose = require('mongoose');


const ItemOptionSchema = mongoose.Schema({
    'token': {
        type: String
    },
    'formToken': {
        type: String
    },
    'stepToken': {
        type: String
    },
    'itemToken': {
        type: String
    },
    'title': {
        type: String
    },
    'itemType': {
        type: String
    },
    'titleType': {
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


module.exports = mongoose.model('ItemOption', ItemOptionSchema);
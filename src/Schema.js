const { Schema, model } = require('mongoose');

module.exports = (name, collection) => {
    const Money = new Schema({
        ID: {
            type: String,
            unique: true
        },

        data: Number
    });

    return model(name, Money, collection);
}
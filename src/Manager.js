const Mongoose = require('mongoose');
const DefaultMongoOptions = { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true,
    useFindAndModify: false
}

class MongoManager {
    /**
     * 
     * @param {string} uri MongoDB URI
     * @param {object} ops Options
     * @param {string} [ops.collection] Collection Name
     * @param {object} [ops.additionalOptions] Additional Options to pass into mongoose
     * @param {string} [ops.schema] Schema name
     */

    constructor(uri, ops = { schema: 'userBalance', collection: 'money', additionalOptions: {} }) {
        if (!uri || typeof uri !== 'string') return new Error('Invalid URI');

        /**
         * MongoDB Uri
         */
        this.uri = uri;

        /**
         * Collection name
         */
        this.collection = ops.collection;

        /**
         * Additional Options
         */
        this.options = ops.additionalOptions;

        /**
         * Whether the db is connected to mongodb
         * @type {boolean} connected
         */
        this.connected = false;

        /**
         * Schema
         */
        this.schema = require('./Schema')(ops.schema, ops.collection);

        /**
         * Mongodb Connection
         */
        this.connection;

        this.initDatabase();
    }

    /**
     * Connects to mongodb
     * @returns {Promise<boolean>}
     */
    initDatabase() {
        return new Promise(async (resolve, reject) => {
            Mongoose.connect(this.uri, Object.assign(DefaultMongoOptions, this.options))
                .then((connection) => {
                    this.connected = true;
                    this.connection = connection;

                    return resolve(true);
                })
                .catch((e) => {
                    reject(e);
                })
        })
    }

    /**
     * Writes data
     * @param {object} rdata 
     * @param {string} [rdata.ID] ID
     * @param {number} [rdata.data] Data
     * @returns {Promise<any>}
     */
    write(rdata = {}) {
        return new Promise((resolve, reject) => {
            if(this.connected === false) return reject(new Error('Not connected to mongodb'));
            const { ID, data } = rdata

            if (!ID || typeof ID !== 'string') return reject(new Error('Invalid ID'));

            const document = new this.schema({
                ID,
                data
            });

            document.save()
                .then((v) => resolve(v))
                .catch(() => {
                    this.update(rdata)
                    .then((v) => resolve(v))
                    .catch((r) => reject(r));
                });
        })
    }


    /**
     * Updates data
     * @param {object} rdata 
     * @param {string} [rdata.ID] ID
     * @param {number} [rdata.data] Data
     * @returns {Promise<boolean>}
     */
    update(rdata = {}) {
        return new Promise(async (resolve, reject) => {
            if(this.connected === false) return reject(new Error('Not connected to mongodb'));

            const { ID, data } = rdata

            if (!ID || typeof ID !== 'string') return reject(new Error('Invalid ID'));

            this.schema.findOneAndUpdate({ ID }, { data })
                .then(() => resolve(true))
                .catch((e) => resolve(e))
        })
    }

    /**
     * Deletes a user
     * @param {string} user 
     * @returns {Promise<boolean>}
     */

    delete(user) {
        return new Promise(async (resolve, reject) => {
            if (!user || typeof user !== 'string') return reject(new Error('Invalid ID'));

            this.schema.findOneAndDelete({ ID: user })
                .then(() => resolve(true))
                .catch((e) => reject(e));
        })
    }

    /**
     * Reads data
     * @param {string} id 
     * @returns {Promise<any>}
     */
    read(id) {
        return new Promise((resolve, reject) => {
            if(this.connected === false) return reject(new Error('Not connected to mongodb'));

            if (!id || typeof id !== 'string') return reject(new Error('Invalid ID'));

            this.schema.where({ ID: id }).findOne((err, res) => {
                if (err) return reject(err);

                resolve(res);
            })
        })
    }

    /**
     * Returns all data
     * @returns {Promise<any>}
     */
    readAll() {
        return new Promise((resolve, reject) => {
            if(this.connected === false) return reject(new Error('Not connected to mongodb'));

            this.schema.find({}, (err, result) => {
                if (err) return reject(err);
                return resolve(result);
            })
        })
    }

    /**
     * Deletes all data
     * @returns {Promise<any>}
     */
    deleteAll() {
        return new Promise((resolve, reject) => {
            if(this.connected === false) return reject(new Error('Not connected to mongodb'));
            
            this.schema.remove({} , (err, result) => {
                if(err) return reject(err);
                return resolve(result);
            })
        })
    } 
};

module.exports = MongoManager

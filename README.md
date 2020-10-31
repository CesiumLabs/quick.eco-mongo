# Quick.eco Mongo Manager
Mongo Manager for Quick.eco

![Quick.Eco](https://nodei.co/npm/quickeco.png)

# Quick Example
```js
const { EconomyManager } = require('quick.eco');
const { Client } = require('discord.js');
const client = new Client();
const eco = new EconomyManager({
    adapter: 'mongo'
    adapterOptions: {
        collection: 'money', // => Collection Name
        uri: 'mongodb://localhost/quickeco' // => Mongodb uri
    }
});

client.on('ready', () => console.log('connected'));

client.on('message', (message) => {
    if(message.author.bot) return;
    if(!message.guild) return;

    if(message.content === '!bal') {
        let money = eco.fetchMoney(message.author.id);
        return message.channel.send(`${message.author} has ${money} coins.`);
    }
})

```

# Adapter Options
- Collection - Mongodb collection name
- uri - Mongodb URI
- additionalOptions - Additional Options to pass into mongoose

# Links
- **[Discord Support Server](https://discord.gg/2SUybzb)**
- **[Quick.eco](https://npmjs.com/package/quick.eco)**
- **[Mongoose](https://npmjs.com/package/mongoose)**

© Snowflake Studio ❄️ - 2020
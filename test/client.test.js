const Guilded = require('../src/index.js');
let client = new Guilded.Client("some token");

let message = new Guilded.Message({
    "id": "H6G4Q",
    "createdBy": "y7Fqn",
    "content": "Hey, this is a cool message!",
    "channelId": "H7vG4",
    "serverId": "K8zv6",
    "mentions":{
        "users":[
            {
                "id":"y7Fqn",
            }
        ],
        "roles":[
            {
                "id":"H7vG4",
            }
        ]
    },
    "createdAt": "2020-10-10T20:20:20.000Z"
}, client);

test('Check if message is defined', () => {
    expect(message).toBeDefined();
});

test('Check if message is an instance of Message', () => {
    expect(message).toBeInstanceOf(Guilded.Message);
});
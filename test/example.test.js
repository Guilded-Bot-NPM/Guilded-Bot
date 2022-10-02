const Guilded = require('../src/index.js');
let client = new Guilded.Client("some token");

test('Check if client is defined', () => {
    expect(client).toBeDefined();
});

test('Check if client is an instance of Client', () => {
    expect(client).toBeInstanceOf(Guilded.Client);
});
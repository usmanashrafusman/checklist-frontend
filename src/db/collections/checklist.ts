const schema = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 100
        },
        name: {
            type: 'string'
        },
        timestamp: {
            type: 'number',
        }
    },
    required: ['name']
}

export default schema;
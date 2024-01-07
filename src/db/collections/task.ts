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
        checklist: {
            ref: 'checklist',
            type: 'string'
        },
        createdAt: {
            type: 'number',
        }
    },
    required: ['id', 'name', 'timestamp', "checklist"]
}

export default schema;
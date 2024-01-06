export default {
    name: 'pin',
    title: 'Pin',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string'
        },
        {
            name: 'about',
            title: 'About',
            type: 'string'
        },
        {
            name: 'category',
            title: 'Category',
            type: 'string'
        },
        {
            name: 'src',
            title: 'Source URL',
            type: 'url'
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true
            }
        },
        {
            name: 'userId',
            title: 'UserID',
            type: 'string'
        },
        {
            name: 'postedBy',
            title: 'Posted By',
            type: 'postedBy' //indicating ref to other doc
        },
        {
            name: 'save',
            title: 'Save',
            type: 'array',
            of: [{ type: 'save' }] //save will be a new schema
        },
        {
            name: 'comments',
            title: 'Comments',
            type: 'array',
            of: [{ type: 'comment'} ]
        },
    ]
}
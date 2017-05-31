var models = function(db) {
    let user = db.define("user", {
        id: Number,
        name: String,
        password: String,
        admin: Number,
        head_image: String
    }),
    knows = db.define("knowledge", {
        id: Number,
        isOnline: Number,
        user_id: Number,
        create_time: Date,
        title: String,
        read_counts: Number,
        comment_counts: Number,
        collect_counts: Number,
        content: Buffer,
        abstract: String,
        classify: Number,
        classifys: String
    }),
    collect = db.define("collect", {
        id: Number,
        user_id: Number,
        know_id: Number
    }),
    comment = db.define("comment", {
        id: Number,
        content: String,
        user_id: Number,
        parent_id: Number,
        know_id: Number,
        create_time: Date
    }),
    course = db.define("course", {
        id: Number,
        title: String,
        type: Number,
        abstract: String,
        cover: String,
        files: String,
        hours: Number,
        isOnline: Number,
        teacher: String,
        dateTime: String
    })
    return {
        user: user,
        knows: knows,
        collect: collect,
        comment: comment,
        course: course
    }
}

module.exports = models;

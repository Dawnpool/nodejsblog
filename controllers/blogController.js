const Blog = require('../models/blog');
// blog_index, blog_details, blog_create_get, blog_create_post, blog_delete

const blog_index = (req, res) => {
    Blog.Blog.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('blogs/index', { title: 'All Blogs', blogs: result })
        })
        .catch((err) => {
            console.log(err);
        })
};

const blog_details = (req, res) => {
    const id = req.params.id;
    Blog.Blog.findById(id).populate('comments').exec((err, data) => {
        res.render('blogs/details', { blog: data, title: 'Blog Details' })
    });
    // Blog.Blog.findById(id)
    //     .then(result => {
    //         res.render('blogs/details', { blog: result, title: 'Blog Details' })
    //     })
    //     .catch(err => {
    //         res.status(404).render('404', { title: 'Blog not found' });
    //     });
};

const blog_create_get = (req, res) => {
    res.render('blogs/create', { title: 'Create' });
};

const blog_create_post = (req, res) => {
    const blog = new Blog.Blog(req.body);
    blog.save()
        .then((result) => {
            res.redirect('/blogs');
        })
        .catch((err) => {
            console.log(err);
        });
};

const blog_delete = (req, res) => {
    const id = req.params.id;
    Blog.Blog.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/' });
        })
        .catch(err => {
            console.log(err);
        });
};

const comment_post = (req, res) => {
    const id = req.params.id;
    const comment = new Blog.Comment(req.body);
    comment.save()
        .then(result => {
            Blog.Blog.findByIdAndUpdate(
                id,
                { "$push": { "comments": comment }},
                function(err, model) {
                    console.log(err);
                }
            );
        })
        .catch(err => {
            console.log(err);
        });
    res.redirect('/');
}

module.exports = {
    blog_index,
    blog_details,
    blog_create_get,
    blog_create_post,
    blog_delete,
    comment_post
}
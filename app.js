const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

const app = express();
const dbURI = 'mongodb+srv://<USERNAME>:<PASSWORD>@clustthew.k8ww3yj.mongodb.net/<DB_NAME>>?retryWrites=true&w=majority';
app.set('view engine', 'ejs');
app.set('views', 'ejs-views');


mongoose.connect(dbURI)
.then((result) => app.listen(3000, 'localhost', () => {
    console.log('Server is listening on port 3000...');
}))
.catch((err) => console.log(err));


app.use(express.static('public'));
app.use(express.urlencoded());
app.use(morgan('tiny'));

app.get('/', (req, res) => {
    res.redirect('all-blogs');
});


app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

app.get('/about-me', (req, res) => {
    res.redirect('/about');
});

app.get('/all-blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1})
    .then((results) => {
        res.render('index', { title: 'All blogs', blogs: results})
    })
    .catch((err) => {
        console.log(err);
    });
});

app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create blog'});
})


app.post('/blogs', (req, res) => {
    const createdBlog = new Blog(req.body);
    createdBlog.save()
    .then(result => {
        res.redirect('/all-blogs');
    })
    .catch(err => {
        console.log(err);
    });
});

app.use((req, res) => {
    res.status(404).render('404', { title: '404' }); 
});
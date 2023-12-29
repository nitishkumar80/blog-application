const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Blog = require("./models/blog");
mongoose.connect("mongodb://localhost:27017/blogapp").then(() => {
    console.log('database connected');
}).catch((err) => {
    console.log(err);
})
app.get("/", (req, res) => {
    res.redirect("/add-blog")
})
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.urlencoded({ extended: true }));
const port = 3000;
app.get("/show-blogs",async (req, res) => {
    const allBlogs = await Blog.find({});
    console.log(allBlogs)
    res.render('Show_blogs',{allBlogs})
})
app.get('/add-blog', (req, res) => {
    res.render("add_item");
})
app.post('/add-blog', async(req, res) => {
    console.log(req.body);
    const { fname, lname, email, title, image1,image2,image3,image4, content } = req.body;

    const isdatastored=await Blog.create({ name: fname + " " + lname, email: email, photo: [image1,image2,image3,image4], text: content, title: title });
    if (!isdatastored) {
        console.log('Err');
    }
    console.log('Data stored Success');
    res.redirect("/show-blogs")
})
app.get("/read-blog/:id",async(req, res) => {
    const { id } = req.params;
    const item = await Blog.findById(id);
    console.log(item);
    res.render('read_blogs',{item})
})
app.post("/delete-blog/:id",async (req, res) => {
    const { id } = req.params;
    const deleteitem=await Blog.findByIdAndDelete(id);
    if (!deleteitem) {
        console.log('Item not deleted');
    }
    console.log('Item deleted');
    res.redirect("/show-blogs")
})

// Render edit blog form
// Assuming you've already initialized Express, Mongoose, and other configurations

// Render edit blog form
app.get('/edit-blog/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const blog = await Blog.findById(id);
      if (!blog) {
        return res.status(404).send('Blog not found');
      }
      res.render('edit_blog', { blog });
    } catch (err) {
      console.error('Error rendering edit form:', err);
      res.status(500).send('Server Error');
    }
  });
  
  // Update blog post
  app.post("/edit-blog/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { fname, lname, email, title, image1, image2, image3, image4, content } = req.body;
  
      const updatedBlog = await Blog.findByIdAndUpdate(id, {
        name: `${fname} ${lname}`,
        email,
        photo: [image1, image2, image3, image4],
        text: content,
        title
      }, { new: true });
  
      if (!updatedBlog) {
        return res.status(404).send('Blog not found');
      }
  
      console.log('Blog updated:', updatedBlog);
      res.redirect(`/read-blog/${id}`);
    } catch (err) {
      console.error('Error updating blog:', err);
      res.status(500).send('Server Error');
    }
  });
  



app.listen(port, () => { console.log('Server is running at port 3000') });
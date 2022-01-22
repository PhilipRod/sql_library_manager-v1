var express = require('express');
var router = express.Router();
const Book = require("../models/").Book;


/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (error) {
      res.status(500).send(error);
      next(error);
    }
  }
}

/* GET home page. */
router.get('/',asyncHandler( (req, res, next)=> {
  res.redirect('/books')
}));

// full list of books
router.get('/books',asyncHandler(async(req,res)=>{
  const books = await Book.findAll()
  res.render('index', {
    books
  })
}))  

// create new books form
router.get('/books/new',asyncHandler((req,res)=>{
  res.render('new-books')
}))

// post new book
router.post('/books/new',asyncHandler(async(req,res)=>{
  
  let book;
  try{
    const book = await Book.create(req.body)
    res.redirect("/books/")
  }
  catch(error){
    if (error.name === "SequelizeValidationError"){
      const book = await Book.build(req.body)
      res.render('new-books',{
        book,
        errors:error.errors,
        "title" : "New Book"
      })
    
    }
    else{
      throw error;
    }
  }
 
}))

// book detail form
router.get('/books/:id',asyncHandler(async(req,res,next)=>{
  const book = await Book.findByPk(req.params.id)
  
  if(book){
    res.render('update-book',{
      title: book.title,
      book
      
    })
  }else{
    const error = new Error("Sorry the Page cant be found")
    error.status = 404
    next(error)
    
  }
}))

// update book info
router.post('/books/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);

  try {
    await book.update(req.body);
    res.redirect('/');
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const book = await Book.build(req.body);
      book.id = req.params.id; // make sure correct article gets updated
      res.render("update-book", {
        title: 'Update Book',
        book,
        errors: error.errors
      });
      next(error);
    } else {
      throw error;
    }
  }
}));

// delete book info
router.post('/books/:id/delete',asyncHandler(async(req,res)=>{
  const book = await Book.findByPk(req.params.id)
  await book.destroy()
  res.redirect('/')

}))



module.exports = router;

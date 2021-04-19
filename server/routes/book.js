const express = require('express')
const router = express.Router()
const Book = require('../models/book')

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, topic } = req.query;
    let books = await Book.find(topic ? {topic} : {})
    const count = books.length
    books = await Book.find(topic ? {topic} : {})
              .limit(limit * 1)
              .skip((page - 1) * limit)
              .exec();


    // return response with posts, total pages, and current page
    res.json({
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err)
    return res.status(500).send('SERVER ERROR')
  }
})

module.exports = router
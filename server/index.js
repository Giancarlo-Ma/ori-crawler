const express = require('express');
const { fork } = require('child_process')
const path = require('path')
const connectDB = require('./config/db')
const mongoose = require('mongoose')
require('./models/book')
const crawlerPath = path.join(__dirname, 'task', 'crawler')
  ; (async () => {
    await connectDB()
    const crawlerWorker = fork(crawlerPath)
    let data;
    crawlerWorker.on('message', async msg => {
      console.log(msg.data)
      data = msg.data
      const Book = mongoose.model('book')
      data.forEach(async item => {
        let book = await Book.findOne({
          title: item.title
        })
        console.log(book)
        if (!book) {
          book = new Book(item)
          await book.save()
        }
      })
    })

    const app = express();

    app.use(express.json())
    // Define Routes
    app.use('/api/books', require('./routes/book'));

    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => console.log('server started'));
  })()

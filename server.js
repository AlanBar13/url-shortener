const express = require('express')
const dotenv = require('dotenv').config()
const cron = require('node-cron')

const UrlRoutes = require('./api/routes/urls.router')
const RedirectRoute = require('./api/routes/redirect.router')

const deleteUrls = require('./utils/deleteUrls')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())

app.get('/', (req, res) => {
    res.send({"message": "URL Shortener Service By Alan Bardales"})
})

app.use("/", RedirectRoute)
app.use("/api", UrlRoutes)

cron.schedule('*/5 * * * *', async function(){
    await deleteUrls()
})

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})
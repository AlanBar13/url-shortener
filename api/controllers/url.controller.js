const asyncHandler = require('express-async-handler')
const shortid = require('shortid')
const validUrl = require('valid-url')
const {db, admin} = require('../../config/db')

const baseUrl = process.env.BASE_URL

const shorten = asyncHandler(async (req, res) => {
    const { longUrl } = req.body
    const urlsRef = db.collection('urls')
    if (!validUrl.isUri(longUrl)) {
        console.log(`[ShortenUrl] Invalid url: ${longUrl}`)
        res.status(401)
        throw new Error('Invalid base URL')
    }

    const urlCode = shortid.generate()

    if (validUrl.isUri(longUrl)) {
        let url = await urlsRef.where('urlCode', '==', urlCode).get()

        if (!url.empty) {
            const snapshot = url.docs[0]
            const data = snapshot.data()
            return res.json(data)
        } else {
            const shortUrl = baseUrl + '/' + urlCode
            var date = new Date()
            var expires = date.setDate(date.getDate() + 7)
            const response = await urlsRef.add({
                urlCode,
                longUrl,
                shortUrl,
                postedDate: admin.firestore.Timestamp.fromDate(new Date()),
                expiresDate: admin.firestore.Timestamp.fromDate(new Date(expires))
            })
            return res.json({
                newUrl: shortUrl,
                expires: new Date(expires),
                db_id: response.id
            })
        }
    }
})

const customUrl = asyncHandler(async (req, res) => {
    const { longUrl, customUrl } = req.body
    const urlsRef = db.collection('urls')

    if (!validUrl.isUri(longUrl)) {
        console.log(`[ShortenUrl] Invalid url: ${longUrl}`)
        res.status(401)
        throw new Error('Invalid base URL')
    }

    if(validUrl.isUri(longUrl)){
        let doc = await urlsRef.where('urlCode', '==', customUrl).get()

        if(!doc.empty){
            const snapshot = doc.docs[0]
            const data = snapshot.data()
            return res.json({message: "Short URL already exist", data: data})
        }else{
            const shortUrl = baseUrl + '/' + customUrl
            var date = new Date()
            var expires = date.setDate(date.getDate() + 7)
            const response = await urlsRef.add({
                urlCode: customUrl,
                longUrl,
                shortUrl,
                postedDate: admin.firestore.Timestamp.fromDate(new Date()),
                expiresDate: admin.firestore.Timestamp.fromDate(new Date(expires))
            })

            return res.json({
                newUrl: shortUrl,
                expires: new Date(expires),
                db_id: response.id
            })
        }
    }
    
})

module.exports = {shorten, customUrl}
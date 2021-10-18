const asyncHandler = require('express-async-handler')
const {db} = require('../../config/db')

const redirect = asyncHandler(async (req, res) => {
    const urlRef = db.collection('urls')
    const url = await urlRef.where('urlCode', '==', req.params.code).get()

    if(!url.empty){
        const snapshot = url.docs[0]
        const data = snapshot.data()
        console.log(data)
        return res.redirect(data.longUrl)
    }else {
        res.status(404)
        throw new Error('Url not found')
    }
})

module.exports = redirect
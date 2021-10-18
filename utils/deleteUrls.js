const {db, admin} = require('../config/db')

const deleteUrls = async () => {
    const urlRefs = db.collection('urls')
    var date = admin.firestore.Timestamp.fromDate(new Date()) 
    console.log(`[DeleteUrls] START ${date}`)
    const snapshot = await urlRefs.where('expiresDate', "<", date).get()

    if(snapshot.empty){
        console.log('[DeleteUrls] No documents')
        return
    }
    
    snapshot.forEach(doc => {
       doc.ref.delete()
       console.log(`Deleted ${doc.id}`)
       //console.log(`${doc.id} => ${doc.data()}`)
    })
}

module.exports = deleteUrls
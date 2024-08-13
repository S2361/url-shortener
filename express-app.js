const express = require('express')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid');
const referenceTable = require('./referenceTable');
const URL = require('./urlModel')

module.exports = async (app) => {

    // middlewares
    app.use(express.json({ limit: '1mb'}));
    app.use(express.urlencoded({ extended: true, limit: '1mb'}));
    app.use(cors({origin: "*"}));
    app.use(express.static(__dirname + '/public'));

    // APIs

    // Given short URL, retrieving long URL associated with it
    app.get('/healable/:hashValue', async (req, res) => {
        const shortUrl = 'http://localhost:8000/healable/' + req.params.hashValue;
        
        try {
            // Find the original URL in the database
            const urlDoc = await URL.findOne({ shortUrl });
            if (urlDoc) {
                res.redirect(urlDoc.longUrl)
            } else {
                res.status(404).json({ success: false, message: 'URL not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    });

    // Generating short URL based on provided long URL
    app.post('/healable/postURL', async (req, res) => {
        const ogUrl = req.body.url

        try {
            let urlDoc = await URL.findOne({ longUrl: ogUrl })

            //if longURL is not already in database
            if (!urlDoc) {
                const uuid = uuidv4()       // generating unique ID
                let numericID = 1


                for (let i = 0; i < uuid.length; i++) {
                    let ch = uuid[i];
                    let val = ch.charCodeAt(0);
                    if (val >= 48 && val <= 57) {
                        numericID += (val - 48);
                    } else if (val >= 65 && val <= 90) {
                        numericID += (val - 65 + 11);
                    } else if (val >= 97 && val <= 122) {
                        numericID += (val - 97 + 73);
                    }
                }

                const salt = Math.ceil(Math.random() * 100) * 23 * 7;
                numericID = numericID * salt;

                let genHashVal = '';
                let dummyId = numericID;

                while (dummyId > 0) {
                    const rem = dummyId % 62;
                    genHashVal += referenceTable[rem];
                    dummyId = Math.floor(dummyId / 62);
                }

                const shortUrl = 'http://localhost:8000/healable/' + genHashVal

                urlDoc = new URL({
                    longUrl: ogUrl,
                    shortUrl
                })

                await urlDoc.save()

                res.status(200).json({
                    message: 'Inserted the new URL',
                    shortUrl,
                    longUrl: ogUrl
                })

            } else {
                res.status(200).json({
                    message: 'URL already shortified!',
                    shortUrl: urlDoc.shortUrl,
                    longUrl: ogUrl
                })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: 'Server error' })
        }
    })

}


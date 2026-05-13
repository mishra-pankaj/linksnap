const {nanoid} = require("nanoid")
const geoip = require("geoip-lite")
const urlModel = require("../models/url.model")

async function shortenUrl(req,res){
    try{
        const {url} = req.body;
        if(!url){
            return res.status(400).json({
                error : "Url is required!!",
                code: "Missing Url !"
            })
        }

        //url-startwith -(add https)
        let normalizedUrl = url.trim();

        if(!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")){
            normalizedUrl = "https://" + normalizedUrl;
        }
        //validate
        try{
            new URL(normalizedUrl)
        }catch(err){
            return res.status(400).json({
                error:"Invalid url fromat",
                code: "INVALIDE URL-FORMAT"
            })
        }

        //user - check
        const userId = req.user ? req.user.id : null;
        //geneate nanoid
        const shortId = nanoid(8)
        //expire - Register user - 7 days else guest 1 day
        const expireAtDate = new Date();
        if(userId){
            //register user - part 
            expireAtDate.setDate(expireAtDate.getDate() +7);
        }else{
            //guest - part 
            expireAtDate.setDate(expireAtDate.getDate() + 1)
        }

        const urlDoc = await urlModel.create({
            shortId,
            redirectURL: normalizedUrl,
            user: userId,
            expiresAt : expireAtDate,
            visitHistory: []
        })

        return res.status(201).json({
            sucess: true,
            shortUrl: `https://linksnap.io${shortId}`,
            shortId,
            orginalUrl: normalizedUrl,
            expiresAt: expireAtDate,
            isRegistered: userId ? true: false,
            message: userId
                ? 'Short link created. You can view analytics.' 
                : 'Short link created. (Sign up to view analytics.)'
        })
    }catch(err){
        console.error('Error in shortenUrl:', error);
    } 
    
    return res.status(500).json({
        error: 'Failed to create short link',
        code: 'SERVER_ERROR'
    })
       

}


module.exports = {shortenUrl}
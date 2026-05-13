const {nanoid} = require("nanoid")
const geoip = require("geoip-lite")
const urlModel = require("../models/url.model")
const getGeoData = require("../utils/geoData")
const clickModel = require("../models/click.model")
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
            shortUrl: `https://linksnap.io/${shortId}`,
            shortId,
            originalUrl: normalizedUrl,
            expiresAt: expireAtDate,
            isRegistered: userId ? true: false,
            message: userId
                ? 'Short link created. You can view analytics.' 
                : 'Short link created. (Sign up to view analytics.)'
        })
    }catch(error){
        console.error('Error in shortenUrl:', error);
    } 
    
    return res.status(500).json({
        error: 'Failed to create short link',
        code: 'SERVER_ERROR'
    })
       

}

async function redirectURL(req,res){
    try{
        const {shortId} = req.params;

        if (!shortId) {
            return res.status(400).json({
                error: 'Short ID is required',
                code: 'MISSING_SHORT_ID'
             });
         }

        const url = await urlModel.findOne({
            shortId
        })
        if(!url){
            return res.status(404).json({
                message:"Short link not found",
                code: "SHORT LINK MISSING"
            })
        }

        //extract visitor information

        const ipAddress =
            req.headers["x-forwarded-for"] ?.split(",")[0] ||
            req.socket.remoteAddress ||
            req.ip||
            "unknown";
        
        const referrer =
            req.get("referrer") || "direct"
        
        const userAgent =
            req.get("user-agent") || "unknown"

        const geoData = geoip.lookup(ipAddress)

        clickModel.create({
            shortId: shortId,
            user: url.user,
            ipAddress: ipAddress,
            referrer: referrer,
            userAgent: userAgent,
            country: geoData?.country || "unknown",
            region: geoData?.region || "unknown",
            city: geoData?.city || "unknown",
            timezone: geoData?.timezone || "unknown"
        }).catch((err)=>{
        console.log("click saved failed", err.message);
        })

        return res.redirect(302, url.redirectURL)
    }catch(error){
        console.error('Error in redirectUrl:', error);

        return res.status(500).json({
            error:"Internal Server error",
            code: "Redirect error"
        })
    }   
}

module.exports = {shortenUrl,redirectURL}
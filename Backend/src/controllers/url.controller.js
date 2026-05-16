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
            shortUrl: `http://localhost:8000/api/url/${shortId}`,
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

async function getAnalytics(req, res){
    
    try{
        const {shortId} = req.params

        if(!shortId){
            return res.status(400).json({
                error: "Short Id is required",
                code: "Missing Short id "
            })
        }
        const url = await urlModel.findOne({shortId})

        if(!url){
            return res.status(404).json({
                error:"Short link not found ",
                code:" SHORT_LINK_NOT_FOUND"
            })
        }

        if (!url.user || url.user.toString() !== req.user.id) {
            return res.status(403).json({
                error : "You do not have permission to view analystic for the link",
                code: "FORBIDDEN"
            })
        }
        //total-click
        const totalClickResult = await clickModel.countDocuments({ shortId});

        const totalClick = totalClickResult || 0;
        //last 24 hr
        const now = new Date()
        const twentyFourhourAgo = new Date(now.getTime() -24 * 60* 60 * 1000);

        const click24hResult = await clickModel.aggregate([
        {
            $match:{
                shortId: shortId,
                timestamp: {$gte: twentyFourhourAgo}
            }
        },
        {$count: 'count'}   
        ]);
        const click24h = click24hResult[0]?.count || 0;
        
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
 
        const clicks7dResult = await clickModel.aggregate([
            {
                $match: {
                shortId: shortId,
                timestamp: { $gte: sevenDaysAgo }
                }
            },
            { $count: 'count' }
        ]);
        const clicks7d = clicks7dResult[0]?.count || 0;

        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const clicks30dResult = await clickModel.aggregate([
            {
                $match: {
                shortId: shortId,
                timestamp: { $gte: thirtyDaysAgo }
                }
            },
            { $count: 'count' }
        ]);
        const clicks30d = clicks30dResult[0]?.count || 0;

        //reference - 
        const topReferrers = await clickModel.aggregate([
           {$match:{shortId}},
           {
            $group:{
                _id : '$referrer',
                count: { $sum: 1}
            }
           },
           {$sort: {count: -1}},
           {$limit: 5},
           {
            $project: {
                referrer: '$_id',
                count: 1,
                _id: 0
            }
           }
        ])

        //top-5 countries 
        const topCountries = await clickModel.aggregate([
            { $match: {shortId}},
            {
                $group: {
                    _id: '$country',
                    count: {$sum: 1}
                }
            },
            {$sort : {count: -1}},
            {$limit: 5},
            {
                $project: {
                    country : '$_id',
                    count: 1,
                    _id:0,
                }
            }
        ]);
        //timeseries- click per day 
        const timeseries = await clickModel.aggregate([
            { $match: { shortId } },
            {
             $group: {
                _id: {
                    $dateToString: {
                     format: '%Y-%m-%d',
                     date: '$timestamp'
                    }
                },
             clicks: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } },
        {
         $project: {
          date: '$_id',
          clicks: 1,
          _id: 0
        }
      }
    ]);

    //return analystic-
    return res.status(200).json({
        success: true,
        shortId: shortId,
        totalClick: totalClick,
        click_24h: click24h,
        click_7d: clicks7d,
        clicks_30d: clicks30d,
        topReferrers: topReferrers,
        topCountries: topCountries,
        timeseries: timeseries,
        message: 'Analytics retrieved successfully'
    });
    }catch(err){
        console.error("error in getAnalystic:",err);
    }

    return res.status(500).json({
        error: "Failed to retrive Analystics",
        code: "server_ error"
    })
}
// In your auth controller or url controller
async function getUserLinks(req, res) {
    
  try {
    if(!req.user || !req.user.id){
        return res.status(401).json({
            error : "Unauthorized"
        })
    }
    const userId = req.user.id
    
    // Find all URLs where user = userId
    const links = await urlModel.find({ user: userId })
      .select('shortId redirectURL createdAt')
      .lean()
    
    // Get click counts for each link
    const linksWithClicks = await Promise.all(
      links.map(async (link) => {
        const clicks = await clickModel.countDocuments({ shortId: link.shortId })
        return {
          shortId: link.shortId,
          redirectURL: link.redirectURL,
          createdAt: link.createdAt,
          totalClicks: clicks
        }
      })
    )
    
    return res.json({ links: linksWithClicks })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch links' })
  }
}

module.exports = {shortenUrl,redirectURL,getAnalytics,getUserLinks}
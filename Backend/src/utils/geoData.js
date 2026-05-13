const geoip = require("geoip-lite")

async function getGeoData(ipAddress){
    const geoData = geoip.lookup(ipAddress)

    return {
        country: geoData?.country || "unknown",
        region: geoData?.region || "unknown",
        city: geoData?.city || "unknown",
        timezone: geoData?.timezone || "unknown"
    }
}

module.exports = getGeoData
const apikey = process.env.RIOT_LOL_API_KEY;

const { Kayn, REGIONS } = require('kayn')
const kayn = Kayn(apikey)({
    region: REGIONS.NORTH_AMERICA,
    apiURLPrefix: 'https://%s.api.riotgames.com',
    locale: 'en_US',
    debugOptions: {
        isEnabled: true,
        showKey: false,
    },
    requestOptions: {
        shouldRetry: true,
        numberOfRetriesBeforeAbort: 3,
        delayBeforeRetry: 1000,
        burst: false,
        shouldExitOn403: false,
    },
    cacheOptions: {
        cache: null,
        timeToLives: {
            useDefault: false,
            byGroup: {},
            byMethod: {},
        },
    },
})

exports.getLandingPage = function(req, res, next) {
    res.render('index');
    
}

exports.findSummoner = function(req, res, next) {
    const summonername = req.body.summonername
    kayn.Summoner.by.name(summonername).callback(function(err, summoner){
        if(err){
            console.log(err.error.message)
        }
        res.redirect("/match/"+summoner.id)
    })
        /*
        const currentGame = await kayn.CurrentGame.by.summonerID(summoner.id)
        if(currentGame){
            console.log(currentGame)
        } 
        */
    
}
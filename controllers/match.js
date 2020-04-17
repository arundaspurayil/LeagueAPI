const apikey = process.env.RIOT_LOL_API_KEY;
const fetch = require('node-fetch')

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

exports.getCurrentGame = function(req, res, next) {
    kayn.CurrentGame.by.summonerID(req.params.summonerID).callback(async function(err, match){
        if(err){
            if(err.error.name == 'StatusCodeError'){
                return res.render('index', {errors: {msg: 'User is not in a live game.'}})
            }
        }
        await getChampionInfo(match)

        res.render('match',{match: match})
    })   
}

/*
async function getChampionInfo(match){
    console.time("End get champion list")
    let list = await kayn.DDragon.Champion.list()
    console.timeEnd("End get champion list")
    const championList = list.data

    for(var x in match.participants){
        for(var i in championList){
            if(championList[i].key == match.participants[x].championId){
                console.time("End Get champion")
                const championInfo = await kayn.DDragon.Champion.getDataById(championList[i].id)
                console.timeEnd("End Get champion")
                let champ = Object.keys(championInfo.data)[0]
                match.participants[x].championInfo= championInfo.data[champ]
            }
        }
    }


}
*/
async function getChampionInfo(match){
    const version = (await fetch("http://ddragon.leagueoflegends.com/api/versions.json").then(async(r) => await r.json()))[0];

    for(var x in match.participants){
        match.participants[x].championInfo = await getChampionByKey(match.participants[x].championId, version)
    }


}

let championByIdCache = {};
let championJson = {};

async function getLatestChampionDDragon(version) {

	if (championJson[version])
        return championJson[version];
    
    const championList = await fetch('http://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions.json')
	
    championJson[version] = await championList.json();
	return championJson[version];
}

async function getChampionByKey(key, version) {

	// Setup cache
	if (!championByIdCache[version]) {

        let json = await getLatestChampionDDragon(version);

		championByIdCache[version] = {};
		for (var championName in json) {

			if (!json.hasOwnProperty(championName))
                continue;
                
            const champInfo = json[championName];
			championByIdCache[version][champInfo.id] = champInfo;
		}
	}


	return championByIdCache[version][key];
}

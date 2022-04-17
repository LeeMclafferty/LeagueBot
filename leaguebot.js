//Need a way for the bot to restart if it crashed

const Discord = require('discord.js');
require('dotenv').config('B:\Projects\DiscordBots\LeagueBot\.env');
const fetch = require('node-fetch');

const lolkey = process.env.LOLKEY;
const bottoken = process.env.BOTTOKEN;


const RiotRequest = require('riot-lol-api');
const riotRequest = new RiotRequest(lolkey);

const client = new Discord.Client( {
            intents: [
            Discord.Intents.FLAGS.GUILD_MESSAGES,
            Discord.Intents.FLAGS.GUILDS,
            Discord.Intents.FLAGS.GUILD_MEMBERS,
            Discord.Intents.FLAGS.GUILD_PRESENCES
        ]
    }
);

client.login(bottoken);
client.on('ready', botRdy);
function debug(debugmsg){
    console.log(debugmsg);
}

function botRdy(){
    console.log('Fired up and ready to serve!');
}

client.on('messageCreate', getMessage);

//Looking for bot commands in server. 
async function getMessage(msg){

    let inputText = msg.content.split(' ');
    let name = 'NULL';

     // ! sumoner command
    if(inputText[0] == '!summoner' || inputText[0] == '!Summoner'){

        if(inputText[1] != null){
            name = inputText.slice(1, inputText.length).join('%20');
            const summonerName = await getSummonerNameInfo(name, 'name');
            const sumLvl = await getSummonerNameInfo(name, 'sumLvl');
            const sumId = await getSummonerNameInfo(name, 'id');
            //debug(sumLvl);
            msg.channel.send('Summoner Name:    ' + summonerName + '\n');
            msg.channel.send('Summoner level:   ' + sumLvl + '\n');
        }
    } 
    
    // !rank command
    if(inputText[0] == '!rank' || inputText[0] == '!Rank'){
        if(inputText[1] != null){

            name = inputText.slice(1, inputText.length).join('%20');
            const id = await getSummonerNameInfo(name, 'id');
            const rank = await getRankedInfo(id, 'rank');
            
            msg.channel.send(rank);
        }
    }

    if(inputText[0] == '!match' || inputText[0] == '!Match'){
        if(inputText[1] != null){

            name = inputText.slice(1, inputText.length).join('%20');
            const id = await getSummonerNameInfo(name, 'puuid');
            //debug(id);
            const matchId = await getMatchId(id, 1);
            const matchInfo = await getMatchInfoById(matchId, id);
            msg.channel.send(displayMatchBasics(matchInfo, matchId));
            msg.channel.send(displayMatchDamage(matchInfo));
            msg.channel.send(displayMatchTank(matchInfo));
            msg.channel.send(displayMatchSupport(matchInfo));
            msg.channel.send(displayMatchVision(matchInfo));
            msg.channel.send(displayMatchCreepScore(matchInfo));
            msg.channel.send(displayMatchGold(matchInfo));
        }
    }

    if(inputText[0] == '!basics' || inputText[0] == '!Basics'){
        if(inputText[1] != null){

            name = inputText.slice(1, inputText.length).join('%20');
            const id = await getSummonerNameInfo(name, 'puuid');
            //debug(id);
            const matchId = await getMatchId(id, 1);
            const matchInfo = await getMatchInfoById(matchId, id);
            msg.channel.send(displayMatchBasics(matchInfo));
        }
    }

    if(inputText[0] == '!dmg' || inputText[0] == '!Dmg'){
        if(inputText[1] != null){

            name = inputText.slice(1, inputText.length).join('%20');
            const id = await getSummonerNameInfo(name, 'puuid');
            //debug(id);
            const matchId = await getMatchId(id, 1);
            const matchInfo = await getMatchInfoById(matchId, id);
            msg.channel.send(displayMatchDamage(matchInfo));
        }
    }

    if(inputText[0] == '!tank' || inputText[0] == '!Tank'){
        if(inputText[1] != null){

            name = inputText.slice(1, inputText.length).join('%20');
            const id = await getSummonerNameInfo(name, 'puuid');
            //debug(id);
            const matchId = await getMatchId(id, 1);
            const matchInfo = await getMatchInfoById(matchId, id);
            msg.channel.send(displayMatchTank(matchInfo));
        }
    }

    if(inputText[0] == '!heal' || inputText[0] == '!Heal'){
        if(inputText[1] != null){

            name = inputText.slice(1, inputText.length).join('%20');
            const id = await getSummonerNameInfo(name, 'puuid');
            //debug(id);
            const matchId = await getMatchId(id, 1);
            const matchInfo = await getMatchInfoById(matchId, id);
            msg.channel.send(displayMatchSupport(matchInfo));
        }
    }

    if(inputText[0] == '!vision' || inputText[0] == '!Vision'){
        if(inputText[1] != null){

            name = inputText.slice(1, inputText.length).join('%20');
            const id = await getSummonerNameInfo(name, 'puuid');
            //debug(id);
            const matchId = await getMatchId(id, 1);
            const matchInfo = await getMatchInfoById(matchId, id);
            msg.channel.send(displayMatchVision(matchInfo));
        }
    }

    if(inputText[0] == '!cs' || inputText[0] == '!CS'){
        if(inputText[1] != null){

            name = inputText.slice(1, inputText.length).join('%20');
            const id = await getSummonerNameInfo(name, 'puuid');
            //debug(id);
            const matchId = await getMatchId(id, 1);
            const matchInfo = await getMatchInfoById(matchId, id);
            msg.channel.send(displayMatchCreepScore(matchInfo));
        }
    }

    if(inputText[0] == '!gold' || inputText[0] == '!Gold'){
        if(inputText[1] != null){

            name = inputText.slice(1, inputText.length).join('%20');
            const id = await getSummonerNameInfo(name, 'puuid');
            //debug(id);
            const matchId = await getMatchId(id, 1);
            const matchInfo = await getMatchInfoById(matchId, id);
            msg.channel.send(displayMatchGold(matchInfo));
        }
    }
}

//Uses summoner-v4 in api
async function getSummonerNameInfo(summoner, info){

    const summonerName = summoner
    let url = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${lolkey}`;
    let urlResponse = await fetch(url);
    let data = await urlResponse.json();

    if(urlResponse.status == 200){

        //debug(data);
        if(info == 'name') {
            return data.name;
        }
        if(info == 'puuid') {
            return data.puuid;
        }
        if(info == 'accountid') {
            return data.accoundId;
        }
        if(info == 'revdate'){
            return data.revisionDate;
        }
        if(info == 'id'){
            return data.id;
        }
        if(info == 'sumLvl'){
            return data.summonerLevel;
        }
        else{
            debug('Invalid Info argument');
        }
    }
    else{
        debug(urlResponse.status);
    }
}

// Uses League-v4 in api
async function getRankedInfo(sumId, info){

    let output = 'ERROR';
    const id = sumId;
    let soloIndex = 0;
    const url = `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${lolkey}`;
    const urlResponse = await fetch(url);
    const rankedData = await urlResponse.json();
    
    if(urlResponse.status == 200){
        /** Still crashed here if you do !rank with a summoner that is unranked or does not exsit
         * I will have to come back to prevent that. 
         */

        for(let i = 0; i < rankedData.length; i++){

            if(rankedData[i].queueType == 'RANKED_SOLO_5x5'){
                soloIndex = i;
            }
        }

        //debug(rankedData[soloIndex].summonerName);
        

        if(info == 'rank'){

            output = ('```\n' + rankedData[soloIndex].summonerName + '\n' +  
                'Rank:      ' + rankedData[soloIndex].tier + ' ' + rankedData[soloIndex].rank + ' ' +  rankedData[0].leaguePoints + ' LP\n' +
                'Win rate:  ' + (rankedData[soloIndex].wins / (rankedData[soloIndex].wins + rankedData[soloIndex].losses)).toFixed(2) + ' %' +
                 '```'
            );
            return output;
        }
    }
    else{
        debug(urlResponse.status);
    }
}

//Uses Match-v5 by puuid in riot api. This get the players last match ID, but not data about the match.
async function getMatchId(inId, numOfMatches){
    const puuid = inId;
    const match = numOfMatches;
    
    const url = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${numOfMatches}&api_key=${lolkey}`; // Returning 401 (unauthorized)
    const urlResponse = await fetch(url);
    const matchData = await urlResponse.json();
    //debug(matchData[0]);

    return matchData[0];
}

//Uses Match-V5 by match id. This give the actual information based on the match id.
async function getMatchInfoById(matchId, puuid){

    const id = matchId;
    const playerId = puuid;
    let playerIndex = 0;
    const url = `https://americas.api.riotgames.com/lol/match/v5/matches/${id}?api_key=${lolkey}`;
    const urlResponse = await fetch(url);
    const matchData = await urlResponse.json();

    
    for(let j = 0; j < matchData.info.participants.length; j++){

        if(matchData.info.participants[j].puuid == playerId){
                playerIndex = j;
        }
    }
    
    //debug(matchData.info.participants[playerIndex]);

    return matchData.info.participants[playerIndex];

}

//Returns basic game info (name, role, champ, kda)
function displayMatchBasics(matchInfo){

    let output = (
        '```\n' +
        matchInfo.summonerName + '  ' + '(' + (matchInfo.win ? 'Win' : 'Lose') + ')\n\n' +
        '            Role:    ' + matchInfo.individualPosition + '\n' +
        '        Champion:    ' + matchInfo.championName + '\n' +
        '           K/D/A:    ' + matchInfo.kills + ' / ' + matchInfo.deaths + ' / ' + matchInfo.assists +  '  (' + matchInfo.challenges.kda + ')'+ '\n' +
        '```'

    );

    return output;
}


function displayMatchDamage(matchInfo){

    let output = (
        '```\n' +
    '      Damage Dealt:    ' + matchInfo.totalDamageDealtToChampions + '\n' +
    ' % of Damage Dealt:    ' + (matchInfo.challenges.teamDamagePercentage. toFixed(2) * 100) + ' %' + '\n' +
    '       Magic Dealt:    ' + matchInfo.magicDamageDealtToChampions + '\n' +
    '    Physical Dealt:    ' + matchInfo.physicalDamageTaken + '\n' +
        '```\n'
    );

    return output;
}

function displayMatchTank(matchInfo){

    let output = (
        '```\n' +
    '     Damage Taken:    ' + matchInfo.totalDamageTaken + '\n' +
    '% of Damage Taken:    ' + (matchInfo.challenges.damageTakenOnTeamPercentage.toFixed(2) * 100) + ' %' + '\n' +
    '      Magic Taken:    ' + matchInfo.magicDamageTaken + '\n' +
    '   Physical Taken:    ' + matchInfo.physicalDamageTaken + '\n' +
    '```\n'
    );

    return output;
}

function displayMatchSupport(matchInfo){

    let output = (
        '```\n' +
    '    Total Healing:    ' + matchInfo.totalHeal + '\n' +
    '     Self Healing:    ' + (matchInfo.totalHeal - matchInfo.totalHealsOnTeammates) + '\n' +
    '  Healing To Team:    ' + matchInfo.totalHealsOnTeammates + '\n' +
    'Shielding To Team:    ' + matchInfo.totalDamageShieldedOnTeammates + '\n' +
    '```\n'

    );

    return output;
}

function displayMatchVision(matchInfo){
    let output = (
        '```\n' +
    '     Vision Score:    ' + matchInfo.visionScore + '\n' +
    '     Wards Placed:    ' + matchInfo.wardsPlaced + '\n' +
    ' Red Wards Bought:    ' + matchInfo.visionWardsBoughtInGame + '\n' +
    '  Wards Destroyed:    ' + matchInfo.wardsKilled + '\n' +
    '```\n'
    );

    return output;
}

function displayMatchCreepScore(matchInfo){
    let output = (
        '```\n' +
    '        Total CS:    ' + matchInfo.totalMinionsKilled + '\n' +
    '     Lane CS @10:    ' + matchInfo.challenges.laneMinionsFirst10Minutes  + '\n' +
    '   Jungle CS @10:    ' + matchInfo.challenges.jungleCsBefore10Minutes + '\n' +
    //'  CS Per Minute:    ' + (getMatchTimeInSeconds(matchInfo.matchId) / matchInfo.totalMinionsKilled) + '\n' +
    '```\n'
    );

    return output
}

function displayMatchGold(matchInfo){
    let output = (
        '```\n' +
    '     Total Gold:   ' +  matchInfo.goldEarned + '\n' +
    '  Gold / Minute:   ' + matchInfo.challenges.goldPerMinute.toFixed(2) + '\n' +
    'Bountys Claimed:   ' + matchInfo.challenges.bountyGold + '\n' +
    '```\n'
    );

    return output;
}

function displayChampionInfo(profileInfo){
 
    /*profileInfo is going to have to be info about the summoner not 1 match. Have to get the past x number of games for match history
    top 3 most played ranked champions and their win rate and just the top 3 mastery points. (will add a !clash command that 
    implements a calculation of who you should ban)*/
               
    //!champ
   
   // Match History:
   
   // 	Champ1: WR
   // 	Champ2: WR
   // 	Champ3: WR
   
   // Rank Champions:
   
   // 	Champ1: WR
   // 	Champ2: WR
   // 	Champ3: WR
   
   // Champion Mastery:
   
   // 	Champ1: masteryScore
   // 	Champ2: masteryScore
   // 	Champ3: masteryScore  
       
   }

// async function getMatchTimeInSeconds(matchId){

//     const id = matchId;
//     const url = `https://americas.api.riotgames.com/lol/match/v5/matches/${id}?api_key=${lolkey}`; 
//     const urlResponse = await fetch(url);
//     const matchData = await urlResponse.json();

    
//     debug(matchData.info.gameDuration);

//     return matchData.info.gameDuration;
// }

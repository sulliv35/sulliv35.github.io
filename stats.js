var keys = ["RGAPI-78f1532d-2ba2-4386-9c2d-945e1f2ef3d4","RGAPI-9a87f79d-8948-4aba-930f-a934148fdd58","RGAPI-8b72e480-90f1-48e0-af7e-487c503ce01a","RGAPI-a816b935-2fc8-4479-a075-cbd2d8f9d3bd","RGAPI-4fad1d5a-0563-4eec-a648-1eea5a9b23b2","RGAPI-2bc760bf-3775-4cf1-99bb-e5ebb5bd6d0a"]
var region;
var username;
var userID;
var friend;
var wins = 0;
var loses = 0;
var numMatches = 100;
var matchesSearched = 0;
var keyToUse = 0;
var matchHistory;
var currentMatch;

function getSummonerID(){
	$.ajax({
                type: 'get',
                url:'https://na.api.pvp.net/api/lol/'+region+'/v1.4/summoner/by-name/'+username+'?api_key='+keys[keyToUse],
                dataType:'json',
                success:function(data) {
			userID = data[username].id;
			getMatchHistory();
                },
                error: function(status) {
                        alert("Error getting summoner id");
			upKey();
			getSummonerID();
                }
        });
}

function getMatchHistory(){
	changedKey = false;
        $.ajax({
                type: 'get',
                url:'https://na.api.pvp.net/api/lol/'+region+'/v2.2/matchlist/by-summoner/'+userID+'?api_key='+keys[keyToUse],
                dataType:'json',
                success:function(data) {
                        matchHistory = data;
			numMatches = matchHistory['matches'].length;
			getMatch(matchHistory['matches'][matchesSearched].matchId);
                },
                error: function(status) {
                        alert("Error getting match history");
			upKey();
			getMatchHistory();
                }
        });

}


function getMatch(matchId){
	console.log("Searching match: "+matchesSearched);
	$.ajax({
                type: 'get',
                url:'https://na.api.pvp.net/api/lol/'+region+'/v2.2/match/'+matchId+'?api_key='+keys[keyToUse],
                dataType:'json',
                success:function(data) {
			currentMatch = data;
			for(var p = 0; p<data['participantIdentities'].length; p++){
				player = data['participantIdentities'][p]['player']['summonerName'].toLowerCase();
				if(friend===player){
					if(data['participants'][p]['stats']['winner']===true){
						wins++;
					}
					else{
						loses++;
					}
				}
			}
			matchesSearched++;
			if(matchesSearched === numMatches){
				displayPercent();
			}
			else{
				getMatch(matchHistory['matches'][matchesSearched].matchId);
			}
                },
                error: function(status) {
                        alert("Error getting match");
			upKey();
			getMatch(matchId);
                }
        });	
}

function upKey(){
	if(keyToUse<keys.length-1)
		keyToUse++;
        else{
              	keyToUse=0;
        }
	console.log("Now using key: "+keyToUse);
}

function displayPercent(){
	var percent = wins/(wins+loses);
	$("#gamesPlayed").html("Games played: "+(wins+loses));
	$("#winPercent").html("Win percent: "+Math.floor(percent * 10000)/100+"%");
}

function submit() {
	wins = 0;
	loses = 0;
	matchesSearched = 0;
	username = $("#name")[0].value;
	region = $("#region")[0].value;
	friend = $("#friend")[0].value.toLowerCase();
	getSummonerID();
}

$(document).ready(function() {
	$("#submitButton").click(function(event){
		submit();
	});
});

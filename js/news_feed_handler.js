var ID = 1;

var getId = function () {
    return ID++;
};

var curTopics = [];



var getDataFromServer = function() {
    $.ajax({
        url: 'get_past_games.html',
        type: 'GET',
        success: function(data) {
            gameData = (data);
            loadPuzzlesStats();
            for (var i = 0; i < 5; ++i) {
                addNewToNewsFeed();
            }
        },
        error: function() {
            for (var i = 0; i < 1346; ++i) {
                var game = {
                    win: ii(2),
                    hp: ii(78),
                    hp_enemy: ii(89),
                    probability: {
                        wiki: '',
                        arxiv: '',
                        win: ii(2),
                        skipped: ii(2),
                        time_to_finish: ii(100) + 125
                    },
                    graph: {
                        wiki: '',
                        arxiv: '',
                        win: ii(2),
                        skipped: ii(2),
                        time_to_finish: ii(35) + 25
                    },
                    _3d: {
                        wiki: '',
                        arxiv: '',
                        win: ii(2),
                        skipped: ii(2),
                        time_to_finish: ii(30) + 14
                    },
                    set_diff: {
                        wiki: '',
                        arxiv: '',
                        win: ii(2),
                        skipped: ii(2),
                        time_to_finish: ii(24) + 12
                    }
                };
                gameData.push(game);
            }
            loadPuzzlesStats();
            for (var i = 0; i < 5; ++i) {
                addNewToNewsFeed();
            }
        }
    });
};

var gameData = [
    {
        win: 0,
        hp: 0,
        hp_enemy: 25,
        probability: {
            wiki: '',
            arxiv: '',
            win: 0,
            skipped: 0,
            time_to_finish: 55
        },
        graph: {
            wiki: '',
            arxiv: '',
            win: 1,
            skipped: 0,
            time_to_finish: 20
        },
        _3d: {
            wiki: '',
            arxiv: '',
            win: 0,
            skipped: 1,
            time_to_finish: 0
        },
        set_diff: {
            wiki: '',
            arxiv: '',
            win: 0,
            skipped: 0,
            time_to_finish: 43
        }
    },
    {
        win: 1,
        hp: 10,
        hp_enemy: 5,
        probability: {
            wiki: '',
            arxiv: '',
            win: 1,
            skipped: 0,
            time_to_finish: 32
        },
        graph: {
            wiki: '',
            arxiv: '',
            win: 1,
            skipped: 0,
            time_to_finish: 14
        },
        _3d: {
            wiki: '',
            arxiv: '',
            win: 0,
            skipped: 1,
            time_to_finish: 0
        },
        set_diff: {
            wiki: '',
            arxiv: '',
            win: 1,
            skipped: 0,
            time_to_finish: 32
        }
    }
];

var skills = ['probability', 'graph', '_3d', 'set_diff'];
var skillRealName = ['Bayes theorem', 'Graph Algorithms', 'Homeomorphism', 'Set operations'];
var wikiLinks = [
    ['https://en.wikipedia.org/wiki/Bayes%27_theorem'],
    ['https://en.wikipedia.org/wiki/Eulerian_path'],
    ['https://en.wikipedia.org/wiki/3D'],
    ['https://en.wikipedia.org/wiki/Complement_(set_theory)']
];
var arxiv = [
    ['https://en.wikipedia.org/wiki/Bayes%27_theorem'],
    ['https://en.wikipedia.org/wiki/Eulerian_path'],
    ['https://en.wikipedia.org/wiki/3D'],
    ['https://en.wikipedia.org/wiki/Complement_(set_theory)']
];

var loadIdolOnDemandSuggestions = function() {
    $.ajax({
        url: "https://api.idolondemand.com/1/api/sync/findsimilar/v1?text=Graph&apikey=cd215585-8b06-4834-8695-4b8c49f64d71",
        type: 'GET',
        success: function(data) {
            var docs = data.documents;
            for (var i = 0; i < docs.length; ++i) {
                wikiLinks[1].push(docs[i].reference);
                arxiv[1].push(docs[i].reference);
            }
        }
    });
    $.ajax({
        url: "https://api.idolondemand.com/1/api/sync/findsimilar/v1?text=Bayes Theorem&apikey=cd215585-8b06-4834-8695-4b8c49f64d71",
        type: 'GET',
        success: function(data) {
            var docs = data.documents;
            for (var i = 0; i < docs.length; ++i) {
                wikiLinks[0].push(docs[i].reference);
                arxiv[0].push(docs[i].reference);
            }
        }
    });
    $.ajax({
        url: "https://api.idolondemand.com/1/api/sync/findsimilar/v1?text=3D models&apikey=cd215585-8b06-4834-8695-4b8c49f64d71",
        type: 'GET',
        success: function(data) {
            var docs = data.documents;
            for (var i = 0; i < docs.length; ++i) {
                wikiLinks[2].push(docs[i].reference);
                arxiv[2].push(docs[i].reference);
            }
        }
    });
    $.ajax({
        url: "https://api.idolondemand.com/1/api/sync/findsimilar/v1?text=Set theory Math&apikey=cd215585-8b06-4834-8695-4b8c49f64d71",
        type: 'GET',
        success: function(data) {
            var docs = data.documents;
            for (var i = 0; i < docs.length; ++i) {
                wikiLinks[3].push(docs[i].reference);
                arxiv[3].push(docs[i].reference);
            }
        }
    });
    $.ajax({
        url: "https://api.idolondemand.com/1/api/sync/findsimilar/v1?text=Math Algorithm Data Structure&apikey=cd215585-8b06-4834-8695-4b8c49f64d71",
        type: 'GET',
        success: function(data) {
            var docs = data.documents;
            for (var i = 0; i < docs.length; ++i) {
                links.push(docs[i].reference);
            }
        }
    });
};

var loadPuzzlesStats = function () {
    initStats();
    var totalWins = [0, 0, 0, 0];
    var totalGames = [0, 0, 0, 0];
    var totalTime = [0, 0, 0, 0];
    var totalSkips = [0, 0, 0, 0];
    for (var i = 0; i < gameData.length; ++i) {
        var game = gameData[i];
        ++stats.games_total;
        if (game.win) {
            ++stats.games_win;
        }
        for (var skillId = 0; skillId < skills.length; ++skillId) {
            var skillName = skills[skillId];
            var win = game[skillName].win;
            var wasSkipped = game[skillName].skipped;
            var timeTF = game[skillName].time_to_finish;

            totalWins[skillId] += win;
            ++totalGames[skillId];
            totalTime[skillId] += timeTF;
            totalSkips[skillId] += wasSkipped;
        }
    }
    for (var skillId = 0; skillId < skills.length; ++skillId) {
        var skillName = skills[skillId];
        stats[skillName].wins = parseInt(100 * totalWins[skillId] / gameData.length);
        stats[skillName].loses = parseInt(100 * (totalGames[skillId] - totalWins[skillId]) / gameData.length);
        stats[skillName].skips = parseInt(100 * totalSkips[skillId] / gameData.length);
        stats[skillName].avg = parseInt(totalTime[skillId] / gameData.length);

        stats[skillName].skill = getMagicSkill(
            stats[skillName].wins,
            stats[skillName].skips,
            stats[skillName].avg);
    }
};

var getMagicSkill = function (wins, skips, avg) {
    var weight = wins * 100 + skips * 30 + avg * 35;
    var max = 16500;
    return parseInt(100 * weight / max);
};

var rnd = function (x) {
    var r = Math.random() * x;
    if (r >= x * 0.999999) {
        r = x - 1 + 0.5;
    }
    return Math.floor(r);
};

var generateNextMessage = function () {
    // With 10% of probability we generate random item.
    if (rnd(100) < 10) {
        return generateAverageMessage();
    }

    var skillId = rnd(skills.length);
    var skillName = skills[skillId];

    var topics = [
        'time',
        'wins',
        'skills',
        'skips'
    ];
    var topicId = rnd(topics.length);
    return generateSkillMessage(topics[topicId], skillName, skillId, stats[skillName]);
};

var generateSkillMessage = function (topic, skillName, skillId, stats) {
    if (topic == 'time') {
        var t = stats.avg;
        if (t > 70) {
            return {
                id: getId(),
                puzzle: skillName,
                strong_text: 'It takes you a while to finish ' + skillRealName[skillId] + "!",
                additional_text: 'Average time is ' + t + " seconds",
                chart: 'time_chart',
                wiki_link: wikiLinks[skillId][rnd(wikiLinks[skillId].length)],
                style: 'red'
            }
        } else if (t > 40) {
            return {
                id: getId(),
                puzzle: skillName,
                strong_text: 'You are good in ' + skillRealName[skillId] + "! But you can make it quicker!",
                additional_text: 'Average time is ' + t + " seconds",
                chart: 'time_chart',
                wiki_link: wikiLinks[skillId][rnd(wikiLinks[skillId].length)],
                style: 'yellow'
            }
        } else {
            return {
                id: getId(),
                puzzle: skillName,
                strong_text: 'Wow! You are super quick solving ' + skillRealName[skillId] + "!",
                additional_text: 'Average time is ' + t + " seconds",
                chart: 'time_chart',
                arxiv: wikiLinks[skillId][rnd(wikiLinks[skillId].length)],
                style: 'green'
            }
        }
    } else if (topic == 'wins') {
        var w = stats.wins;
        if (w < 30) {
            return {
                id: getId(),
                puzzle: skillName,
                strong_text: 'Do you want to win more in ' + skillRealName[skillId] + "?",
                additional_text: 'You currently have ' + w + "% of winning",
                chart: 'win_chart',
                wiki_link: wikiLinks[skillId][rnd(wikiLinks[skillId].length)],
                style: 'red'
            }
        } else if (w < 70) {
            return {
                id: getId(),
                puzzle: skillName,
                strong_text: 'You are good in ' + skillRealName[skillId] + "! But you can do more!",
                additional_text: 'You currently have ' + w + "% of winning",
                chart: 'win_chart',
                wiki_link: wikiLinks[skillId][rnd(wikiLinks[skillId].length)],
                style: 'yellow'
            }
        } else {
            return {
                id: getId(),
                puzzle: skillName,
                strong_text: 'Wow! You are really good in ' + skillRealName[skillId] + "!",
                additional_text: 'You currently have ' + w + "% of winning",
                chart: 'win_chart',
                arxiv: wikiLinks[skillId][rnd(wikiLinks[skillId].length)],
                style: 'green'
            }
        }
    } else if (topic == 'skills') {
        var w = stats.skill;
        if (w < 30) {
            return {
                id: getId(),
                puzzle: skillName,
                strong_text: 'You overall progress in ' + skillRealName[skillId] + " could be better! Let's fix it!",
                additional_text: 'You currently have ' + w + "% of skill",
                chart: 'common_chart',
                wiki_link: wikiLinks[skillId][rnd(wikiLinks[skillId].length)],
                style: 'red'
            }
        } else if (w < 70) {
            return {
                id: getId(),
                puzzle: skillName,
                strong_text: "Let's work on " + skillRealName[skillId] + "! You can do it better!",
                additional_text: 'You currently have ' + w + "% of skill",
                chart: 'common_chart',
                wiki_link: wikiLinks[skillId][rnd(wikiLinks[skillId].length)],
                style: 'yellow'
            }
        } else {
            return {
                id: getId(),
                puzzle: skillName,
                strong_text: 'Wow! You definitely know ' + skillRealName[skillId],
                additional_text: 'You currently have ' + w + "% of skill",
                chart: 'common_chart',
                arxiv: wikiLinks[skillId][rnd(wikiLinks[skillId].length)],
                style: 'green'
            }
        }
    } else { // skips
        var w = stats.skips;
        if (w > 70) {
            return {
                id: getId(),
                puzzle: skillName,
                strong_text: 'You skip ' + skillRealName[skillId] + " so much! Wanna practice on it?",
                additional_text: 'You currently have ' + w + "% of skips",
                chart: 'skip_chart',
                wiki_link: wikiLinks[skillId][rnd(wikiLinks[skillId].length)],
                style: 'red'
            }
        } else if (w > 30) {
            return {
                id: getId(),
                puzzle: skillName,
                strong_text: 'You skip ' + skillRealName[skillId] + " sometimes! You can make it better!",
                additional_text: 'You currently have ' + w + "% of skips",
                chart: 'skip_chart',
                wiki_link: wikiLinks[skillId][rnd(wikiLinks[skillId].length)],
                style: 'yellow'
            }
        } else {
            return {
                id: getId(),
                puzzle: skillName,
                strong_text: 'Wow! You definitely know ' + skillRealName[skillId] + "! Almost never skip!",
                additional_text: 'You currently have ' + w + "% of skips",
                chart: 'skip_chart',
                arxiv: wikiLinks[skillId][rnd(wikiLinks[skillId].length)],
                style: 'green'
            }
        }
    }
};

var ii = function(x) {
    return rnd(x);
};

var generateAverageMessage = function () {
    var topics = [
        'link',
        'skill',
        'friends'
    ];
    var topicId = rnd(topics.length);
    if (topics[topicId] == 'link') {
        return {
            id: getId(),
            strong_text: 'Check out this interesting article from Idol On Demand!',
            style: 'green',
            link: links[rnd(links.length)]
        };
    } else if (topics[topicId] == 'skill') {
        return {
            id: getId(),
            strong_text: 'You can check your statistics on the corresponding menu option!',
            link: 'statistic.html',
            style: 'yellow'
        };
    } else {
        return {
            id: getId(),
            strong_text: 'Invite friends to play battle brain!',
            style: 'green'
        };
    }
};

var links = [
    'https://en.wikipedia.org/wiki/Bayesian_probability',
    'http://integrals.wolfram.com/index.jsp',
    'http://en.wikipedia.org/wiki/Array data structure',
    'http://arxiv.org/pdf/1507.00233.pdf',
    'http://arxiv.org/pdf/1507.04342.pdf'
];

var removeFromNewsFeed = function (id) {
    var idx = -1;
    for (var i = 0; i < curTopics.length; ++i) {
        if (curTopics[i].id == id) {
            idx = i;
            break;
        }
    }
    if (idx != -1) {
        curTopics.splice(idx, 1);
    }
    $('#' + id).remove();
};

var renderOneMessage = function (message) {
    var element = document.createElement('li');
    if (message.style == 'green') {
        element.className = 'list-group-item list-group-item-success';
    } else if (message.style == 'yellow') {
        element.className = 'list-group-item list-group-item-warning';
    } else {
        element.className = 'list-group-item list-group-item-danger';
    }
    element.setAttribute('id', message.id);
    var div1 = document.createElement('div');
    div1.className = 'container-fluid';

    var div2 = document.createElement('div');
    div2.className = 'row';

    var div3 = document.createElement('div');
    div3.className = 'col-md-8';

    var h4 = document.createElement('h4');
    h4.innerHTML = message.strong_text;
    div3.appendChild(h4);
    if (!!message.additional_text) {
        var p = document.createElement('p');
        p.innerHTML = message.additional_text;
        div3.appendChild(p);
    }
    if (!!message.wiki_link) {
        var p = document.createElement('p');
        p.innerHTML = 'Check out wiki page from Idol On Demand recommendation';
        div3.appendChild(p);
    }
    if (!!message.arxiv) {
        var p = document.createElement('p');
        p.innerHTML = 'Check out arxive page from Idol On Demand recommendation';
        div3.appendChild(p);
    }

    div2.appendChild(div3);

    var div4 = document.createElement('div');
    div4.className = 'col-md-4';

    if (!!message.chart) {
        var chart_type = message.chart;
        var a = document.createElement('a');
        if (chart_type == 'common_chart') {
            a.href = "one_skill.html";

        } else if (chart_type == 'skip_chart') {
            a.href = "one_skill.html";
            globalData = [11, 12, 13, 14, 15, 14, 13, 12, 11];
            globalName = "Skip rate";
        } else if (chart_type == 'win_chart') {
            a.href = "one_skill.html";
            globalData = [11, 12, 13, 14, 0, 14, 13, 12, 11];
            globalName = "Average wins";
        } else if (chart_type == 'time_chart') {
            a.href = "one_skill.html";
            globalData = [11, 12, 13, 14, 100, 14, 13, 12, 11];
            globalName = "Average time (sec)";
        } else {
            a.href = "one_skill.html";
        }
        a.className = 'btn btn-info btn-sm';
        a.innerHTML = 'More info';
        div4.appendChild(a);
    }

    if (!!message.wiki_link) {
        var a2 = document.createElement('a');
        a2.href = message.wiki_link;
        a2.className = 'btn btn-warning btn-sm';
        a2.innerHTML = 'Wiki';
        div4.appendChild(a2);
    }

    if (!!message.arxiv) {
        var a5 = document.createElement('a');
        a5.href = message.arxiv;
        a5.className = 'btn btn-success btn-sm';
        a5.innerHTML = 'Wiki';
        div4.appendChild(a5);
    }

    if (!!message.link) {
        var a7 = document.createElement('a');
        a7.href = message.link;
        a7.className = 'btn btn-success btn-sm';
        a7.innerHTML = 'Check out';
        div4.appendChild(a7);
    }

    var a3 = document.createElement('button');
    a3.className = 'btn btn-danger btn-sm';
    a3.innerHTML = 'Ack';
    a3.onclick = function () {
        removeFromNewsFeed(message.id);
        addNewToNewsFeed();
    };
    div4.appendChild(a3);
    div2.appendChild(div4);

    div1.appendChild(div2);
    element.appendChild(div1);

    return element;
};

var checkDu = function(topic) {
    for (var i = 0; i < curTopics.length; ++i) {
        if (curTopics[i].topic == topic) {
            return true;
        }
    }
    return false;
};

var getTopic = function(message) {
    return message.strong_text;
};

var addNewToNewsFeed = function () {
    while (true) {
        var message = generateNextMessage();
        if (!checkDu(getTopic(message))) {
            curTopics.push({
                topic: getTopic(message),
                id: message.id
            });
            break;
        }
    }
    var element = renderOneMessage(message);
    $('#news_feed').append(element);
};

var renderNewsFeed = function (messages) {
    for (var i = 0; i < messages.length; ++i) {
        var element = renderOneMessage(messages[i]);
        $('#news_feed').append(element);
    }
};

$(function () {
    $(document).ready(function () {
        loadIdolOnDemandSuggestions();
        getDataFromServer();


        // renderNewsFeed(initMessages);
    });
});
// per game:
// - skip
// - # of wins/loses
// - avg time
// - skill

var globalName;
var globalData;

var stats = {
    games_win: 0,
    games_total: 0,
    overall_skill: 0,
    probability: {
        skips: 0,
        wins: 0,
        loses: 0,
        avg: 0,
        skill: 0
    },
    set_diff: {
        skips: 0,
        wins: 0,
        loses: 0,
        avg: 0,
        skill: 0
    },
    _3d: {
        skips: 0,
        wins: 0,
        loses: 0,
        avg: 0,
        skill: 0
    },
    graph: {
        skips: 0,
        wins: 0,
        loses: 0,
        avg: 0,
        skill: 0
    }
};

var initStats = function() {
    stats = {
        games_win: 0,
        games_total: 0,
        overall_skill: 0,
        probability: {
            skips: 0,
            wl: 0,
            avg: 0,
            skill: 0
        },
        set_diff: {
            skips: 0,
            wl: 0,
            avg: 0,
            skill: 0
        },
        _3d: {
            skips: 0,
            wl: 0,
            avg: 0,
            skill: 0
        },
        graph: {
            skips: 0,
            wl: 0,
            avg: 0,
            skill: 0
        }
    };
};


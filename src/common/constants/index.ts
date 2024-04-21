import {TableDataType} from "../types";

export const characterTableDefault: TableDataType = {
    rows: [{
        name: "Valtan",
        statuses: [false, false, false, false, false, false]

    }, {
        name: "Vykas",
        statuses: [false, false, false, false, false, false]

    }, {
        name: "Kakul",
        statuses: [false, false, false, false, false, false]

    }, {
        name: "Brel",
        statuses: [false, false, false, false, false, false]

    }, {
        name: "Akkan",
        statuses: [false, false, false, false, false, false]

    }, {
        name: "KAYANGEL",
        statuses: [false, false, false, false, false, false]

    }, {
        name: "IVORY TO.",
        statuses: [false, false, false, false, false, false]
    }],
    columns: [
        "PIčus kokota zmrd"
        , "VAMP"
        , "Soul"
        , "WD"
        , "Sorc"
        , "Slayer"
    ]
};

export const taskDataDefault: TableDataType = {
    columns: [
        "BREAK"
        , "Soul"
        , "WD"
        , "Slayer"
        , "Sorc"
        , "Striker"
    ],
    rows: [{
        name: "Dungeon Card",
        statuses: [false, false, false, false, false, false]
    },
        {
            name: "Argos",
            statuses: [false, false, false, false, false, false]
        }]
}

export const oneTimeTask: TableDataType = {
    columns: [""],
    rows: [{
        name: "Una weekly",
        statuses: [false]
    },
        {
            name: "Aby. Chlg",
            statuses: [false]
        },
        {
            name: "Raid Chlg",
            statuses: [false]
        },
        {
            name: "Gems w. ship",
            statuses: [false]
        }
    ]
}

export const daily: TableDataType = {
    columns: [""],
    rows: [{
        name: "UNA",
        statuses: [false]
    },
        {
            name: "F.B.I. CHAOS",
            statuses: [false]
        }]
}

export const dailyTask: TableDataType = {
    columns: ["BREAK", "Others", "CUBE"],
    rows: [{
        name: "Chaos Dung",
        statuses: [false, false, false]
    }, {
        name: "Guard. Raid",
        statuses: [false, false, false]
    },
        {
            name: "Armin",
            statuses: [false, false, false]
        }]
}

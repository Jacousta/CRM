const { getDB } = require("../config/db");

const validateRules = (rules) => {
    if (!Array.isArray(rules)) throw new Error("Rules must be an array.");
    rules.forEach((rule, index) => {
        if (!rule.field || !rule.operator || rule.value === undefined || !rule.condition) {
            throw new Error(`Rule at index ${index} is missing required properties.`);
        }
    });
};

const parseValue = (field, value) => {
    switch (field) {
        case "last_visit":
            return new Date(value);
        case "visits":
            return parseInt(value, 10);
        case "total_spends":
            return parseFloat(value);
        default:
            return value;
    }
};

const getMongoOperator = (operator, value, isDate) => {
    const ops = {
        ">": { $gt: value },
        "<": { $lt: value },
        "=": isDate ? { $gte: value.startOfDay, $lt: value.endOfDay } : value,
        "!=": { $ne: value },
        ">=": { $gte: value },
        "<=": { $lte: value },
    };
    return ops[operator];
};

const getAudienceSizeHandler = async (rules) => {
    validateRules(rules);

    const db = getDB();
    let andConditions = [];
    let orConditions = [];

    rules.forEach((rule) => {
        let condition = {};
        let value = parseValue(rule.field, rule.value);

        if (rule.field === "last_visit") {
            const startOfDay = new Date(value.setUTCHours(0, 0, 0, 0));
            const endOfDay = new Date(value.setUTCHours(23, 59, 59, 999));
            value = { startOfDay, endOfDay };
        }

        condition[rule.field] = getMongoOperator(rule.operator, value, rule.field === "last_visit");

        if (rule.condition === "AND") {
            andConditions.push(condition);
        } else if (rule.condition === "OR") {
            orConditions.push(condition);
        }
    });

    const query = {};
    if (andConditions.length) query.$and = andConditions;
    if (orConditions.length) query.$or = orConditions;

    try {
        return await db.collection("customers").countDocuments(query);
    } catch (error) {
        console.error("Error querying audience size:", error);
        throw new Error("Failed to calculate audience size.");
    }
};

const getAudienceSize = async (req, res) => {
    const { rules } = req.body;
    try {
        const audienceSize = await getAudienceSizeHandler(rules);
        res.json({ size: audienceSize });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAudienceSize, getAudienceSizeHandler };
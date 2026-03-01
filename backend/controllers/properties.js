const Property = require("../models/property.js");

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildPropertyFilter(query) {
    const { q, minRent, maxRent, available, categories } = query;
    const filter = {};

    if (q && q.trim()) {
        filter.title = { $regex: escapeRegex(q.trim()), $options: "i" };
    }

    if (categories) {
        filter.categories = categories;
    }

    if (minRent || maxRent) {
        filter.price = {};
        if (minRent && !Number.isNaN(Number(minRent))) {
            filter.price.$gte = Number(minRent);
        }
        if (maxRent && !Number.isNaN(Number(maxRent))) {
            filter.price.$lte = Number(maxRent);
        }
        if (!Object.keys(filter.price).length) {
            delete filter.price;
        }
    }

    if (available === "available") {
        filter.available = { $ne: false };
    } else if (available === "unavailable") {
        filter.available = false;
    }

    return filter;
}

module.exports.indexApi = async (req, res) => {
    const filter = buildPropertyFilter(req.query);
    const allProperties = await Property.find(filter).sort({ _id: -1 });
    res.json({
        data: allProperties,
        meta: {
            selectedCategory: req.query.categories || "",
        },
    });
};

module.exports.showApi = async (req, res) => {
    const { id } = req.params;
    const property = await Property.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!property) {
        return res.status(404).json({ error: "Property not found" });
    }

    return res.json({ data: property });
};

module.exports.createApi = async (req, res) => {
    const payload = { ...(req.body.property || {}) };
    const newProperty = new Property(payload);
    newProperty.owner = req.user._id;
    newProperty.ownerModel = req.user.constructor.modelName;

    if (req.file) {
        newProperty.image = { url: req.file.path, filename: req.file.filename };
    } else if (!newProperty.image || !newProperty.image.url) {
        newProperty.image = {
            url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60",
            filename: "default-property-image",
        };
    }

    await newProperty.save();
    return res.status(201).json({ message: "Property created", data: newProperty });
};

module.exports.updateApi = async (req, res) => {
    const { id } = req.params;
    const payload = { ...(req.body.property || {}) };
    const property = await Property.findByIdAndUpdate(id, { ...payload }, { new: true, runValidators: true });

    if (!property) {
        return res.status(404).json({ error: "Property not found" });
    }

    if (req.file) {
        property.image = { url: req.file.path, filename: req.file.filename };
        await property.save();
    }

    return res.json({ message: "Property updated", data: property });
};

module.exports.destroyApi = async (req, res) => {
    const { id } = req.params;
    const deletedProperty = await Property.findByIdAndDelete(id);
    if (!deletedProperty) {
        return res.status(404).json({ error: "Property not found" });
    }
    return res.json({ message: "Property deleted" });
};

//powerful schema description language and data validator for JavaScript.
const Joi = require('joi');
const reviews = require('./models/reviews');
module.exports.listingschema = Joi.object({
    listing: Joi.object(
        {
            title:Joi.string().required(),
            description:Joi.string().required(),
            location:Joi.string().required(),
            country:Joi.string().required(),
            price:Joi.number().required().min(0),
        }).required().unknown(true)
});


module.exports.reviewschema = Joi.object({
    review: Joi.object({
    rating:Joi.number().required(),
    comment:Joi.string().required()
}).required()
});
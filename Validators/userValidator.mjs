import { checkSchema, param } from "express-validator";

export const userValidationSchema = checkSchema({
    name: {
        notEmpty: {
            errorMessage: 'Username cannot be empty'
        },
        isString: {
            errorMessage: 'Username must be a string'
        },
    },
    password: {
        isLength: {
            options: { min: 5, max: 128 },
            errorMessage: 'Password must be between 5 and 128 characters'
        },
        matches: {
            options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&~#^_+=\-';,./|":<>])[A-Za-z\d@$!%*?&~#^_+=\-';,./|":<>]{5,128}$/,
            errorMessage: 'Minimum five characters, at least one uppercase letter, one lowercase letter, one number and one special character',
        },
        notEmpty: {
            errorMessage: 'Password cannot be empty'
        },
    },
    email: {
        isEmail: {
            errorMessage: 'Email must be valid',
        },
        notEmpty: {
            errorMessage: 'Email cannot be empty'
        },
    },
    phone_number:{
        matches:{
            options:/(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})/,
            errorMessage:'Please specify valid phone number'
        },

    },
    address:{
        notEmpty: {
        errorMessage: 'address cannot be empty'
    },},
});


export const validateUserId = [
    param('id')
        .isInt()
        .withMessage('ID must be an integer')
];


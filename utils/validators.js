exports.isEmpty = (value)=>{

    return (
        value === undefined ||
        value === null ||
        value === ""
    );

};



exports.isValidEmail = (email)=>{

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(email);

};



exports.isValidPhone = (phone)=>{

    return /^[6-9]\d{9}$/
    .test(phone);

};
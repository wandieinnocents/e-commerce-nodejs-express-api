// global  handler for api responses

//200 //Success response
const successResponse = (res, {
    statusCode = 200,
    message = "Request successful.",
    data = null,
    records_count = null
}) => {
    return res.status(statusCode).json({
        success: true,
        status_code: statusCode,
        timestamp: new Date().toISOString(),
        message,
        ...(records_count && { records_count }),
        ...(data && { data })
    });
};

//201 //creating a new resource
const createdResponse = (res, {
    message = "Resource created successfully.",
    data = null
}) => {
    return res.status(201).json({
        success: true,
        status_code: 201,
        timestamp: new Date().toISOString(),
        message,
        ...(data && { data })
    });
};

//200 //updating a new resource
const updatedResponse = (res, {
    message = "Resource updated successfully.",
    data = null
}) => {
    return res.status(200).json({
        success: true,
        status_code: 200,
        timestamp: new Date().toISOString(),
        message,
        ...(data && { data })
    });
};

//401 //Unauthorized access
const unauthorizedResponse = (res, {
    message = "Unauthorized access.",
    error = null
}) => {
    return res.status(401).json({
        success: false,
        status_code: 401,
        timestamp: new Date().toISOString(),
        message,
        ...(error && { error })
    });
};


//500 //Internal server error
const serverErrorResponse = (res, {
    message = "Something went wrong. Please try again later.",
    error = null
}) => {
    return res.status(500).json({
        success: false,
        status_code: 500,
        timestamp: new Date().toISOString(),
        message,
        ...(error && { error })
    });
};

//404 //Unauthorized access
const notFoundResponse = (res, {
    message = "Not found",
    error = null
}) => {
    return res.status(404).json({
        success: false,
        status_code: 404,
        timestamp: new Date().toISOString(),
        message,
        ...(error && { error })
    });
};

//400 //Bad request
const badRequestResponse = (res, {
    message = "Bad request.",
    error = null
}) => {
    return res.status(400).json({
        success: false,
        status_code: 400,
        timestamp: new Date().toISOString(),
        message,
        ...(error && { error })
    });
};

//403 //Forbidden
const forbiddenResponse = (res, {
    message = "Forbidden.",
    error = null
}) => {
    return res.status(403).json({
        success: false,
        status_code: 403,
        timestamp: new Date().toISOString(),
        message,
        ...(error && { error })
    });
};


module.exports = {
    successResponse,
    createdResponse,
    updatedResponse,
    unauthorizedResponse,
    serverErrorResponse,
    notFoundResponse,
    badRequestResponse,
    forbiddenResponse,
};

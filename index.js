const AWS = require("aws-sdk");
const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: 'us-east-1' });
const lambda = new AWS.Lambda();


const paramBuilder = (functionName, payload={}) => ({
        FunctionName: functionName,
        InvocationType: "RequestResponse",
        Payload: JSON.stringify(payload)
});

exports.handler = async (event) => {
    const {
        Records = []
    } = event;

    const [ first = {} ] = Records;

    const {
        s3: {
            bucket: {
                name
            },
            object: {
                key
            }
        }
    } = first;

    const dataBucket = "dev-ki-apps-foo-data"
    const copyParams = () => {
        return {
            Bucket: dataBucket,
            CopySource: `${dataBucket}/${key}`,
            Key: key
        };
    };

    const copyPromise = s3.copyObject(copyParams).promise());
    await Promise.all(copyPromise)
};

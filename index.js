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
    const copyParams = key => {

        const subkey = key.replace(from, '');
        return {
            Bucket: dataBucket,
            CopySource: `${dataBucket}/${key}`,
            Key: key
        };
    };

    const copyPromises = list.Contents.map(({Key}) => s3.copyObject(copyParams(Key)).promise());
    await Promise.all(copyPromises)
};

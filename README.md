
# Serverless Framework Node Express API on AWS

This demonstrates how to develop and deploy a simple Node Express API service, backed by DynamoDB database, running on AWS Lambda using the traditional Serverless Framework.

## Usage

### Deployment

Install dependencies with:

```
npm install
```

and then deploy with:

```
sls deploy
```

After running deploy, you should see output similar to:

```bash
Deploying aws-node-express-dynamodb-api-project to stage dev (us-east-1)

✔ Service deployed to stack aws-node-express-dynamodb-api-project-dev (196s)

endpoint: ANY - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
```

### Invocation

After successful deployment, you can create a new profile by calling the corresponding endpoint:

```bash
curl --request POST 'https://xxxxxx.execute-api.us-east-1.amazonaws.com/profiles/create' --header 'Content-Type: application/json' --data-raw '{"name": "John Doe", "title": "Owner", "bio": "Owner and creater of sample organization"}'
```

You can later retrieve the profile by `id` by calling the following endpoint:

```bash
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/profiles/get/id
```

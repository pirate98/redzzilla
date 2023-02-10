# Project Redzilla

# client folder

Contains the ReactJS application.

To start: `npm start`

# server folder

This contains the userdata API. It is already deployed on AWS and normally does not need to be modified.

To run locally, use `chalice local` in the server folder.


# Cloud Deployment Notes

This is already done and is not needed for local development.

```
ENV=sitename-dev ### adjust

aws cloudformation deploy --stack-name $ENV --template-file .\pipeline.yaml --capabilities CAPABILITY_NAMED_IAM

(cd server/userdata && chalice deploy --stage xxxx)

git commit # include .chalice/json files!
git push

# deploy the CDN
aws cloudformation deploy --stack-name $ENV-cloudfront --template-file .\cloudfront.yaml --capabilities CAPABILITY_NAMED_IAM --parameter-override EnvPrefix=$ENV
```

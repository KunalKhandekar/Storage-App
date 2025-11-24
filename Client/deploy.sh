set -e

SERVER_ALIAS="storageApp"
REMOTE_DIR="/var/www/dist"

echo "Building project.."
npm run build

echo "Uploading dist contents to EC2..."
scp -r dist/. $SERVER_ALIAS:$REMOTE_DIR

echo "Triggering remote S3 sync + CloudFront invalidation..."
ssh $SERVER_ALIAS "bash /var/www/deploy-remote.sh"

echo "Deployment finished successfully !"

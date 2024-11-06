#!/bin/bash -xe

SOURCE_DIRECTORY=${SOURCE_DIRECTORY?Required}
DESTINATION_DIRECTORY=${DESTINATION_DIRECTORY?Required}

if [ -d "$DESTINATION_DIRECTORY" ]; then
  echo "Destination directory <$DESTINATION_DIRECTORY> already exists. Please delete and try again"
  exit 1
fi

mkdir -p $(dirname "$DESTINATION_DIRECTORY")
cp -r --no-target-directory "$SOURCE_DIRECTORY" "$DESTINATION_DIRECTORY"

find "$DESTINATION_DIRECTORY" -type f -exec sed -i "s/\<APP_TITLE_PLACEHOLDER\>/$APP_TITLE/g" {} +
find "$DESTINATION_DIRECTORY" -type f -exec sed -i "s/\<APP_ENVIRONMENT_PLACEHOLDER\>/$APP_ENVIRONMENT/g" {} +
find "$DESTINATION_DIRECTORY" -type f -exec sed -i "s/\<APP_MAPBOX_ACCESS_TOKEN_PLACEHOLDER\>/$APP_MAPBOX_ACCESS_TOKEN/g" {} +
find "$DESTINATION_DIRECTORY" -type f -exec sed -i "s/\<APP_TINY_API_KEY_PLACEHOLDER\>/$APP_TINY_API_KEY/g" {} +
# NOTE: We don't need a word boundary at end as we already have a trailing slash
find "$DESTINATION_DIRECTORY" -type f -exec sed -i "s|\bhttps://APP-API-ENDPOINT-PLACEHOLDER.COM/|$APP_API_ENDPOINT|g" {} +
# NOTE: We don't need a word boundary at end as we already have a trailing slash
find "$DESTINATION_DIRECTORY" -type f -exec sed -i "s|\bhttps://APP-RISK-API-ENDPOINT-PLACEHOLDER.COM/|$APP_RISK_API_ENDPOINT|g" {} +
find "$DESTINATION_DIRECTORY" -type f -exec sed -i "s|\bhttps://APP-SENTRY-DSN-PLACEHOLDER.COM\b|$APP_SENTRY_DSN|g" {} +

# Show diffs (Useful to debug issues)
set +x
find "$SOURCE_DIRECTORY" -type f -printf '%P\n' | while IFS= read -r file; do
    diff -W 100 <(fold -w 100 "$SOURCE_DIRECTORY/$file") <(fold -w 100 "$DESTINATION_DIRECTORY/$file") --suppress-common-lines
done

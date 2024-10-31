#!/bin/bash -x

SOURCE_DIRECTORY=${SOURCE_DIRECTORY?Required}
DESTINATION_DIRECTORY=${DESTINATION_DIRECTORY?Required}

if [ -d "$DESTINATION_DIRECTORY" ]; then
  echo "Destination directory <$DESTINATION_DIRECTORY> already exists. Please delete and try again"
fi

mkdir -p $(dirname "$DESTINATION_DIRECTORY")
cp -r --no-target-directory "$SOURCE_DIRECTORY" "$DESTINATION_DIRECTORY"

find "$DESTINATION_DIRECTORY" -type f -exec sed -i "s/APP_TITLE_PLACEHOLDER/$APP_TITLE/g" {} +
find "$DESTINATION_DIRECTORY" -type f -exec sed -i "s/APP_ENVIRONMENT_PLACEHOLDER/$APP_ENVIRONMENT/g" {} +
find "$DESTINATION_DIRECTORY" -type f -exec sed -i "s/APP_MAPBOX_ACCESS_TOKEN_PLACEHOLDER/$APP_MAPBOX_ACCESS_TOKEN/g" {} +
find "$DESTINATION_DIRECTORY" -type f -exec sed -i "s/APP_TINY_API_KEY_PLACEHOLDER/$APP_TINY_API_KEY/g" {} +
find "$DESTINATION_DIRECTORY" -type f -exec sed -i "s|https://APP-API-ENDPOINT-PLACEHOLDER.COM/|$APP_API_ENDPOINT|g" {} +
find "$DESTINATION_DIRECTORY" -type f -exec sed -i "s|https://APP-RISK-API-ENDPOINT-PLACEHOLDER.COM/|$APP_RISK_API_ENDPOINT|g" {} +
find "$DESTINATION_DIRECTORY" -type f -exec sed -i "s|https://APP-SENTRY-DSN-PLACEHOLDER.COM|$APP_SENTRY_DSN|g" {} +

# Show diffs (Useful to debug issues)
set +x
find "$SOURCE_DIRECTORY" -type f -printf '%P\n' | while IFS= read -r file; do
    diff -W 100 <(fold -w 100 "$SOURCE_DIRECTORY/$file") <(fold -w 100 "$DESTINATION_DIRECTORY/$file") --suppress-common-lines
done

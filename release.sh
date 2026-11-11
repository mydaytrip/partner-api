set -e

npm run build
rm -r docs/*
cp -R build/3-rev/* docs/
# Files for AI coding agents are published as they are, next to the site.
cp source/llm/* docs/
# Without this file GitHub Pages runs Jekyll, which turns the Markdown guide into an HTML page.
touch docs/.nojekyll

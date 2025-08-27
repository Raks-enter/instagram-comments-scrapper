# Instagram Comments Scraper

This Apify actor scrapes comments from Instagram posts.

## Input

Provide a list of Instagram post URLs:

```json
{
  "postUrls": [
    "https://www.instagram.com/p/POST_ID_1/",
    "https://www.instagram.com/p/POST_ID_2/"
  ]
}
```

## Output

The actor returns a dataset with:

- Comment ID
- Text
- Timestamp
- Username
- Profile URL
- Profile Picture

## Usage

Run it on [Apify](https://apify.com). You can schedule, integrate with API, or download results as JSON/CSV.

import { Actor } from 'apify';

await Actor.main(async () => {
    const input = await Actor.getInput() || {};

    // Support both "postUrls" (array of strings) and "startUrls" (Apify format)
    let postUrls = input.postUrls || [];

    if ((!postUrls || postUrls.length === 0) && input.startUrls) {
        postUrls = input.startUrls.map(u => u.url);
    }

    if (!postUrls || postUrls.length === 0) {
        throw new Error("No Instagram post URLs provided!");
    }

    const results = [];

    for (const url of postUrls) {
        try {
            const postId = url.split("/p/")[1]?.split("/")[0];
            if (!postId) continue;

            const apiUrl = `https://www.instagram.com/p/${postId}/?__a=1&__d=dis`;
            const res = await fetch(apiUrl, {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                },
            });

            if (!res.ok) {
                console.log(` Failed to fetch ${url}`);
                continue;
            }

            const data = await res.json();

            const comments = data?.graphql?.shortcode_media?.edge_media_to_parent_comment?.edges || [];
            const extracted = comments.map((c, idx) => ({
                position: idx + 1,
                postId,
                commentId: c.node.id,
                text: c.node.text,
                timestamp: c.node.created_at,
                ownerId: c.node.owner.id,
                username: c.node.owner.username,
                profilePic: c.node.owner.profile_pic_url,
                profileUrl: `https://instagram.com/${c.node.owner.username}`,
            }));

            results.push({ postUrl: url, comments: extracted });

        } catch (err) {
            console.log(` Error scraping ${url}:`, err.message);
        }
    }

    await Actor.pushData(results);
    console.log(" Scraping completed!");
});

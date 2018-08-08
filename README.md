# Feed Me

## Medium Feed for Your Site
- Parameterised so you are in control
- Layout of embed designed for responsive grid

## Parameters
- feedURL: URL of feed;
- linkOutText: text of link for each post to post, e.g. "Read More";
- showImage: show a thumbnail image for each;
- openNewTab: open post in new tab;
- linkToMediumProfileText: text of button link to feed;
- postsCount: number of posts to show;
- maxWords: maximum number of words to show in the subtitle;
- showAuthor: show author of each post;
- showDate: show date of each post;
- maxImageHeight: maximum height of thumbnail image;
- numColumns: number of columns to divide markup into;
- element: id of element to embed feed within.

## Usage

### Settings

    <script>
        var feedMeSettings = {
            feedURL: 'https://medium.com/feed/publication-or-user/',
            linkOutText: 'Read more',
            showImage: true,
            openNewTab: true,
            linkToMediumProfileText: 'Your Feed on Medium',
            postsCount: 6,
            maxWords: 30,
            showAuthor: true,
            showDate: true,
            maxImageHeight: 450,
            numColumns: 3,
            element: 'feed-me-embed'
        };
    </script>
    
### Markup

#### Between Your Head Tags

Add the following...

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="js/feed-me.js"></script>
    
Plus the above Settings script.

#### Between Your Body Tags

Add `<div id="feed-me-embed"></div>` as per settings "element" parameter where you want the feed to appear.

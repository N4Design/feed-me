function abbrev(str, type, limit, separator, truncator) {
	if (type === 'c') {
		if (str.length <= limit) return str;
		return str.substr(0, str.lastIndexOf(separator, limit - 1)) + truncator;
	} else if (type === 'w') {
		var words = str.split(separator);
		if (words.length <= limit) return str;            
		var totalLength = 0;
		for (var i = 0; i < limit - 1; i++) {
			totalLength += words[i].length;
		}
		return str.substr(0, str.indexOf(words[limit], totalLength) - 1) + truncator;
	}
}

function titleCase(str) {
	return str.toLowerCase().split(' ').map(function(word) {
		return word.replace(word[0], word[0].toUpperCase());
	}).join(' ');
}

var feedMe = {
	initialize: function(feedMeSettings) {
		var data = {
			rss_url: feedMeSettings.feedURL
		};

		$.get('https://api.rss2json.com/v1/api.json', data, function(response) {
			if (response.status === 'ok') {

				var mediumURL = 'https://medium.com/';
				var hyperLink = document.createElement('a');
				hyperLink.href = response.feed.link;
				var mediumProfileURL = hyperLink.origin + hyperLink.pathname;
				var feedMeShowImage = true;
				var feedMePostsCount = 4;
				var feedMeLinkToMediumProfileText = 'Go to Feed';
				var feedMeLinkOutText = 'Read all articles';
				var feedMeTarget = '_parent';
				var feedMeWords = 20;
				var feedMeAuthor = '';
				var feedMeDate ='';
				var feedMeColumns = 3;
				var feedMeMaxImageHeight = 0;
				var feedMeColumnClasses = '';

				if(feedMeSettings.openNewTab === true) feedMeTarget = '_blank';

				if(feedMeSettings.linkOutText !== undefined) feedMeLinkOutText = feedMeSettings.linkOutText;

				if (feedMeSettings.linkToMediumProfileText !== undefined) feedMeLinkToMediumProfileText = feedMeSettings.linkToMediumProfileText;

				if (feedMeSettings.showImage !== undefined) feedMeShowImage = feedMeSettings.showImage;

				if (feedMeSettings.postsCount - 1 > 4) feedMePostsCount = feedMeSettings.postsCount - 1;
				if (feedMePostsCount > response.items.length) feedMePostsCount = response.items.length;

				if (! isNaN(feedMeSettings.maxImageHeight)) feedMeMaxImageHeight = feedMeSettings.maxImageHeight;

				if (! isNaN(feedMeSettings.postsCount)) feedMePostsCount = feedMeSettings.postsCount;

				if (! isNaN(feedMeSettings.maxWords)) feedMeWords = feedMeSettings.maxWords;

				if (! isNaN(feedMeSettings.numColumns)) feedMeColumns = feedMeSettings.numColumns;

				if (feedMeSettings.columnClasses !== undefined) feedMeColumnClasses = feedMeSettings.columnClasses;
				feedMeColumnClasses += ' col-md-' + 12 / feedMeColumns;

				var feedMePostsPerColumn = Math.ceil((feedMePostsCount) / feedMeColumns);

				var feedMeEmbed = document.getElementById(feedMeSettings.element);

				var feedMeLinkOut = document.createElement('div');
				feedMeLinkOut.className = 'feed-profile';
				feedMeLinkOut.innerHTML = '<a href="' + mediumProfileURL + '" target="'+feedMeTarget+'" class="feed-profile button">' + feedMeLinkToMediumProfileText+'</a>';

				var feedMeColumnDiv = document.createElement('div');
				feedMeColumnDiv.className = feedMeColumnClasses;
				var postNum = 1;

				$.each(response.items, function(key, post) {
					var feedMePostWrapperDiv = document.createElement('div');
					feedMePostWrapperDiv.className = 'feed-post-wrapper';
					var postTitle = post.title;
					if (feedMeSettings.capsTitle) postTitle = titleCase(postTitle);
					var postImage = post.thumbnail;

					var el = $('<div></div>');
					el.html(post.description);
					var postSubTitle = $('p', el).first().text();
					var words = postSubTitle.split(' ');
					if (words.length < feedMeWords) postSubTitle += ' <br/>' + $('p:eq(1)', el).text();
					postSubTitle = abbrev(postSubTitle, 'w', feedMeWords, ' ', '...');

					var hyperLink = document.createElement('a');
					hyperLink.href = post.link
					var postURL = hyperLink.origin + hyperLink.pathname;

					if (feedMeSettings.showAuthor) feedMeAuthor = post.author;
					if (feedMeSettings.showDate) feedMeDate = new Date(post.pubDate);

					if (feedMeShowImage) {
						var feedMePostImageHTML = '<a class="feed-post-image" ' + (feedMeMaxImageHeight === 0 ? '' : 'style="max-height: ' + feedMeMaxImageHeight + 'px;" ') + 'target="'+feedMeTarget+'" href="'+postURL+'"><img style="width: 100%" src="'+postImage+'"/></a>';
					}

					var feedMePostTitleHTML = '<h4 class="feed-post-title"><a href="'+postURL+'" target="'+feedMeTarget+'">'+postTitle+'</a></h4>';

					if (feedMeSettings.showAuthor || feedMeSettings.showDate) {
						var feedMeAuthorDateHTML = '<h5 class="feed-post-author-date">' + (feedMeSettings.showAuthor ? 'By <a href="' + mediumURL + '@' + feedMeAuthor + '" target="'+feedMeTarget+'">' + feedMeAuthor + '</a><br/>' : '') + (feedMeSettings.showDate ? 'On ' + feedMeDate.toDateString() : '') + '</h5>'
					}

					var feedMePostSubTitleHTML = '<p class="feed-post-sub-title">'+postSubTitle+'</p>';
					var feedPostReadMoreHTML = '<a class="feed-post-read-more" target="'+feedMeTarget+'" href="' + postURL + '">' + feedMeLinkOutText +'</a>';

					feedMePostWrapperDiv.innerHTML =  '<div class="feed-post">' + feedMePostImageHTML + feedMePostTitleHTML + feedMeAuthorDateHTML + feedMePostSubTitleHTML + feedPostReadMoreHTML + '</div>';

					if (postNum <= feedMePostsCount) {
						feedMeColumnDiv.appendChild(feedMePostWrapperDiv);
						if (postNum === feedMePostsPerColumn || postNum === feedMePostsCount) {
							feedMeEmbed.appendChild(feedMeColumnDiv);
							feedMeEmbed.appendChild(feedMeLinkOut);
							if (key + 1 === feedMePostsCount) return false;
							feedMeColumnDiv = document.createElement('div');
							feedMeColumnDiv.className = feedMeColumnClasses;
							postNum = 0;
						}
					}
					postNum += 1;
				});
			} else {
				console.log("rss2json received error " + response.status);
			}
		});

	}
}
feedMe.initialize(feedMeSettings);

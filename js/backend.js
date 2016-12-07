'use strict';
// Shortcuts to DOM Elements.
var messageForm = document.getElementById('message-form');
var messageInput = document.getElementById('new-post-message');
var titleInput = document.getElementById('new-post-title');
var locationInput = document.getElementById('new-post-location');
var priceInput = document.getElementById('new-post-price');
var signInButton = document.getElementById('sign-in-button');
var signOutButton = document.getElementById('sign-out-button');
var addPost = document.getElementById('add-post');
var addButton = document.getElementById('add');
var recentPostsSection = document.getElementById('recent-posts-list');
var userPostsSection = document.getElementById('user-posts-list');
var topPostsSection = document.getElementById('top-posts-list');
var locationSectionContainer = document.getElementById('location-posts-list');
var locationSection = document.getElementById('location-posts-list-content');
var filterSection = document.getElementById('location-filter-list');
var recentMenuButton = document.getElementById('menu-recent');
var myPostsMenuButton = document.getElementById('menu-my-posts');
var locationMenuButton = document.getElementById('menu-location-posts');
var topPostsMenuButton = document.getElementById('menu-top-posts');
var listeningFirebaseRefs = [];
var aboutMenuButton = document.getElementById('menu-about');
var aboutSection = document.getElementById('about');
var contactMenuButton = document.getElementById('menu-contact');
var contactSection = document.getElementById('contact');
var map;
var clickMarker
var clickLat;
var clickLng;
var locations = [];
var existTitle;
var infowindows = [];

function writeNewPost(uid, username, picture, title, body, location, lati, lng, price) {
	var postData = {
		author: username
		, uid: uid
		, title: title
		, body: body
		, location: location
		, lat: lati
		, long: lng
		, price: price
		, starCount: 0
		, authorPic: picture
	};
	// Get a key for a new Post.
	var newPostKey = firebase.database().ref().child('posts').push().key;
	// Write the new post's data simultaneously in the posts list and the user's post list.
	var updates = {};
	updates['/posts/' + newPostKey] = postData;
	updates['/user-posts/' + uid + '/' + newPostKey] = postData;
	return firebase.database().ref().update(updates);
};
// [END write_fan_out]
/**
 * Star/unstar post.
 */
// [START post_stars_transaction]
function toggleStar(postRef, uid) {
	postRef.transaction(function (post) {
		if (post) {
			if (post.stars && post.stars[uid]) {
				post.starCount--;
				post.stars[uid] = null;
			}
			else {
				post.starCount++;
				if (!post.stars) {
					post.stars = {};
				}
				post.stars[uid] = true;
			}
		}
		return post;
	});
}
// [END post_stars_transaction]
//close open infowindows
function CloseWindows() {
	for (var i = 0; i < infowindows.length; i++) {
		infowindows[i].close();
	}
}
//Function to display a snackbar notification
function showNotif(messageIn) {
	var notification = document.querySelector('.mdl-js-snackbar');
	notification.MaterialSnackbar.showSnackbar({
		message: messageIn
	});
}
//takes array of JSON locations and adds them to the map
function addMarker(locations) {
	for (var i = 0; i < locations.length; i++) {
		var latlong = new google.maps.LatLng(locations[i].placeLat, locations[i].placeLong);
		var marker = new google.maps.Marker({
			draggable: false
			, animation: google.maps.Animation.DROP
			, position: latlong
			, map: map
		});
		var content = "Location: " + locations[i].place + "<br>" + "<button class='mdl-button--raised mdl-button mdl-js-button mdl-js-ripple-effect' onclick=\'filterLocation(" + locations[i].placeLat + "," + locations[i].placeLong + ")\'>Filter By Location</button>";
		var infowindow = new google.maps.InfoWindow()
		google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
			return function () {
				CloseWindows();
				infowindow.setContent(content);
				infowindow.open(map, marker);
				infowindows.push(infowindow);
			};
		})(marker, content, infowindow));
	}
}
//Inititalises map by creating object then adds markers from array
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: 53.381145
			, lng: -6.592528
		}
		, styles: [
			{
				"elementType": "geometry"
				, "stylers": [
					{
						"color": "#242f3e"
      }
    ]
  }
			, {
				"elementType": "labels.text.fill"
				, "stylers": [
					{
						"color": "#746855"
      }
    ]
  }
			, {
				"elementType": "labels.text.stroke"
				, "stylers": [
					{
						"color": "#242f3e"
      }
    ]
  }
			, {
				"featureType": "administrative.locality"
				, "elementType": "labels.text.fill"
				, "stylers": [
					{
						"color": "#d59563"
      }
    ]
  }
			, {
				"featureType": "poi"
				, "elementType": "labels.text.fill"
				, "stylers": [
					{
						"color": "#d59563"
      }
    ]
  }
			, {
				"featureType": "poi.business"
				, "stylers": [
					{
						"visibility": "on"
      }
    ]
  }
			, {
				"featureType": "poi.park"
				, "elementType": "geometry"
				, "stylers": [
					{
						"color": "#263c3f"
      }
    ]
  }
			, {
				"featureType": "poi.park"
				, "elementType": "labels.text"
				, "stylers": [
					{
						"visibility": "on"
      }
    ]
  }
			, {
				"featureType": "poi.park"
				, "elementType": "labels.text.fill"
				, "stylers": [
					{
						"color": "#6b9a76"
      }
    ]
  }
			, {
				"featureType": "road"
				, "elementType": "geometry"
				, "stylers": [
					{
						"color": "#38414e"
      }
    ]
  }
			, {
				"featureType": "road"
				, "elementType": "geometry.stroke"
				, "stylers": [
					{
						"color": "#212a37"
      }
    ]
  }
			, {
				"featureType": "road"
				, "elementType": "labels.text.fill"
				, "stylers": [
					{
						"color": "#9ca5b3"
      }
    ]
  }
			, {
				"featureType": "road.highway"
				, "elementType": "geometry"
				, "stylers": [
					{
						"color": "#746855"
      }
    ]
  }
			, {
				"featureType": "road.highway"
				, "elementType": "geometry.stroke"
				, "stylers": [
					{
						"color": "#1f2835"
      }
    ]
  }
			, {
				"featureType": "road.highway"
				, "elementType": "labels.text.fill"
				, "stylers": [
					{
						"color": "#f3d19c"
      }
    ]
  }
			, {
				"featureType": "transit"
				, "elementType": "geometry"
				, "stylers": [
					{
						"color": "#2f3948"
      }
    ]
  }
			, {
				"featureType": "transit.station"
				, "elementType": "labels.text.fill"
				, "stylers": [
					{
						"color": "#d59563"
      }
    ]
  }
			, {
				"featureType": "water"
				, "elementType": "geometry"
				, "stylers": [
					{
						"color": "#17263c"
      }
    ]
  }
			, {
				"featureType": "water"
				, "elementType": "labels.text.fill"
				, "stylers": [
					{
						"color": "#515c6d"
      }
    ]
  }
			, {
				"featureType": "water"
				, "elementType": "labels.text.stroke"
				, "stylers": [
					{
						"color": "#17263c"
      }
    ]
  }
]
		, zoom: 15
	});
	addMarker(locations); //adds marker to centre of map as test
};
//function to load deals only from a specific place
function filterLocation(slat, slong) {
	filterSection.getElementsByClassName('posts-container')[0].innerHTML = '';
	filterSection.style.display = '';
	var searchRef = firebase.database().ref('posts').orderByChild('lat').equalTo(slat).once('value', function (snap) {
		snap.forEach(function (data) {
			if (data.val().long == slong) {
				var author = data.val().author || 'Anonymous';
				var containerElement = filterSection.getElementsByClassName('posts-container')[0];
				containerElement.insertBefore(createPostElement(data.key, data.val().title, data.val().body, data.val().location, data.val().price, author, data.val().uid, data.val().authorPic), containerElement.firstChild);
			}
		});
	});
}
//Function to keep an array of active locations updated
function updateLocations(locationPostsRef) {
	locations = [];
	locationPostsRef.on("value", function (snap) {
		snap.forEach(function (data) {
			var markerExist = false;
			var tempLoc = {
				place: data.val().location
				, placeLat: data.val().lat
				, placeLong: data.val().long
			};
			markerExist = false;
			for (var i = 0; i < (locations.length && !markerExist); i++) {
				if ((locations[i].placeLat == tempLoc.placeLat) && (locations[i].placeLong == tempLoc.placeLong)) {
					markerExist = true;
				}
			}
			if (!markerExist) locations.push(tempLoc);
		});
	});
}
/**
 * Creates a post element.
 */
function createPostElement(postId, title, text, location, price, author, authorId, authorPic) {
	//if logged in makes auth related elements too
	if (currentUID != undefined) {
		var uid = firebase.auth().currentUser.uid;
		var html = '<div class="post-' + postId + ' mdl-cell mdl-cell--12-col ' + 'mdl-cell--4-col-tablet mdl-cell--6-col-phone mdl-cell--4-col-desktop mdl-grid mdl-grid--no-spacing">' + '<div class="mdl-card mdl-shadow--2dp">' + '<div class="mdl-card__title">' + '<h4 class="mdl-card__title-text"></h4>' + '</div>' + '<div class="header">' + '<div class="avatar"></div>' + '<div class="username mdl-color-text--black"></div>' + '<span class="star">' + '<div class="not-starred material-icons">star_border</div>' + '<div class="starred material-icons">star</div>' + '<div class="star-count" id="StarText">0</div>' + '</span>' + '</div>' + '<h5>Deal Info</h5>' + '<div class="text"></div>' + '<h5>Deal Location</h5>' + '<div class="location"></div>' + '<h5>Deal Pricing</h5>' + '<div class="price"></div>' + '<h5>Comments</h5>' + '<div class="comments-container"></div>' + '<form class="add-comment" action="#">' + '<div class="mdl-textfield mdl-js-textfield">' + '<input class="mdl-textfield__input new-comment" type="text">' + '<label class="mdl-textfield__label">Add Comment...</label>' + '</div>' + '</form>' + '</div>' + '</div>' + '</div>';
		// Create the DOM element from the HTML.
	}
	else {
		var html = '<div class="post-' + postId + ' mdl-cell mdl-cell--12-col ' + 'mdl-cell--4-col-tablet mdl-cell--8-col-phone mdl-cell--4-col-desktop mdl-grid mdl-grid--no-spacing">' + '<div class="mdl-card mdl-shadow--2dp">' + '<div class="mdl-card__title">' + '<h4 class="mdl-card__title-text"></h4>' + '</div>' + '<div class="header">' + '<div>' + '<div class="avatar"></div>' + '<div class="username mdl-color-text--black"></div>' + '</div>' + '</div>' + '<span class="star">' + '<div class="not-starred material-icons">star_border</div>' + '<div class="star-count">0</div>' + '</span>' + '<h5>Deal Info</h5>' + '<div class="text"></div>' + '<h5>Deal Location</h5>' + '<div class="location"></div>' + '<h5>Deal Pricing</h5>' + '<div class="price"></div>' + '<h5>Comments</h5>' + '<div class="comments-container"></div>' + '<form class="add-comment" action="#">' + '<div class="mdl-textfield mdl-js-textfield">' + '<input class="mdl-textfield__input new-comment" type="text">' + '<label class="mdl-textfield__label">Add Comment...</label>' + '</div>' + '</form>' + '</div>' + '</div>';
		// Create the DOM element from the HTML.
	}
	var div = document.createElement('div');
	div.innerHTML = html;
	var postElement = div.firstChild;
	if (componentHandler) {
		componentHandler.upgradeElements(postElement.getElementsByClassName('mdl-textfield')[0]);
	}
	var addCommentForm = postElement.getElementsByClassName('add-comment')[0];
	var commentInput = postElement.getElementsByClassName('new-comment')[0];
	if (currentUID != undefined) var star = postElement.getElementsByClassName('starred')[0];
	var unStar = postElement.getElementsByClassName('not-starred')[0];
	// Set values.
	postElement.getElementsByClassName('location')[0].innerText = location;
	postElement.getElementsByClassName('price')[0].innerText = price;
	postElement.getElementsByClassName('text')[0].innerText = text;
	postElement.getElementsByClassName('mdl-card__title-text')[0].innerText = title;
	postElement.getElementsByClassName('username')[0].innerText = author || 'Anonymous';
	postElement.getElementsByClassName('avatar')[0].style.backgroundImage = 'url("' + (authorPic || './silhouette.jpg') + '")';
	// Listen for comments.
	// [START child_event_listener_recycler]
	var commentsRef = firebase.database().ref('post-comments/' + postId);
	commentsRef.on('child_added', function (data) {
		addCommentElement(postElement, data.key, data.val().text, data.val().author);
	});
	commentsRef.on('child_changed', function (data) {
		setCommentValues(postElement, data.key, data.val().text, data.val().author);
	});
	commentsRef.on('child_removed', function (data) {
		deleteComment(postElement, data.key);
	});
	// [END child_event_listener_recycler]
	// Listen for likes counts.
	// [START post_value_event_listener]
	var starCountRef = firebase.database().ref('posts/' + postId + '/starCount');
	starCountRef.on('value', function (snapshot) {
		updateStarCount(postElement, snapshot.val());
	});
	// [END post_value_event_listener]
	// Listen for the starred status.
	//if logged in makes auth related elements too
	if (currentUID != undefined) {
		var starredStatusRef = firebase.database().ref('posts/' + postId + '/stars/' + uid)
		starredStatusRef.on('value', function (snapshot) {
			updateStarredByCurrentUser(postElement, snapshot.val());
		});
		// Keep track of all Firebase reference on which we are listening.
		listeningFirebaseRefs.push(starredStatusRef);
	}
	// Keep track of all Firebase reference on which we are listening.
	listeningFirebaseRefs.push(commentsRef);
	listeningFirebaseRefs.push(starCountRef);
	// Create new comment.
	addCommentForm.onsubmit = function (e) {
		e.preventDefault();
		//if logged in makes auth related elements too
		if (currentUID != undefined) {
			createNewComment(postId, firebase.auth().currentUser.displayName, uid, commentInput.value);
			commentInput.value = '';
			commentInput.parentElement.MaterialTextfield.boundUpdateClassesHandler();
		}
		//not auth
		else {
			showNotif("Please login to comment.");
		}
	};
	// Bind starring action.
	var onStarClicked = function () {
		if (currentUID != undefined) {
			var globalPostRef = firebase.database().ref('/posts/' + postId);
			var userPostRef = firebase.database().ref('/user-posts/' + authorId + '/' + postId);
			toggleStar(globalPostRef, uid);
			toggleStar(userPostRef, uid);
		}
		else showNotif("Please login to vote.");
	};
	unStar.onclick = onStarClicked;
	//if logged in makes auth related elements too
	if (currentUID != undefined) star.onclick = onStarClicked;
	return postElement;
}
/**
 * Writes a new comment for the given post.
 */
function createNewComment(postId, username, uid, text) {
	firebase.database().ref('post-comments/' + postId).push({
		text: text
		, author: username
		, uid: uid
	});
}
/**
 * Updates the starred status of the post.
 */
function updateStarredByCurrentUser(postElement, starred) {
	if (starred) {
		postElement.getElementsByClassName('starred')[0].style.display = 'inline-block';
		postElement.getElementsByClassName('not-starred')[0].style.display = 'none';
	}
	else {
		postElement.getElementsByClassName('starred')[0].style.display = 'none';
		postElement.getElementsByClassName('not-starred')[0].style.display = 'inline-block';
	}
}
/**
 * Updates the number of stars displayed for a post.
 */
function updateStarCount(postElement, nbStart) {
	postElement.getElementsByClassName('star-count')[0].innerText = nbStart;
}
/**
 * Creates a comment element and adds it to the given postElement.
 */
function addCommentElement(postElement, id, text, author) {
	var comment = document.createElement('div');
	comment.classList.add('comment-' + id);
	comment.innerHTML = '<span class="username"></span><span class="comment"></span>';
	comment.getElementsByClassName('comment')[0].innerText = text;
	comment.getElementsByClassName('username')[0].innerText = author || 'Anonymous';
	var commentsContainer = postElement.getElementsByClassName('comments-container')[0];
	commentsContainer.appendChild(comment);
}
/**
 * Sets the comment's values in the given postElement.
 */
function setCommentValues(postElement, id, text, author) {
	var comment = postElement.getElementsByClassName('comment-' + id)[0];
	comment.getElementsByClassName('comment')[0].innerText = text;
	comment.getElementsByClassName('fp-username')[0].innerText = author;
}
/**
 * Deletes the comment of the given ID in the given postElement.
 */
function deleteComment(postElement, id) {
	var comment = postElement.getElementsByClassName('comment-' + id)[0];
	comment.parentElement.removeChild(comment);
}
/**
 * Starts listening for new posts and populates posts lists.
 */
function startDatabaseQueries() {
	// [START my_top_posts_query]
	//if logged in makes auth related elements too
	if (currentUID != undefined) {
		var myUserId = firebase.auth().currentUser.uid;
		var userPostsRef = firebase.database().ref('user-posts/' + myUserId);
	}
	var topPostsRef = firebase.database().ref('posts').orderByChild('starCount');
	var locationPostsRef = firebase.database().ref('posts').orderByChild('location');
	// [END my_top_posts_query]
	// [START recent_posts_query]
	var recentPostsRef = firebase.database().ref('posts').limitToLast(100);
	// [END recent_posts_query]
	function fetchPosts(postsRef, sectionElement) {
		postsRef.on('child_added', function (data) {
			var author = data.val().author || 'Anonymous';
			var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
			containerElement.insertBefore(createPostElement(data.key, data.val().title, data.val().body, data.val().location, data.val().price, author, data.val().uid, data.val().authorPic), containerElement.firstChild);
		});
		postsRef.on('child_changed', function (data) {
			var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
			var postElement = containerElement.getElementsByClassName('post-' + data.key)[0];
			postElement.getElementsByClassName('mdl-card__title-text')[0].innerText = data.val().title;
			postElement.getElementsByClassName('username')[0].innerText = data.val().author;
			postElement.getElementsByClassName('location')[0].innerText = data.val().location;
			postElement.getElementsByClassName('price')[0].innerText = data.val().price;
			postElement.getElementsByClassName('text')[0].innerText = data.val().body;
			postElement.getElementsByClassName('star-count')[0].innerText = data.val().starCount;
		});
		postsRef.on('child_removed', function (data) {
			var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
			var post = containerElement.getElementsByClassName('post-' + data.key)[0];
			post.parentElement.removeChild(post);
		});
	};
	// Fetching and displaying all posts of each sections.
	fetchPosts(topPostsRef, topPostsSection);
	fetchPosts(locationPostsRef, locationSection);
	fetchPosts(recentPostsRef, recentPostsSection);
	//if logged in makes auth related elements too
	if (currentUID != undefined) fetchPosts(userPostsRef, userPostsSection);
	updateLocations(locationPostsRef);
	// Keep track of all Firebase refs we are listening to.
	listeningFirebaseRefs.push(topPostsRef);
	listeningFirebaseRefs.push(recentPostsRef);
	//if logged in makes auth related elements too
	if (currentUID != undefined) listeningFirebaseRefs.push(userPostsRef);
	listeningFirebaseRefs.push(locationPostsRef);
}
/**
 * Writes the user's data to the database.
 */
// [START basic_write]
function writeUserData(userId, name, email, imageUrl) {
	firebase.database().ref('users/' + userId).set({
		username: name
		, email: email
		, profile_picture: imageUrl
	});
}
// [END basic_write]
/**
 * Cleanups the UI and removes all Firebase listeners.
 */
function cleanupUi() {
	// Remove all previously displayed posts.
	topPostsSection.getElementsByClassName('posts-container')[0].innerHTML = '';
	filterSection.getElementsByClassName('posts-container')[0].innerHTML = '';
	filterSection.style.display = 'none';
	recentPostsSection.getElementsByClassName('posts-container')[0].innerHTML = '';
	userPostsSection.getElementsByClassName('posts-container')[0].innerHTML = '';
	locationSection.getElementsByClassName('posts-container')[0].innerHTML = '';
	// Stop all currently listening Firebase listeners.
	listeningFirebaseRefs.forEach(function (ref) {
		ref.off();
	});
	listeningFirebaseRefs = [];
}
/**
 * The ID of the currently signed-in User. We keep track of this to detect Auth state change events that are just
 * programmatic token refresh but not a User status change.
 */
var currentUID;
/**
 * Triggers every time there is a change in the Firebase auth state (i.e. user signed-in or user signed out).
 */
function onAuthStateChanged(user) {
	// We ignore token refresh events.
	if (user && currentUID === user.uid) {
		return;
	}
	cleanupUi();
	if (user) {
		signInButton.style.display = 'none';
		signOutButton.style.display = '';
		myPostsMenuButton.style.display = '';
		addButton.style.display = '';
		currentUID = user.uid;
		writeUserData(user.uid, user.displayName, user.email, user.photoURL);
		startDatabaseQueries();
	}
	else {
		// Display the ui so user can sign-in.
		myPostsMenuButton.style.display = 'none';
		addButton.style.display = 'none';
		signOutButton.style.display = 'none';
		signInButton.style.display = '';
		currentUID = undefined;
		startDatabaseQueries();
		showNotif("Please login to post, vote or comment.");
	}
}
/**
 * Creates a new post for the current user.
 */
function newPostForCurrentUser(title, text, location, lati, long, price) {
	// [START single_value_read]
	var userId = firebase.auth().currentUser.uid;
	return firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
		var username = snapshot.val().username;
		// [START_EXCLUDE]
		return writeNewPost(firebase.auth().currentUser.uid, username, firebase.auth().currentUser.photoURL, title, text, location, lati, long, price);
		// [END_EXCLUDE]
	});
	// [END single_value_read]
}

function showSection(sectionElement, buttonElement) {
	recentPostsSection.style.display = 'none';
	userPostsSection.style.display = 'none';
	topPostsSection.style.display = 'none';
	locationSectionContainer.style.display = 'none';
	filterSection.style.display = 'none';
	aboutSection.style.display = 'none';
	contactSection.style.display = 'none';
	addPost.style.display = 'none';
	recentMenuButton.classList.remove('is-active');
	myPostsMenuButton.classList.remove('is-active');
	topPostsMenuButton.classList.remove('is-active');
	locationMenuButton.classList.remove('is-active');
	aboutMenuButton.classList.remove('is-active');
	contactMenuButton.classList.remove('is-active');
	if (sectionElement) {
		sectionElement.style.display = 'block';
	}
	if (buttonElement) {
		buttonElement.classList.add('is-active');
	}
}
// Bindings on load.
window.addEventListener('load', function () {
	// Bind Sign in button.
	signInButton.addEventListener('click', function () {
		var provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().signInWithPopup(provider);
	});
	// Bind Sign out button.
	signOutButton.addEventListener('click', function () {
		firebase.auth().signOut();
	});
	// Listen for auth state changes
	firebase.auth().onAuthStateChanged(onAuthStateChanged);
	// Saves message on form submit.
	messageForm.onsubmit = function (e) {
		e.preventDefault();
		var text = messageInput.value;
		var title = titleInput.value;
		var locate = locationInput.value;
		var prices = priceInput.value;
		if (text && title && locate && prices && clickLat != '' && clickLng != '') {
			newPostForCurrentUser(title, text, locate, clickLat, clickLng, prices).then(function () {
				myPostsMenuButton.click();
			});
			messageInput.value = '';
			titleInput.value = '';
			locationInput.value = '';
			priceInput.value = '';
			clickLat = '';
			clickLng = ''
		}
		else {
			showNotif("Error with submission. Please fill out all fields and click a location.");
		}
	};
	// Bind menu buttons.
	recentMenuButton.onclick = function () {
		showSection(recentPostsSection, recentMenuButton);
		showNotif("Recent Posts");
	};
	myPostsMenuButton.onclick = function () {
		showSection(userPostsSection, myPostsMenuButton);
		showNotif("Your Posts");
	};
	topPostsMenuButton.onclick = function () {
		showSection(topPostsSection, topPostsMenuButton);
		showNotif("Top Posts");
	};
	locationMenuButton.onclick = function () {
		showSection(locationSectionContainer, locationMenuButton);
		showNotif("Location Posts");
		initMap();
	};
	aboutMenuButton.onclick = function () {
		showSection(aboutSection, aboutMenuButton);
		showNotif("About");
	};
	contactMenuButton.onclick = function () {
		showSection(contactSection, contactMenuButton);
		showNotif("Contact");
	};
	addButton.onclick = function () {
		showSection(addPost);
		messageInput.value = '';
		titleInput.value = '';
		locationInput.value = '';
		document.getElementById("locationIn").style.display = 'none';
		priceInput.value = '';
		clickLat = '';
		clickLng = '';
		existTitle = '';
		var myStyles = [
			{
				"elementType": "geometry"
				, "stylers": [
					{
						"color": "#242f3e"
      }
    ]
  }
			, {
				"elementType": "labels.text.fill"
				, "stylers": [
					{
						"color": "#746855"
      }
    ]
  }
			, {
				"elementType": "labels.text.stroke"
				, "stylers": [
					{
						"color": "#242f3e"
      }
    ]
  }
			, {
				"featureType": "administrative.locality"
				, "elementType": "labels.text.fill"
				, "stylers": [
					{
						"color": "#d59563"
      }
    ]
  }
			, {
				"featureType": "poi"
				, "elementType": "labels.text.fill"
				, "stylers": [
					{
						"color": "#d59563"
      }
    ]
  }
			, {
				"featureType": "poi.business"
				, "stylers": [
					{
						"visibility": "off"
      }
    ]
  }
			, {
				"featureType": "poi.park"
				, "elementType": "geometry"
				, "stylers": [
					{
						"color": "#263c3f"
      }
    ]
  }
			, {
				"featureType": "poi.park"
				, "elementType": "labels.text"
				, "stylers": [
					{
						"visibility": "off"
      }
    ]
  }
			, {
				"featureType": "poi.park"
				, "elementType": "labels.text.fill"
				, "stylers": [
					{
						"color": "#6b9a76"
      }
    ]
  }
			, {
				"featureType": "road"
				, "elementType": "geometry"
				, "stylers": [
					{
						"color": "#38414e"
      }
    ]
  }
			, {
				"featureType": "road"
				, "elementType": "geometry.stroke"
				, "stylers": [
					{
						"color": "#212a37"
      }
    ]
  }
			, {
				"featureType": "road"
				, "elementType": "labels.text.fill"
				, "stylers": [
					{
						"color": "#9ca5b3"
      }
    ]
  }
			, {
				"featureType": "road.highway"
				, "elementType": "geometry"
				, "stylers": [
					{
						"color": "#746855"
      }
    ]
  }
			, {
				"featureType": "road.highway"
				, "elementType": "geometry.stroke"
				, "stylers": [
					{
						"color": "#1f2835"
      }
    ]
  }
			, {
				"featureType": "road.highway"
				, "elementType": "labels.text.fill"
				, "stylers": [
					{
						"color": "#f3d19c"
      }
    ]
  }
			, {
				"featureType": "transit"
				, "elementType": "geometry"
				, "stylers": [
					{
						"color": "#2f3948"
      }
    ]
  }
			, {
				"featureType": "transit.station"
				, "elementType": "labels.text.fill"
				, "stylers": [
					{
						"color": "#d59563"
      }
    ]
  }
			, {
				"featureType": "water"
				, "elementType": "geometry"
				, "stylers": [
					{
						"color": "#17263c"
      }
    ]
  }
			, {
				"featureType": "water"
				, "elementType": "labels.text.fill"
				, "stylers": [
					{
						"color": "#515c6d"
      }
    ]
  }
			, {
				"featureType": "water"
				, "elementType": "labels.text.stroke"
				, "stylers": [
					{
						"color": "#17263c"
      }
    ]
  }
]
		var mapOptions = {
			zoom: 15
			, center: {
				lat: 53.381145
				, lng: -6.592528
			}
			, mapTypeControl: false
			, mapTypeId: google.maps.MapTypeId.ROADMAP
			, styles: myStyles
		};
		map = new google.maps.Map(document.getElementById("mapContainer"), mapOptions);
		var strictBounds = new google.maps.LatLngBounds(new google.maps.LatLng(53.374050, -6.608216), new google.maps.LatLng(53.390361, -6.585100));
		google.maps.event.addListener(map, 'dragend', function () {
			if (strictBounds.contains(map.getCenter())) return;
			var boundspos = map.getCenter()
				, x = boundspos.lng()
				, y = boundspos.lat()
				, maxX = strictBounds.getNorthEast().lng()
				, maxY = strictBounds.getNorthEast().lat()
				, minX = strictBounds.getSouthWest().lng()
				, minY = strictBounds.getSouthWest().lat();
			if (x < minX) x = minX;
			if (x > maxX) x = maxX;
			if (y < minY) y = minY;
			if (y > maxY) y = maxY;
			map.setCenter(new google.maps.LatLng(y, x));
		});
		for (var i = 0; i < locations.length; i++) {
			var latlong = new google.maps.LatLng(locations[i].placeLat, locations[i].placeLong);
			var marker = new google.maps.Marker({
				draggable: false
				, animation: google.maps.Animation.DROP
				, position: latlong
				, map: map
				, title: locations[i].place
				, label: {
					color: 'white'
					, fontWeight: 'bold'
					, text: locations[i].place
				, }
				, icon: {
					labelOrigin: new google.maps.Point(11, 50)
					, url: 'marker_red.png'
					, size: new google.maps.Size(22, 40)
					, origin: new google.maps.Point(0, 0)
					, anchor: new google.maps.Point(11, 40)
				, }
			});
			google.maps.event.addListener(marker, 'click', (function (marker) {
				return function () {
					clickLat = marker.getPosition().lat();
					clickLng = marker.getPosition().lng();
					document.forms['message-form'].elements['new-post-location'].value = marker.getTitle();
					document.getElementById("locationIn").style.display = 'none';
					clickMarker.setMap(null);
				};
			})(marker));
		}
		google.maps.event.addListener(map, 'click', function (event) {
			placeMarker(event.latLng);
			clickLat = event.latLng.lat();
			clickLng = event.latLng.lng();
			document.getElementById("locationIn").style.display = '';
			locationInput.value = '';
		});

		function placeMarker(location) {
			if (clickMarker) {
				clickMarker.setMap(map);
				clickMarker.setPosition(location);
			}
			else {
				clickMarker = new google.maps.Marker({
					position: location
					, map: map
				});
			}
		}
	};
	recentMenuButton.onclick();
}, false);
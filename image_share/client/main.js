import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Router.configure({
	layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  	this.render('navbar', {
  		to: 'navbar'
  	});
  	this.render('welcome', {
  		to: 'main'
  	});
});

Router.route('/images', function () {
  	this.render('navbar', {
  		to: 'navbar'
  	});
  	this.render('images', {
  		to: 'main'
  	});
});

Router.route('/image/:_id', function () {
  	this.render('navbar', {
  		to: 'navbar'
  	});
  	this.render('image', {
  		to: 'main',
  		data: function () {
  			return Images.findOne({_id: this.params._id});
  		}
  	});
});

Accounts.ui.config({
	passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Session.set("imageLimit", 8);
lastScrollTop = 0;
$(window).scroll(function (event) {
	//console.log('hi');
	//detect window bottom
	if($(window).scrollTop() + $(window).height() > $(document).height() - 100){
		var scrollTop = $(this).scrollTop();
		//see if we are going down
		if(scrollTop > lastScrollTop){
			// Heading downwards
			Session.set("imageLimit", Session.get("imageLimit") + 4);
		}
		else{

		}
		lastScrollTop = scrollTop;

	}



})

Template.images.helpers({
	images: function () {
		if (Session.get('userFilter')) {
			return Images.find({createdBy: Session.get('userFilter')}, {'sort': {createdOn: -1, rating: -1}, 'limit': Session.get("imageLimit")});
		} else {
			return Images.find({}, {'sort': {createdOn: -1, rating: -1}, 'limit': Session.get("imageLimit")});
		}
	},
	filterImage: function () {
		if (Session.get('userFilter')) {
			return true;
		} else {
			return false;
		}
	},
	getUser: function (user_id) {
		var user = Meteor.users.findOne({_id:user_id});
		if(user){
			return user.username;
		}
		else{
			return 'anon';
		}
	},
	getFilterUsername: function () {
		if (Session.get('userFilter')) {
			var user = Meteor.users.findOne({_id:Session.get("userFilter")});
			return user.username;
		} else {
			return false;
		}

	}
});

Template.welcome.helpers({
	username: function () {
		if(Meteor.user()){
			//return Meteor.user().emails[0].address;
			return Meteor.user().username;
		}
		else{
			return 'anonmous internet user';
		}
	}
});

Template.images.events({	
	'click .js-image': function (event) {
		//alert('Hello!!');
 		//console.log(event);
 		// $(event.target).css("width","50px") it will set the width of the image to 50px when user clicks on it.
 	},
 	'click .js-del-image': function (event) {
 		var image_id = this._id;
 		console.log(image_id);
 		$("#"+image_id).hide('slow', function () {
 			Images.remove({'_id': image_id});
 		})
 		
 	},
 	'click .js-rate-image': function (event) {
 		var rating = $(event.currentTarget).data("userrating"); 
 		console.log(rating);
 		var image_id = this.id;
 		console.log(image_id);

 		Images.update({ _id: image_id},{ $set: {
 		 			rating: rating
 		 		}});
 	},
 	'click .js-show-image-form':function (event) {
 		$('#add_image_form').modal('show');
 	},
 	'click .js-set-image-filter': function (event) {
 		Session.set("userFilter", this.createdBy);
 	},
 	'click .js-unset-image-filter': function (event) {
 		Session.set("userFilter", undefined);
 	}
 });

Template.add_image_form.events({
	'submit .js-add-image': function (event) {
		var img_src, img_alt;
		img_src = event.target.img_src.value;
		img_alt = event.target.img_alt.value;
		console.log('img_src: '+ img_src + ' alt: ' + img_alt);
		if(Meteor.user()){
			Images.insert({
				img_src: img_src,
				img_alt: img_alt,
				createdOn: new Date(),
				createdBy: Meteor.user()._id,
				rating: 0
			});
		}
		$('#add_image_form').modal('hide');
		return false;
	}
})
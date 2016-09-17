Images = new Mongo.Collection('images');
console.log(Images.find().count());


Images.allow({
	insert: function (userId, doc) {
		if(Meteor.user()){
			if(userId == doc.createdBy){
				return true;
			}
			else{
				return false;
			}
		}
		else{
			return false;
		}
	},
	remove: function (userId, doc) {
		return true;
	}
})

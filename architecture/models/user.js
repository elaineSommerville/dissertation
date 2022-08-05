class User {
  constructor(
    id,
    name,
    age,
    avatar,
    hometown,
    bio,
    buildingsVisitedGenre,
    likedBuildings,
    myStories,
    myPictures
  ) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.avatar = avatar;
    this.hometown = hometown;
    this.bio = bio;
    this.buildingsVisitedGenre = buildingsVisitedGenre;
    this.likedBuildings = likedBuildings;
    this.myStories = myStories;
    this.myPictures = myPictures;
  }
}
export default User;

// https://www.sanity.io/docs/how-queries-work

export const getUserQuery = (userId) => {
  return `*[_type == 'user' && _id == '${userId}']`;
};

export const getPinsByCategoryQuery = (categoryId) => {
  return `*[_type=='pin' && category == '${categoryId}']`;
};

export const searchQuery = (searchTerm) => {
  const query = `*[_type == 'pin' && title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}*']{
    image {
      asset -> {
        url
      }
    },
    _id, 
    src,
    postedBy -> {
      _id,
      userName,
      image
    },
    save[] {
      _key,
      postedBy -> {
        _id,
        userName,
        image
      }
    }
  }`;
  return query;
};

export const feedQuery = `*[_type == 'pin'] | order(_createdAt desc){
  image {
    asset -> {
      url
    }
  },
  _id, 
  src,
  postedBy -> {
    _id,
    userName,
    image
  },
  save[] {
    _key,
    postedBy -> {
      _id,
      userName,
      image
    }
  }
}`;

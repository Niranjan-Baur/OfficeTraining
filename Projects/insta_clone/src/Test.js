const a = [
  { likeId: 1, userId: 6, postId: 23 },

  { likeId: 2, userId: 6, postId: 22 },

  { likeId: 3, userId: 22, postId: 21 },

  { likeId: 4, userId: 6, postId: 20 },

  { likeId: 5, userId: 6, postId: 23 },

  { likeId: 6, userId: 6, postId: 23 },

  { likeId: 7, userId: 6, postId: 22 },

  { likeId: 8, userId: 6, postId: 23 },

  { likeId: 9, userId: 6, postId: 22 },

  { likeId: 10, userId: 6, postId: 23 },
];

const b = a.find((m)=>{
    return m.userId === 6 && m.postId === 23
})

console.log(b);
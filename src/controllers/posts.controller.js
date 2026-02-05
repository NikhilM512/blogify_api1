

const getAllPosts = (req,res) => {

    let sortBy = req.query.sortBy || 'id';
    let limit =  parseInt(req.query.limit)|| 1;

    let posts = [
    { id: 2, title: 'My Second Post', date: '2023-10-26', views:222 },
    { id: 1, title: 'My First Post', date: '2023-10-25',views:223 }
  ];

    if(sortBy=='date'){
        posts.sort((a,b)=>new Date(a.date) - new Date(b.date));
    }

    if(sortBy=='id'){
        posts.sort((a,b)=>a.id - b.id);
    }

    if(sortBy=='views'){
        posts.sort((a,b)=>b.views - a.views)
    }

    if(limit){
        posts = posts.slice(0,limit);
    }


    res.json({ posts });
}


module.exports = {getAllPosts}

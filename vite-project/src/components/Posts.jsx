import React from 'react'
import { toast } from 'react-toastify';

const Posts = () => {

const handleSubmit = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/posts',{
        method:"POST",
        body:JSON.stringify({content:"abc"}),
        headers:{'content-type':'application/json'}
    });
    const data = await response.json();
    console.log(response.status)
    if (!response.ok) {
        if(response.status==404){
            throw new Error("Post not Found!");
        }else{
            throw new Error(data.error.message);
        }
    }
    toast.success('Post created successfully!');
  } catch (error) {
    toast.error(error.message);
  }
};
    


  return (
    <>
    <div>Posts</div>
    <button onClick={handleSubmit}>Create Post</button>
    </>
  )
}

export default Posts
import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";


 export const  createOrUpdatePost = async (post)=>{
    try{
        //upload image
        if(post.file && typeof post.file == 'object'){
            let isImage =post?.file?.type == 'image';
            let folderName = isImage? 'postImage': 'postVideos';
            let fileResult = await uploadFile(folderName,post?.file?.uri, isImage);
            if(fileResult.success) post.file=fileResult.data;
            else{
                return fileResult;
            }

        }
        const {data,error} =await supabase
        .from('posts')
        .upsert(post)
        .select()
        .single();
        if(error){
            console.log('createPost error:',error);
        return {success: false, msg:'Cloud not create your post'};
        }
        return {success:true,data:data};
    }catch(error){
        console.log('createPost error:',error);
        return {success: false, msg:'Cloud not create your post'};
    }
 }


 export const  fetchPosts = async (limit=10,userid)=>{
    try{
        if(userid){
            
        const {data,error}= await supabase
        .from('posts')
        .select(`*,
           user: users (id,name,image),
           postLikes (*),
           comments (count)
        `)
        .order('created_at',{ascending:false})
        .eq('userid',userid)
        .limit(limit);
        if(error){
            console.log('fetchPost error:',error);
            return {success: false, msg:'Cloud not fetch the post'};
        }
        return {success: true, data:data};

        }else{
            
        const {data,error}= await supabase
        .from('posts')
        .select(`*,
           user: users (id,name,image),
           postLikes (*),
           comments (count)
        `)
        .order('created_at',{ascending:false})
        .limit(limit);
        if(error){
            console.log('fetchPost error:',error);
            return {success: false, msg:'Cloud not fetch the post'};
        }
        return {success: true, data:data};

        }
        
       
    }catch(error){
        console.log('fetchPost error:',error);
        return {success: false, msg:'Cloud not fetch the post'};
    }
 }

 export const  fetchPostDetails = async (postid)=>{
    try{
        const {data,error}= await supabase
        .from('posts')
        .select(`*,
           user: users (id,name,image),
           postLikes (*),
           comments (*, user: users(id,name,image))
        `)
        .eq('id',postid)
        .order("created_at",{ascending:false,foreignTable:'comments'})
        .single();
        if(error){
            console.log('fetchPostDetails error:',error);
            return {success: false, msg:'Cloud not fetch the post'};
        }
        return {success: true, data:data};
        
       
    }catch(error){
        console.log('fetchPostDetails:',error);
        return {success: false, msg:'Cloud not fetch the post'};
    }
 }


 export const  createPostLike = async (postLike)=>{
    try{
        const {data,error} = await supabase
        .from('postLikes')
        .insert(postLike)
        .select()
        .single();

        if(error){
            console.log('postLike error:',error);
            return {success: false, msg:'Cloud not like the post'};
        }
        return {success: true, data:data};
        
       
    }catch(error){
        console.log('postLike error:',error);
        return {success: false, msg:'Cloud not like the post'};
    }
 }


 export const  removePostLike = async (postid,userid)=>{
    try{
        const {data,error} = await supabase
        .from('postLikes')
        .delete()
        .eq('userid',userid)
        .eq('postid',postid)
        

        if(error){
            console.log('postLike error:',error);
            return {success: false, msg:'Cloud not remove the post like'};
        }
        return {success: true};
        
       
    }catch(error){
        console.log('postLike error:',error);
        return {success: false, msg:'Cloud not remove the post like'};
    }
 }

 export const  removeComment = async (commentid)=>{
    try{
        const {data,error} = await supabase
        .from('comments')
        .delete()
        .eq('id',commentid)
        
        

        if(error){
            console.log('removeComment error:',error);
            return {success: false, msg:'Cloud not remove the comment'};
        }
        return {success: true, data:{commentid}};
        
       
    }catch(error){
        console.log('removeComment error:',error);
        return {success: false, msg:'Cloud not remove the comment'};
    }
 }

 export const  removePost = async (postid)=>{
    try{
        const {data,error} = await supabase
        .from('posts')
        .delete()
        .eq('id',postid)
        
        

        if(error){
            console.log('removePost error:',error);
            return {success: false, msg:'Cloud not remove the post'};
        }
        return {success: true, data:{postid}};
        
       
    }catch(error){
        console.log('removePost error:',error);
        return {success: false, msg:'Cloud not remove the post'};
    }
 }



 export const  createComment = async (comment)=>{
    try{
        const {data,error} = await supabase
        .from('comments')
        .insert(comment)
        .select()
        .single();

        if(error){
            console.log('comment error:',error);
            return {success: false, msg:'Cloud not create your comment'};
        }
        return {success: true, data:data};
        
       
    }catch(error){
        console.log('postLike error:',error);
        return {success: false, msg:'Cloud not create your comment'};
    }
 }

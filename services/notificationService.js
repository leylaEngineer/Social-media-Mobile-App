import { supabase } from "../lib/supabase";

export const  createNotification = async (notification)=>{
    try{
        const {data,error} = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single();

        if(error){
            console.log('notification error:',error);
            return {success: false, msg:'Someting went wrong'};
        }
        return {success: true, data:data};
        
       
    }catch(error){
        console.log('notification error:',error);
        return {success: false, msg:'Someting went wrong'};
    }
 }


 export const  fetchNotifications = async (receiverid)=>{
    try{
        const {data,error}= await supabase
        .from('notifications')
        .select(`
            *,
           sender: senderid (id,name,image)
           
          
        `)
        .eq('receiverid',receiverid)
        .order("created_at",{ascending:false})
      
        if(error){
            console.log('fetchNotifications error:',error);
            return {success: false, msg:'Cloud not fetch notification'};
        }
        return {success: true, data:data};
        
       
    }catch(error){
        console.log('fetchNotifications:',error);
        return {success: false, msg:'Cloud not fetch notification'};
    }
 }

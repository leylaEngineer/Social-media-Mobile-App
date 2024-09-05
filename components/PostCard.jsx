import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState,useCallback } from 'react'
import { theme } from '../constants/them'
import { hp,wp } from '../helpers/common'
import Avatar from './Avatar'
import moment from 'moment/moment'
import Icon from '../assets/icons'
import { Image } from 'expo-image'
import { downloadFile, getSupabaseFileUrl } from '../services/imageService'
import { Video } from 'expo-av'
import { createPostLike, removePostLike } from '../services/postService'
import Loading from './Loading'





const PostCard = ({
    item,
    currentUser,
    router,
    hasShadow=true,
    showMoreIcon= true,
    showDelete=false,
    onDelete=()=>{},
    onEdit=()=>{}

}) => {
  const shadowStyles = {
    shadowOffset:{
        width:0,
        height:2
    },
    shadowOpacity:0.06,
    shadowRadius:6,
    elevation:1
  }
  const [likes,setLikes] = useState([]);
  const [loading,setLoading]= useState(false);
  useEffect(()=>{
    setLikes(item?.postLikes);
  },[])

  const openPostDetails = ()=>{
    if(!showMoreIcon) return null;

    router.push({pathname: 'postDetail' ,params: {postid: item?.id}})
  }

  const onLike = async ()=>{
    if(liked){
        //remove like
        let updatedLikes =likes.filter(like=> like.userid!=currentUser?.id);
          
        setLikes([...updatedLikes])
        let res = await removePostLike(item?.id, currentUser?.id);
        console.log('remove like:',res);
        if(!res.success){
            Alert.alert("post:","Something went wrong!");
        }
    }else{
       //create like
       let data ={
        userid : currentUser?.id,
        postid: item?.id
    }
    setLikes([...likes, data])
    let res = await createPostLike(data);
    console.log('added like:',res);
    if(!res.success){
        Alert.alert("post:","Something went wrong!");
    }
    }
    

  }

  const onShare = async () =>{
    let content = {message: item?.body};
    if(item?.file){
        //download the file then share the local uri
        setLoading(true);
        let url = await  downloadFile(getSupabaseFileUrl(item?.file).uri);
        setLoading(false);
        content.url = url;

    }
    Share.share(content);

  }

  const handlePostDelete =()=>{
    Alert.alert('Confirm',"Are you sure you want to Delete?",[
        {
            text: 'Cancel',
            onPress: ()=> console.log('modal cancelled'),
            style:'cancel'
        },
        {
          text:'Delete',
          onPress:()=> onDelete(item),
          style:'destructive'
  
        }
      ])

  }
 // console.log("post item comments", item?.comments);
 const createdAt = moment(item?.created_at).format('MMM D');
  //const createAt = moment(item?.create_at).format('MMM D');
  const liked =likes.filter(like => like.userid==currentUser?.id)[0]? true: false;

  

  return (
    <View style={[styles.container,hasShadow && shadowStyles]}>
     <View style={styles.header}>
     {/**user info and post time */}
     <View style={styles.userInfo}>
       {/**  <Avatar 
        size={hp(4.5)}
        uri={item?.user?.image}
        rounded={theme.radius.md}
        />*/}
      
        <Avatar 
          uri={item?.user?.image}
          size={hp(5)}
          rounded={theme.radius.sm}
          
        />
      
        <View style={{gap:2}}>
            <Text style={styles.username}>{item?.user?.name}</Text>
            <Text style={styles.postTime}>{createdAt}</Text>
        </View>

     </View>
     {
        showMoreIcon && (
            <TouchableOpacity onPress={openPostDetails}>
               <Icon name="menu" size={hp(3.4)} strokeWidth={3} color={theme.colors.text}/>
            </TouchableOpacity>

        )
     }
 
     {
        showDelete && currentUser.id == item?.userid && (
            <View style={styles.actions}>
            <TouchableOpacity onPress={()=>onEdit(item)}>
               <Icon name="edit" size={hp(2.5)}  color={theme.colors.text}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePostDelete}>
               <Icon name="delete" size={hp(2.5)}  color={theme.colors.violetred}/>
            </TouchableOpacity>
            </View>
        )

     }
     

     </View>
     {/**Post ody & media */}
     <View style={styles.content}>
        <View style={styles.postBody}>
            <Text>{item?.body}</Text>
        </View>
        {/**post image */}
        {
            item?.file && item?.file.includes('postImage') && (
                <Image
                source={getSupabaseFileUrl(item?.file)}
                transition={100}
                style={styles.postMedia}
                contentFit='cover'
                />
            )
        }
        {/**post video */}
        {
            item?.file && item?.file?.includes('postVideos') && (
                <Video 
                style={[styles.postMedia,{height:hp(60)}]}
                source={getSupabaseFileUrl(item?.file)}
                useNativeControls
                resizeMode='cover'
                isLooping
                />
            )

        }
     </View>
     {/**like,comment,share */}
     <View style={styles.footer}>
        <View style={styles.footerButton}>
        <TouchableOpacity onPress={onLike}>
            <Icon name="heart" size={24} fill={liked? theme.colors.rose: 'transparent'} color={liked? theme.colors.rose: theme.colors.textLight}/>
        </TouchableOpacity>
        <Text style={styles.count}>
            {
                likes?.length
            }
        </Text>

        </View>
        <View style={styles.footerButton}>
        <TouchableOpacity onPress={openPostDetails}>
            <Icon name="comment" size={24} color={theme.colors.textLight}/>
        </TouchableOpacity>
        <Text style={styles.count}>
            {
                item?.comments[0]?.count
            }
        </Text>

        </View>
        <View style={styles.footerButton}>
        {
            loading? (
                <Loading size='small'/>
            ):(
                <TouchableOpacity onPress={onShare} >
                   <Icon name="share" size={24} color={ theme.colors.textLight}/>
               </TouchableOpacity>
            )
        }
        
        

        </View>
     </View>
    </View>
  )
}

export default PostCard

const styles = StyleSheet.create({
    count:{
        color:theme.colors.text,
        fontSize:hp(1.8),
    },
    actions:{
        flexDirection:'row',
        alignItems:'center',
        gap:18,
    },
    footerButton:{
        marginLeft:5,
        flexDirection:'row',
        alignItems:'center',
        gap:4,
    },
    footer:{
        flexDirection:'row',
        alignItems:'center',
        gap:15
    },
    postBody:{
        marginLeft:5,
    },
    postMedia:{
        height:hp(50),
        width:'100%',
        borderRadius:theme.radius.xl,
        borderCurve:'continuous',
    },
    content:{
        gap:10,
    },
    username:{
        fontSize:hp(1.7),
        color:theme.colors.textDark,
        fontWeight:theme.fonts.medium

    },
    postTime:{
        fontSize:hp(1.7),
        color:theme.colors.textLight,
        fontWeight:theme.fonts.medium,
    },
    userInfo:{
        flexDirection:'row',
        alignItems:'center',
        gap:8,
    },
    header:{
        flexDirection:'row',
        justifyContent:'space-between',
    },
    container:{
        gap:10,
        marginBottom:15,
        borderRadius:theme.radius.xxl*1.1,
        borderCurve:'continuous',
        padding:10,
        paddingVertical:12,
        backgroundColor:'white',
        borderWidth:0.5,
        borderColor:theme.colors.gray,
        shadowColor:'#000',
    },

})
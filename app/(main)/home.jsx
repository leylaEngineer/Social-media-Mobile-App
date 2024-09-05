import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React ,{useEffect, useState} from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { Button } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { hp,wp } from '../../helpers/common';
import { theme } from '../../constants/them';
import Icon from '../../assets/icons';
import { useRouter } from 'expo-router';
//import { Avatar } from '@rneui/themed';
import Avatar from '../../components/Avatar';
import { fetchPosts } from '../../services/postService';
import PostCard from '../../components/PostCard';
import Loading from '../../components/Loading';
import {getUserData} from '../../services/userService';




var limit=0;
const Home = () => {
    const {user,setAuth} =useAuth();
    const router = useRouter();
    const [posts,setPosts]=useState([]);
    const [hasMore,setHasMore]= useState(true);
    const [notificationCount,setNotificationCount] =useState(0);

    const handlePostEvent = async (payload)=>{
      console.log('payload:',payload);
      if (payload.eventType == 'INSERT' && payload?.new?.id){
        let newPost = {...payload.new};
        let res = await getUserData(newPost.userid);
        newPost.postLikes =[];
        newPost.comments=[{count:0}]
        newPost.user =res.success? res.data:{};
        setPosts(prevPosts =>[newPost, ...prevPosts]);
      }
      if(payload.eventType=='DELETE' &&  payload.old.id){
        setPosts(prevPosts=>{
          let updatedPost = prevPosts.filter(post=>post.id!=payload)
          return updatedPost;
        })


      }
      if (payload.eventType == 'UPDATE' && payload?.new?.id){
       setPosts(prevPosts=>{
        let updatedPost = prevPosts.map(post=>{
          if(post.id==payload.new.id){
            post.body = payload.new.body;
            post.file = payload.new.file;
          }
          return post;
        });
        return updatedPost;
       })
      }
    }

    const handleNewNotification = async (payload)=>{
      console.log('got new notification:',payload);
      if(payload.eventType=='INSERT' && payload.new.id){
        setNotificationCount(prev=>prev+1);
      }

    }

    useEffect (()=>{

      let postChannel = supabase
      .channel('posts')
      .on('postgres_changes',{event: '*', schema: 'public',table:'posts'},handlePostEvent)
      .subscribe();

      //getPosts();

      let notificationChannel = supabase
      .channel('notifications')
      .on('postgres_changes',{event: 'INSERT', schema: 'public',table:'notifications',filter:`receiverid=eq.${user.id}`},handleNewNotification)
      .subscribe();

      return ()=>{
        supabase.removeChannel(postChannel);
        supabase.removeChannel(notificationChannel);
      }
    },[])

    const getPosts = async () =>{
      //call the api here
      if(!hasMore) return null;
      limit = limit + 10;
      console.log('fetching post:',limit);
      let res = await fetchPosts(limit);
     if(res.success){
      if(posts.length==res.data.length) setHasMore(false);
      setPosts(res.data);
     }
      
    }
    //console.log('user',user);
    //const onLogout = async ()=>{
       // setAuth(null);
      //  const {error} = await supabase.auth.signOut();
        //if(error){
          //  Alert.alert('Sign out', "Error signing out!");

        //}

    //}
  return (
    <ScreenWrapper bg="white">
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
      <Text style={styles.title}>AstralUp</Text>
      <View style={styles.icons}>
      <Pressable onPress={()=> {
        setNotificationCount(0) 
        router.push('notifications');
        }}>
        <Icon name="heart" size={hp(3.2)} strokeWidth={2} color={theme.colors.text}/>
        {
          notificationCount>0 && (
            <View style={styles.pill}>
              <Text style={styles.pillText}>{notificationCount}</Text>
            </View>
          )
        }
      </Pressable>
      <Pressable onPress={()=> router.push('newPost')}>
        <Icon name="plus" size={hp(3.2)} strokeWidth={2} color={theme.colors.text}/>
      </Pressable>
      <Pressable onPress={()=> router.push('profile')}>
        <Avatar 
          uri={user?.image}
          size={hp(4.3)}
          rounded={theme.radius.sm}
          style={{borderWidth:2}}
        />
      </Pressable>

      </View>

      </View>
      {/** posts */}
      <FlatList
      data={posts}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listStyle}
      keyExtractor={item=>item.id.toString()}
      renderItem={({item})=><PostCard
      item={item}
      currentUser={user}
      router={router}

      />
      }
      onEndReached={()=>{
        getPosts();
        console.log("got to the end");
      }}
      onEndReachedThreshold={0}
      ListFooterComponent={hasMore?(
        <View style={{marginVertical: posts.length==0? 200: 30}}>
        <Loading/>
        </View>
      ):(
        <View style={{marginVertical:30}}>
              <Text style={styles.noPosts}>No more posts</Text>
        </View>
      )}
      />




    </View>
      
    { /*<Button title="logout" onPress={onLogout}/>*/ }
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
  pillText:{
    color:'white',
    fontSize: hp(1.2),
    fontWeight: theme.fonts.bold
  },
  pill:{
    position:'absolute',
    right:-10,
    top:-4,
    height:hp(2.2),
    width:hp(2.2),
    justifyContent:'center',
    alignItems:'center',
    borderRadius:20,
    backgroundColor: theme.colors.roseLight
  },
  noPosts:{
    fontSize:hp(2),
    textAlign:'center',
    color:theme.colors.text
  },
  listStyle:{
    paddingTop:20,
    paddingHorizontal:wp(4)
  },
  icons:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    gap:18
  },
  avaratImage:{
    height:hp(4.3),
    width:hp(4.3),
    borderRadius:theme.radius.sm,
    borderCurve:'continuous',
    borderColor:theme.colors.gray,
    borderWidth:3
  },
  title:{
    color:theme.colors.text,
    fontSize:hp(3.2),
    fontWeight:theme.fonts.bold
  },
  header:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    marginBottom:10,
    marginHorizontal:wp(4)
  },
  container:{
    flex:1,
    // paddinHorizontal:wp(4)
  },

   

  
})
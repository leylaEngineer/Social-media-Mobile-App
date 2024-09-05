import { StyleSheet, Text, View ,ScrollView,TouchableOpacity, Pressable, TextInput, Alert} from 'react-native'
import React ,{useRef, useState,useEffect} from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { theme } from '../../constants/them'
import { hp ,wp} from '../../helpers/common'
import Header from '../../components/Header'
import { useAuth } from '../../contexts/AuthContext'
import Avatar from '../../components/Avatar';
import RichTextEditor from '../../components/RichTextEditor'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Icon from '../../assets/icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native'
import { getSupabaseFileUrl } from '../../services/imageService'
import { Video } from 'expo-av'
import Button from '../../components/Button'
import { createOrUpdatePost } from '../../services/postService'


const NewPost = () => {
 
  const post = useLocalSearchParams();
  console.log('post:',post);
  const {user} = useAuth();
  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const router = useRouter();
  const [loading,setLoading]= useState(false);
  const [file,setFile]= useState(file);
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
   
  useEffect(()=>{
    if(post && post.id){
      bodyRef.current = post.body;
      setFile(post.file || null);
      setTimeout(()=>{
        setInputValue(post.body);

      },300);
     
      
    }
  },[])

  const [inputValue, setInputValue] = useState('');
  const handleTextChange = (text) => {
    setInputValue(text);
    //console.log(`User entered: ${text}`);
  };


  const onSubmit = async (event) => {
    event.preventDefault();
    //console.log("body:", inputValue);
    //console.log('file:',file);
    if(!inputValue && !file){
      Alert.alert('Post',"Please choose an image or add post body");
      return;
    }
    let data = {
      file,
      body:inputValue,
      userid: user?.id,
    }

    if(post && post.id) data.id = post.id;
    //create post
    setLoading(true);
    let res = await createOrUpdatePost(data);
    setLoading(false);
   // console.log("post result:",res);
   if(res.success){
    setFile(null);
    setInputValue('');
    router.back();
  }else{
    Alert.alert('Post',res.msg);
  }
    
   
    }

  

  const onPick =async (isImage)=>{
    let mediaConfig ={

      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing:true,
      aspect:[4,3],
      quality:0.7,
    }
    if(!isImage){
      mediaConfig={
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing:true,
      } 
    }

    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);
    
    if(!result.canceled){
      setFile(result.assets[0]);
    }

  }
  const isLocalFile = file =>{
    if(!file) return null;
    if (typeof file == 'object') return true;
  }

  const getFileType = file =>{
    if(!file) return null;
    if (isLocalFile(file)){
      return file.type;

    }
    //check image or video for remote file
    if(file.includes('postImage')){
      return 'image';
    }
    return 'video';
  }
  const getFileUri = file=>{
    if(!file) return null;
    if(isLocalFile(file)){
      return file.uri;
    }
    return getSupabaseFileUrl(file)?.uri;

  }
  return (
    <ScreenWrapper bg="white">
    <View style={styles.container}>
    <Header title="Create Post"/>
    <ScrollView contentContainerStyle={{gap:20}}>
      {/**avatar */}
      <View style={styles.header}>
      <Avatar
      uri={user?.image}
      size={hp(6.5)}
      rounded={theme.radius.xl}
      />
      <View style={{gap:2}}>
      <Text style={styles.username}>
      {
        user && user.name
      }
 
      </Text>
      <Text style={styles.publicText}>
        Public
      </Text>

      </View>

      </View>
      <View style={styles.textEditor}>
      
      
      <TextInput
       style={styles.input}
       placeholder={"What's on your mind?"}
       multiline
       ref={inputRef}
       value={inputValue}
       onChangeText={handleTextChange}/>
      
      </View>
      {
        file && (
          <View style={styles.file}>
            {
              getFileType(file) == 'video'?(
               <Video
               style={{flex:1}}
               source={{
                uri: getFileUri(file)}}
                useNativeControls
                resizeMode='cover'
                isLooping
                />
              ):(
                <Image source={{uri:getFileUri(file)}} resizeMode='cover' style={{flex:1}}/>
              )
            }
            <Pressable style={styles.closeIcon} onPress={()=> setFile(null)}>
              <Icon name="delete" size={20} color="white"/>
            </Pressable>
          </View>
        )
      }

      <View style={styles.media}>
        <Text style={styles.addImageText}></Text>
        <View style={styles.mediaIcons}>
          <TouchableOpacity onPress={()=> onPick(true)}>
            <Icon name="image" size={30} color={theme.colors.dark}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> onPick(false)}>
            <Icon name="video" size={30} color={theme.colors.dark}/>
          </TouchableOpacity>
        </View>
      </View>

    </ScrollView>
    <Button
    buttonStyle={{height:hp(6.2)}}
    title={post && post.id? "Update":"Post"}
    loading={loading}
    hasShadow={false}
    //onPress={[onSubmit,handlePostSubmit]}
    onPress={onSubmit}
    />
    
    </View>
     
    </ScreenWrapper>
  )
}

export default NewPost

const styles = StyleSheet.create({
  closeIcon:{
    position:'absolute',
    top:10,
    right:10,
    padding:7,
    borderRadius:50,
    backgroundColor:'rgba(255,0,0,6)'
    //shadowColor:theme.colors.textLight,
    //shadowOffset:{width:0,height:3},
    //shadowOpacity:0.6,
    //shadowRadius:8
  },
  video:{

  },
  file:{
    height: hp(30),
    width:'100%',
    borderRadius:theme.radius.xl,
    overflow:'hidden',
    borderCurve:'continuous',
  },
  imageIcon:{
    //backgroundColor:theme.colors.gray,
    borderRadius:theme.radius.md,
    //padding:6,
  },
  addImageText:{
    fontSize:hp(1.9),
    fontWeight:theme.fonts.semibold,
    color:theme.colors.text,
  },
  mediaIcons:{
    flexDirection:'row',
    alignItems:'center',
    gap:15
  },
  media:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    borderWidth:1.5,
    padding:12,
    paddingHorizontal:18,
    borderRadius:theme.radius.xl,
    borderCurve:'continuous',
    borderColor:theme.colors.gray

  },
  textEditor:{
    //marginTop:10,
  },
  publicText:{
    fontSize:hp(1.7),
    fontWeight:theme.fonts.medium,
    color:theme.colors.textLight,
  },
  avatar:{
    height:hp(6.5),
    width:hp(6.5),
    borderRadius:theme.radius.xl,
    borderCurve:'continuous',
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.1)'
  },
  username:{
    fontSize:hp(2.2),
    fontWeight:theme.fonts.semibold,
    color:theme.colors.text,
  },
  header:{
    flexDirection:'row',
    alignItems:'center',
    gap:12,
  },
  title:{
    //marginBottom:10,
    fontSize:hp(2.5),
    fontWeight:theme.fonts.semibold,
    color:theme.colors.text,
    //textAlign:'center',
  },
  container:{
    //backgroundColor:'red',
    flex:1,
    marginBottom:30,
    paddingHorizontal:wp(4),
    gap:15,
  },
  input:{
    
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  
  }

   



})
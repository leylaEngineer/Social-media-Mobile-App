import ScreenWrapper from '@/components/ScreenWrapper'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { View,Text, StyleSheet,Image, Pressable } from 'react-native'
import {wp,hp} from '../helpers/common'
import {theme,Colors} from '../constants/them'
import Button from '../components/Button'
import { useRouter } from 'expo-router'
const welcome = () => {
         const router = useRouter();

    return (
        <ScreenWrapper bg="white">
        <StatusBar style='dark'/>
        <View style={styles.container}>
           {/* Welcome Image*/ }
           <Image style={styles.welcomeImage}  resizemode ='contain' source={require('../assets/images/4707071.jpg')}/>
           {/** title */}
           <View style={{gap:20}}>
            <Text style={styles.title}>AstralUp!</Text>
            <Text style={styles.punchline}>
                 Where every moment is a chapter, and every connection tells a tale.
            </Text>
           </View>
           {/**footer */}
           <View style={styles.footer}>
            <Button
                title='Getting Started'
                buttonStyle={{marginHorizontal:wp(3)}}
                onPress={()=> router.push('signUp')}
            />
            <View style={styles.bottomTextContainer}>
                <Text style={styles.loginText}>
                    Already have an account!
                </Text>
                <Pressable>
                <Pressable onPress={() => router.push('login')}>
                    <Text style={[styles.loginText,{color:theme.colors.violetred,fontWeight:theme.fonts.semibold}]}>
                        Login
                    </Text>
                </Pressable>

                </Pressable>
            </View>
           </View>


        </View>
           
        </ScreenWrapper>
    )
}

export default welcome

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'space-around',
        backgroundColor:'white',
        paddingHorizontal: wp(4) 

    },
    welcomeImage:{
        height:hp(50),
        width:wp(100),
        alignSelf:'center',
    },
    title:{
        color:theme.colors.text,
        fontSize:hp(4),
        textAlign:'center',
        fontWeight:theme.fonts.extraBold
    },
    punchline:{
        textAlign:'center',
        paddingHorizontal:wp(10),
        fontSize:hp(1.7),
        color:theme.colors.text
    },
    footer:{
        gap:30,
        width:'100%'
    },
    bottomTextContainer:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        gap:5


    },
    loginText:{
        textAlign:'center',
        color:theme.colors.text,
        fontSize:hp(1.6)
    }

})

import { StyleSheet, Text, View,TextInput } from 'react-native'
import React, {useRef,useState} from 'react'
import { theme } from '../constants/them'


const RichTextEditor = ({
    editorRef,
    onChange,
    onSubmit,
}) => {
  const handleSubmit = () => {
    onSubmit(bodyRef.current);
  };
  const [inputValue, setInputValue] = useState('');

const handleTextChange = (text) => {
  setInputValue(text);
  console.log(`User entered: ${text}`);
};
  const bodyRef = useRef('');
  return (
    <View style={styles.container}>
      
       <TextInput
       ref={editorRef}
       
       style={styles.input}
       editorStyle={styles.contentStyle}
       placeholder={"What's on your mind?"}
       multiline
       onSubmitEditing={handleSubmit}
        onChange={(text) => {
          
          onChange(text);
          bodyRef.current = text;
        }}
      
       />

    </View>
  )
}

export default RichTextEditor

const styles = StyleSheet.create({
  
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginRight: 12,
  },
})
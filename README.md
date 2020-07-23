<h1 align="center">React Native Awesome Chat</h1>
<h3 align="center">An easy to integrate library to create flexible, customizable chat UIs for React Native</h2>
<div style="margin:auto;text-align:center;margin-left:50%" align="center">
<a href="https://ibb.co/ssCsFht"><img src="https://i.ibb.co/BTGTgmw/chat1.gif" alt="chat1" border="0" width="240" height="450"></a>
<a href="https://ibb.co/YNy3fS9"><img src="https://i.ibb.co/p1Rx4TD/chat2.gif" alt="chat2" border="0" width="240" height="450"></a>
<a href="https://ibb.co/sK0h25W"><img src="https://i.ibb.co/K2MYXNK/chat3.gif" alt="chat3" border="0" width="240" height="450"></a>
</div>
<div style="margin:auto; text-align:center" align="center">
<a href="https://ibb.co/j6RMb7M"><img src="https://i.ibb.co/HFdzBmz/chat4.gif" alt="chat4" border="0" width="240" height="450"></a>
<a href="https://ibb.co/RSh4bM5"><img src="https://i.ibb.co/b3HRmyf/chat5.gif" alt="chat5" border="0" width="240" height="450"></a>
</div>

# Features

- Auto-scroll animation as more messages are sent
- Image uploading
- Image backgrounds
- Tap to resend a message
- Swipe message to see timestamp
- React Native `0.60+` support

# Installation

`npm install --save react-native-awesome-chat`
OR

`yarn add react-native-awesome-chat`

## Dependencies

This project uses 2 native libraries : `react-native-image-picker` and `react-native-vector-icons`

If these libraries aren't already linked in your project, you need to link them. React Native `0.60+` has the handy auto-linking feature which makes this easier. Just make sure your `Info.plist` has `FontAwesome` as one of its `UIAppFonts` :

```
<key>UIAppFonts</key>
    <array>
        <string>FontAwesome.ttf</string>
    </array>
</dict>
</plist>
```
Then, in your project's root directory, run :

`cd ios`

`pod install`


That's it - this will make sure the libraries are properly linked. 

If you're using React Native `< 0.60`, then you will need to refer to the docs for [react-native-image-picker](https://github.com/react-native-community/react-native-image-picker) and [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons) to understand how to link the libraries, but it's still a pretty simple process.

# Usage
```jsx
import AwesomeChat from 'react-native-awesome-chat';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            messages : [
                {body : "Hello", id : 1,
                timestamp : 1581418856, type : "sent", image_uri : ""},
                {body : "Hi", id : 2, 
                timestamp : 1581418856, type : "received", image_uri : ""}
            ],
        }
    }
    
    //AwesomeChat will pass the message object to this function
    sendMessage = async (message) => {
        let response = await axios.post(/*POST request to your DB*/)
        if(response.ok){
            return true;  
        } else {
            return false; //AwesomeChat will flag the message as unsent
        }
    }

    render(){
        return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
            <View style={{height : '100%'}}>
                <AwesomeChat 
                    onSendMessage={this.sendMessage} 
                    messages={this.state.messages}
                    //If new messages come in, just update this.state.messages
                />
            </View>
            </SafeAreaView>
        </>
        );
    }
};


```

## Message Object 

```js
{
    body : "", /* Contents of message */
    id : "", /* Unique ID for the message - AwesomeChat will generate one for you for new messages */
    timestamp : 0, /* UNIX timestamp -  Can be retrieved from .getTime() on a Javascript Date Object */
    type : "", /* "sent" or "received" */
    image_uri : "" /* image uri if message is an image. Otherwise, can be left as an empty string. 
    AwesomeChat will populate this with the uri
    returned by ImagePicker for newly sent messages
    */
}

```

# Props

Prop | Type | Description                                                                               
---- | ---- | -----------
| `messages`| `Array`| messages to render                                                                       
| `onSendMessage`| `function` | Callback function for when a message is sent. Should return `true` if the message was successfully sent and `false` otherwise for "Tap to Resend" to work (See example above)                                     
| `sentMessageStyle`| `Object`| (optional) Style for sent messages                                      
| `receivedMessageStyle`| `Object`| (optional) Style for received messages  
| `unsentMessageStyle`| `Object`| (optional) Style for unsent messages 
| `sentTextStyle`| `Object`| (optional) Style for text of sent messages
| `receivedTextStyle`| `Object`| (optional) Style for text of received messages  
| `unsentTextStyle`| `Object`| (optional) Style for text of unsent messages                               
| `backgroundColor`| `string`| (optional) Background color             
| `backgroundImage`| `Object` | (optional) Background image - the same object passed to the `source` prop of `Image`
| `timestampColor`| `string`| (optional) Timestamp color           
| `errorColor`| `string`| (optional) Color of 'Tap to resend' 
| `placeholderTextColor`| `string`| (optional) Color of input bar placeholder text        
| `leftIcon`|`Icon`| (optional) Left icon of input bar       
| `rightIcon`| `Icon`| (optional) Right icon of input bar                                 
| `inputContainerStyle`| `Object`| (optional) Style of input bar container     
| `inputStyle`| `Object`| (optional) Style of input in input bar 

# Some other notes

- This library is a great choice if you're looking to quickly add some type of aesthetic chat UI to your project as an add-on feature, because it's very easy to integrate. But if you're looking to build an entire messaging app, you might find [react-native-gifted-chat](https://github.com/FaridSafi/react-native-gifted-chat) a better choice.
- The message object this library uses doesn't include a field for the messager's identity - you
will need to add any other additional context to this object (which shouldn't be difficult). I decided to stick with these simple fields because they're really all that's required for the UI. 
- `AwesomeChat` doesn't generate a timestamp for a message because it's assumed that the timestamp is only official once the server records the message. `AwesomeChat` will render timestamps for messages that have the timestamp field filled. For newly sent messages, the timestamp will become visible once the message finishes a round-trip to and then from the server.

# License

- [MIT](https://github.com/Sidharth1999/react-native-awesome-chat/blob/master/LICENSE)

# Author

You can email me at sidharthr99@g.ucla.edu if you have any questions!

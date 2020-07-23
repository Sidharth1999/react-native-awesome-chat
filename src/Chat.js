import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    Image,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    SafeAreaView,
    Keyboard,
    ImageBackground
} from "react-native";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import ImagePicker from "react-native-image-picker";
import MessageComponent from './Message';
import sha1 from 'js-sha1';

const keyboardVerticalOffsets = {
    "812" : 44,
    "667" : 20,
    "736" : 20
}

const { width, height } = Dimensions.get("window");

class AwesomeChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: "",
            messages: [ ... this.props.messages ]
        };
        this.messageRefs = {};
    }

    shouldComponentUpdate(nextProps, nextState){
        if(nextProps.messages.length > this.props.messages.length){
            return true;
        }
        return true;
    }

    componentDidUpdate(prevProps) {
        if (this.props.messages.length !== prevProps.messages.length) {
            this.setState({
                messages: [ ... this.props.messages ]
            })
        }
    }

    getMessageById = (id) => {
        for(var i = 0; i < this.state.messages.length; i++){
            if(this.state.messages[i].id == id){
                return this.state.messages[i];
            }
        }
        return null;
    }

    sendPicture = async () => {
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };
        ImagePicker.showImagePicker(options, async (response) => {
            if (!(response.didCancel || response.error || response.customButton)) {
                let message = {
                    body : "", 
                    id :  sha1(response.uri + new Date().toString()),
                    timestamp : "",
                    type : "sent",
                    image_uri : response.uri
                }
                this.sendMessage(message)
            }
        });
    }
    

    sendMessageAgain = async (id) => {
        this.messageRefs[id].markSent();
        let message = this.getMessageById(id);
        let success = await this.props.onSendMessage(message);
        if(!success){
            this.messageRefs[id].markUnsent();
        }
    }

    craftMessage = async () => {
        if(this.state.input == "")
            return;
        let message = {
            body : this.state.input, 
            id : sha1(this.state.input + new Date().toString()),
            timestamp : "",
            type : "sent",
            image_uri : ""
        }
        this.sendMessage(message)
    };

    sendMessage = async (message) => {
        var messages = [ ... this.state.messages ];
        messages.push(message);
        this.setState({
            messages: messages,
            input: "",
        }, async () => {
            let success = await this.props.onSendMessage(message);
            if(!success){
                this.messageRefs[message.id].markUnsent();
            } 
        });
    };

    renderChatView = () => {
        const leftIcon =  <TouchableOpacity onPress={this.sendPicture}>
                            {this.props.leftIcon || <Icon name="camera" size={24} color={"#bcbcbc"} />}
                          </TouchableOpacity>
        const rightIcon = <TouchableOpacity onPress={this.craftMessage}>
                            {this.props.rightIcon || <Icon name="arrow-circle-up" size={30} color={this.props.rightIconColor || "#b8ccff"} />}
                          </TouchableOpacity>
        return(
          <>
            <View style={styles.scrollViewContainerStyle}>
                <ScrollView
                    onContentSizeChange={(contentWidth, contentHeight) => this._scroll.scrollToEnd({ animated: true }) }
                    contentContainerStyle={{ flexGrow: 1 }}
                    ref={ref => (this._scroll = ref)}
                    keyboardShouldPersistTaps='handled'
                    keyboardDismissMode="on-drag"
                >
                    <View style={styles.messagesContainerStyle}>
                        {this.state.messages.map((message)=> (
                            <MessageComponent
                                ref={(ref) => this.messageRefs[message.id] = ref}
                                body={message.body}
                                id={message.id}
                                image_uri={message.image_uri}
                                timestamp={message.timestamp}
                                type={message.type}
                                key={message.id}
                                tryAgain={this.sendMessageAgain}
                                sentMessageStyle={this.props.sentMessageStyle || null}
                                unsentMessageStyle={this.props.unsentMessageStyle || null}
                                receivedMessageStyle={this.props.receivedMessageStyle || null}
                                sentTextStyle={this.props.sentTextStyle || null}
                                unsentTextStyle={this.props.unsentTextStyle || null}
                                receivedTextStyle={this.props.receivedTextStyle || null}
                                timestampColor={this.props.timestampColor || null}
                                errorColor={this.props.errorColor || null}
                            />)
                        )}
                    </View>
                </ScrollView>
            </View>
            <View style={styles.inputViewStyle}>
                <Input
                    onFocus={()=>this._scroll.scrollToEnd({ animated: true })}
                    placeholder="Type a message ..."
                    placeholderTextColor={this.props.placeholderTextColor}
                    onChangeText={text => this.setState({ input: text })}
                    value={this.state.input}
                    multiline
                    inputContainerStyle={{...styles.inputContainerStyle, ... this.props.inputContainerStyle}}
                    inputStyle={{...styles.inputStyle, ... this.props.inputStyle}}
                    leftIcon={leftIcon}
                    rightIcon={rightIcon}
                    leftIconContainerStyle={{paddingLeft : "1.5%"}}
                    rightIconContainerStyle={{paddingRight: "1.5%"}}
                />
            </View>
          </>
        )
    }

    render() {
        return (
            <KeyboardAvoidingView 
              behavior="padding" 
              enabled 
              keyboardVerticalOffset={keyboardVerticalOffsets[height] || 20} 
              style={{...styles.containerStyle, backgroundColor: this.props.backgroundColor || "white"}}>
              <SafeAreaView style={{flex : 1}}>
                 {
                    this.props.backgroundImage ?
                    <ImageBackground 
                        style={{height : '100%', width : '100%'}} 
                        source={this.props.backgroundImage}
                    >
                       {this.renderChatView()}
                    </ImageBackground>
                    :
                    <>
                       {this.renderChatView()}
                    </>
                 }
              </SafeAreaView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    scrollViewContainerStyle : {
        height: '88%', 
        position : 'relative',
        paddingTop : "5%",
        paddingBottom : '3%'
    },
    messagesContainerStyle : {
        alignItems: "center", 
        flexGrow: 1 
    },
    containerStyle : {
        position: "relative",
        flex : 1
    },
    inputViewStyle : {
        position: "absolute",
        bottom: "0%",
        height : '12%',
        justifyContent : 'center'
    },
    inputContainerStyle : {
        borderWidth: 1,
        borderRadius: 20,
        width: 0.95 * width,
        backgroundColor: "white"
    },
    inputStyle : {
        paddingLeft: "2%",
        marginTop: "1.5%",
    }
});

export default AwesomeChat;

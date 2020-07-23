import React, {Component} from 'react';
import { Text, View, Image, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Swipeable from 'react-native-swipeable';

const {width, height} = Dimensions.get("window")
const dateToCondensedLocaleDateString = (date) => (date.toLocaleString().split(",")[1].split(" ")[1].substr(0, date.toLocaleString().split(",")[1].split(" ")[1].length - 3) + " " + date.toLocaleString().split(",")[1].split(" ")[2] + ", " + date.toLocaleString().split(",")[0].substr(0, date.toLocaleString().split(",")[0].length - 2))

export default class MessageComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageHeight: 0,
            sent : true
        };
    }

    tryAgain = () => {
        if(this.state.sent)
            return;
        this.props.tryAgain(this.props.id);
    }

    markUnsent = () => {
        this.setState({sent : false})
    }

    markSent = () => {
        this.setState({sent : true})
    }

    render() {
        let message = { ... this.props }
        let timestampStyle =  message.type == "sent" ?
                              {color : this.props.timestampColor || "grey", position : 'absolute', bottom : message.image_uri ? '15%' : '3%'} 
                            : {color : this.props.timestampColor || "grey", position : 'absolute', bottom : message.image_uri ? '15%' : '3%', right : '0%'}
        let Timestamp = <View style={{height : this.state.messageHeight, position : 'relative'}}>
                            <Text style={timestampStyle}>
                                {message.timestamp ? dateToCondensedLocaleDateString(new Date(message.timestamp * 1000)) : ""}
                            </Text>
                        </View>;

        var align =  "flex-end";
        var messageColor = "#147efb";
        var textColor = "white";
        if (message.type == "received") {
            align = "flex-start";
            messageColor = "lightgrey";
            textColor = "black";
        }
        var defaultMessageStyle = { backgroundColor: message.type == "sent" && !this.state.sent ? "lightblue" : messageColor }
        var defaultTextStyle = {color: textColor, padding: "3%"}

        var finalTextStyle = message.type == "sent" 
        ? !this.state.sent && this.props.unsentTextStyle != null 
          ? this.props.unsentTextStyle 
          : this.props.sentTextStyle != null 
            ? this.props.sentTextStyle 
            : defaultTextStyle
        : this.props.receivedTextStyle != null
          ? this.props.receivedTextStyle 
          : defaultTextStyle
        
        var finalMessageStyle = message.type == "sent" 
        ? !this.state.sent && this.props.unsentMessageStyle != null
           ? this.props.unsentMessageStyle 
           : this.props.sentMessageStyle != null 
             ? this.props.sentMessageStyle 
             : defaultMessageStyle
        : this.props.receivedMessageStyle != null
          ? this.props.receivedMessageStyle 
          : defaultMessageStyle

        return (
            <Swipeable 
                rightContent={message.type == "sent" ? Timestamp : null} 
                leftContent={message.type == "received" ? Timestamp : null}>
            {
               ! message.image_uri ? 
               <TouchableWithoutFeedback onPress={this.tryAgain}>
                    <View style={{ width: width, alignItems: align }}>
                        <View
                            onLayout={event => this.setState({messageHeight: event.nativeEvent.layout.height})}
                            key={message.id}
                            style={{...styles.messageStyle, ...finalMessageStyle}}
                        >
                            <Text style={{padding : '3%', ... finalTextStyle}}>
                                {message.body}
                            </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                 :
                <TouchableWithoutFeedback onPress={this.tryAgain}>
                    <View 
                    style={{alignItems : align, width : width}} 
                    onLayout={event => this.setState({messageHeight: event.nativeEvent.layout.height})}>
                        <Image source={{uri : message.image_uri}} style={styles.imageStyle} />
                    </View>
                </TouchableWithoutFeedback>
            }
            {
                !this.state.sent ?
                (
                <Text style={{...styles.sendAgainTextStyle, color : this.props.errorColor || "red"}}>
                    Failed to send. Tap to try again.
                </Text> 
                ) : null
            }
            </Swipeable>
        );
    }
}

const styles = StyleSheet.create({
    imageStyle : {
        height : 100,
        width : 100, 
        marginBottom : '5%',
        marginLeft : '5%',
        marginRight : '5%', 
        borderRadius : 10
    },
    messageStyle : {
        marginLeft: "5%",
        marginRight: "5%",
        borderRadius: 20,
        marginBottom: "5%"      
    },
    sendAgainTextStyle : {
        fontSize : 12, 
        textAlign : 'right', 
        paddingRight : '5%', 
        paddingBottom : '5%', 
        marginTop : '-3%'
    }
})


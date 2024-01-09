import {useEffect} from "react";
import {Button, StyleSheet, View} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => {
        return {
            shouldPlaySound: false,
            shouldSetBadge: false,
            shouldShowAlert: true
        };
    }
});

export default function App() {

    useEffect(() => {

        const subscription1 = Notifications.addNotificationReceivedListener((notification) => {
            console.log("Notification received")
            console.log(notification);
            const userName = notification.request.content.data.userName;
            console.log(userName);
        });

        const subscription2 = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log("Notification response received");
            console.log(response);
            const userName = response.notification.request.content.data.userName;
            console.log(userName);
        });

        return () => {
            subscription1.remove();
            subscription2.remove();
        };

    }, []);

    async function scheduleNotificationHandler() {
        const status = await Notifications.getPermissionsAsync();

        if (status.granted === false) {
            const result = await Notifications.requestPermissionsAsync();
            if (result.granted === false) {
                return;
            }
        }

        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'My first local notification',
                body: 'This is the body of the notification',
                data: {
                    userName: 'Max'
                }
            },
            trigger: {
                seconds: 5
            }
        });

        console.log("Notification scheduled");
    }

    return (
        <View style={styles.container}>
            <Button title="Schedule Notification" onPress={scheduleNotificationHandler}/>
            <StatusBar style="auto"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

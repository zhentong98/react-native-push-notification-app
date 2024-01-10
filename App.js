import {useEffect} from "react";
import {Alert, Button, Platform, StyleSheet, View} from 'react-native';
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

        async function configurePushNotifications() {

            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.DEFAULT,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            const {status} = await Notifications.getPermissionsAsync();

            let finalStatus = status;

            if (finalStatus !== 'granted') {
                const {status} = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                Alert.alert(
                    'Permission required',
                    'Push notifications need the appropriate permissions.'
                );
                return;
            }

            const pushTokenData = await Notifications.getExpoPushTokenAsync({
                projectId: "e54437c8-7032-4149-b109-d47bd72c4ace"
            });
            console.log(Platform.OS + " push token: " + pushTokenData.data);
        }

        configurePushNotifications().then();

    }, []);

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

    async function sendPushNotificationHandler() {
        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: 'ExponentPushToken[rZ3WwoKEiXXthzJMBOz4FT]',
                title: 'Test - sent from a device',
                body: 'This is the body of the notification',
            })
        });
    }

    return (
        <View style={styles.container}>
            <Button title="Schedule Notification" onPress={scheduleNotificationHandler}/>
            <Button title="Send Push Notification" onPress={sendPushNotificationHandler}/>
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

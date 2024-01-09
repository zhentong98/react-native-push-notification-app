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

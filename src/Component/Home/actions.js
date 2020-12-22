import todo from '../../assets/to-do-list.png';
import reminder from '../../assets/reminder.png';
import alarm from '../../assets/alarm-clock.png';
import location from '../../assets/pin.png';

export const actions = [
    {
        text: 'Add Todo',
        name: 'add_todo',
        position: 2,
        icon: todo,
    },
    {
        text: 'Add Reminder',
        name: 'add_reminder',
        position: 1,
        icon: reminder,
    },
    {
        text: 'Add Location',
        name: 'add_location',
        position: 3,
        icon: location,
    },
    {
        text: 'Add Alarm',
        name: 'add_alarm',
        position: 4,
        icon: alarm,
    },
];
